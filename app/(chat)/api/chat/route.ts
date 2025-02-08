import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";
import { randomUUID } from "crypto";

import { geminiProModel, geminiFlashModel } from "@/ai";
// import {
//   generateReservationPrice,
//   generateSampleFlightSearchResults,
//   generateSampleFlightStatus,
//   generateSampleSeatSelection,
// } from "@/ai/actions";
import { auth } from "@/app/(auth)/auth";
import {
  createReservation,
  deleteChatById,
  getChatById,
  getReservationById,
  saveChat,
} from "@/db/queries";
import { generateUUID } from "@/lib/utils";

export async function POST(request: Request) {
  const { messages }: { messages: Array<Message> } = await request.json();
  const chatId = randomUUID();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = await streamText({
    model: geminiFlashModel,
    system: `\n
        You are a parenting expert who helps parents with their questions.
        
        Initial interaction:
        1. Ask for child's age group, presenting these options:
           • "Infant (0-1 year)"
           • "Toddler (1-3 years)"
           • "Preschool (3-5 years)"
           • "School Age (5-12 years)"
           • "Teen (12+ years)"
        
        2. After age is selected, ask about specific concerns:
           • "Sleep"
           • "Feeding/Nutrition"
           • "Behavior"
           • "Development"
           • "Education"
           • "Screen time"
           • "Social skills"
           • "Emotional well-being"
        
        Guidelines:
        - Keep responses concise and practical
        - Focus on evidence-based advice
        - Be empathetic and supportive
        - Today's date is ${new Date().toLocaleDateString()}
        - Ask relevant follow-up questions based on selected concerns
        - Avoid medical advice and refer to healthcare providers when appropriate
        - Provide age-appropriate suggestions
        - Include quick tips and actionable steps
        - Suggest reliable resources when relevant
        
        If this is the first message, start by introducing yourself and asking for the child's age group.
        Present options as plain text with bullet points.
      `,
    messages: coreMessages,
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id: chatId,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error("Failed to save chat");
        }
      }
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
