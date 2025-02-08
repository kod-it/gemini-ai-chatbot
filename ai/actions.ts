import { generateObject } from "ai";
import { z } from "zod";

import { geminiFlashModel } from ".";

export async function generateParentingAdvice({
  childAge,
  topic,
}: {
  childAge: string;
  topic: string;
}) {
  const { object: advice } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate detailed parenting advice for a ${childAge} child regarding ${topic}. Include practical tips and recommendations.`,
    schema: z.object({
      title: z.string().describe("Title of the advice"),
      summary: z.string().describe("Brief summary of the main advice"),
      tips: z.array(
        z.string().describe("Practical parenting tips")
      ).min(3),
      recommendations: z.array(
        z.string().describe("Professional recommendations")
      ).min(2),
      warningSignals: z.array(
        z.string().describe("Warning signs to watch for")
      ).optional(),
    }),
  });

  return advice;
}

export async function generateDevelopmentMilestones({
  ageGroup,
}: {
  ageGroup: string;
}) {
  const { object: milestones } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate age-appropriate development milestones for ${ageGroup}`,
    schema: z.object({
      physical: z.array(z.string()).describe("Physical development milestones"),
      cognitive: z.array(z.string()).describe("Cognitive development milestones"),
      social: z.array(z.string()).describe("Social and emotional milestones"),
      language: z.array(z.string()).describe("Language development milestones"),
    }),
  });

  return milestones;
}

export async function generateCommonChallenges({
  ageGroup,
  topic,
}: {
  ageGroup: string;
  topic: string;
}) {
  const { object: challenges } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate common ${topic} challenges for ${ageGroup} and their solutions`,
    schema: z.object({
      challenges: z.array(z.object({
        issue: z.string().describe("Common parenting challenge"),
        solution: z.string().describe("Practical solution"),
        tips: z.array(z.string()).describe("Additional helpful tips"),
      })),
    }),
  });

  return challenges;
}

export async function generateRoutinePlanner({
  ageGroup,
  activityType,
}: {
  ageGroup: string;
  activityType: string;
}) {
  const { object: routine } = await generateObject({
    model: geminiFlashModel,
    prompt: `Create a ${activityType} routine for ${ageGroup}`,
    schema: z.object({
      routineName: z.string().describe("Name of the routine"),
      timeEstimate: z.string().describe("Estimated time for the routine"),
      steps: z.array(z.object({
        step: z.string().describe("Step in the routine"),
        duration: z.string().describe("Approximate duration"),
        tips: z.string().describe("Helpful tips for this step"),
      })),
      notes: z.array(z.string()).describe("Important notes about the routine"),
    }),
  });

  return routine;
}
