"use client";

import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";

import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { Weather } from "./weather";
import { AuthorizePayment } from "../flights/authorize-payment";
import { DisplayBoardingPass } from "../flights/boarding-pass";
import { CreateReservation } from "../flights/create-reservation";
import { FlightStatus } from "../flights/flight-status";
import { ListFlights } from "../flights/list-flights";
import { SelectSeats } from "../flights/select-seats";
import { VerifyPayment } from "../flights/verify-payment";
// import { AgeGroupSelector } from "../parenting/age-group-selector";
import { TopicSelector } from "../parenting/topic-selector";
// import { AdviceDisplay } from "../parenting/advice-display";

export const Message = ({
  chatId,
  role,
  content,
  toolInvocations,
  attachments,
}: {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  const isUser = role === "user";

  return (
    <motion.div
      className={`flex flex-row gap-3 mx-4 md:mx-0 ${isUser ? "justify-end" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
          <BotIcon className="w-4 h-4" />
        </div>
      )}

      <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          {content && typeof content === "string" && (
            <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
              <Markdown>{content}</Markdown>
            </div>
          )}
          
          {/* Render appropriate UI based on message function */}
          {toolInvocations && (
            <div className="flex flex-col gap-4">
              {toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "result") {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === "getWeather" ? (
                        <Weather weatherAtLocation={result} />
                      ) : toolName === "displayFlightStatus" ? (
                        <FlightStatus flightStatus={result} />
                      ) : toolName === "searchFlights" ? (
                        <ListFlights chatId={chatId} results={result} />
                      ) : toolName === "selectSeats" ? (
                        <SelectSeats chatId={chatId} availability={result} />
                      ) : toolName === "createReservation" ? (
                        Object.keys(result).includes("error") ? null : (
                          <CreateReservation reservation={result} />
                        )
                      ) : toolName === "authorizePayment" ? (
                        <AuthorizePayment intent={result} />
                      ) : toolName === "displayBoardingPass" ? (
                        <DisplayBoardingPass boardingPass={result} />
                      ) : toolName === "verifyPayment" ? (
                        <VerifyPayment result={result} />
                      ) : (
                        <div>{JSON.stringify(result, null, 2)}</div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div key={toolCallId} className="skeleton">
                      {toolName === "getWeather" ? (
                        <Weather />
                      ) : toolName === "displayFlightStatus" ? (
                        <FlightStatus />
                      ) : toolName === "searchFlights" ? (
                        <ListFlights chatId={chatId} />
                      ) : toolName === "selectSeats" ? (
                        <SelectSeats chatId={chatId} />
                      ) : toolName === "createReservation" ? (
                        <CreateReservation />
                      ) : toolName === "authorizePayment" ? (
                        <AuthorizePayment />
                      ) : toolName === "displayBoardingPass" ? (
                        <DisplayBoardingPass />
                      ) : null}
                    </div>
                  );
                }
              })}
            </div>
          )}
          
          {toolInvocations && (
            <div className="flex flex-col gap-4">
              {toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "result") {
                  const { result } = toolInvocation;

                  if (toolName === "selectAgeGroup" || toolName === "selectTopic" || toolName === "showAdvice") {
                    return (
                      <div key={toolCallId} className="skeleton">
                        {/* Render appropriate UI based on message function */}
                      </div>
                    );
                  }
                }
              })}
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
          <UserIcon className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </motion.div>
  );
};
