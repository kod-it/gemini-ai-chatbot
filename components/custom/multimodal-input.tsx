"use client";

import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";
import { toast } from "sonner";

import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import useWindowSize from "./use-window-size";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const suggestedActions = [
  {
    title: "Development Milestones",
    label: "Track my child's development",
    action: "Can you help me understand the key development milestones I should look for in my child?",
    icon: "📈",
  },
  {
    title: "Sleep Schedule",
    label: "Help with sleep routine",
    action: "I need help establishing a good sleep routine for my child.",
    icon: "😴",
  },
  {
    title: "Behavior Management",
    label: "Handle challenging behaviors",
    action: "What are some effective strategies for managing challenging behaviors?",
    icon: "🤝",
  },
  {
    title: "Nutrition Guide",
    label: "Healthy eating tips",
    action: "Can you suggest healthy eating habits and meal ideas for my child?",
    icon: "🥗",
  },
  {
    title: "Education & Learning",
    label: "Support child's education",
    action: "How can I best support my child's learning and education?",
    icon: "📚",
  },
  {
    title: "Social Skills",
    label: "Develop social abilities",
    action: "How can I help my child develop better social skills?",
    icon: "👥",
  },
];

export function MultimodalInput({
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  append,
  handleSubmit,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 0}px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [attachments, handleSubmit, setAttachments, width]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/files/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error) {
      toast.error("Failed to upload file, please try again!");
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments],
  );

  return (
    <div className="relative w-full flex flex-col gap-6">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <>
            <div className="text-center mb-2">
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                How can I help you today?
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Select a topic or type your question below
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full md:px-0 mx-auto max-w-[900px]">
              {suggestedActions.map((suggestedAction, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.05 * index }}
                  key={index}
                >
                  <button
                    onClick={async () => {
                      append({
                        role: "user",
                        content: suggestedAction.action,
                      });
                    }}
                    className="group relative w-full text-left rounded-xl p-5 
                             bg-gradient-to-br from-white to-zinc-50 
                             dark:from-zinc-900 dark:to-zinc-800
                             border border-zinc-200 dark:border-zinc-700
                             hover:border-zinc-300 dark:hover:border-zinc-600
                             hover:shadow-lg dark:hover:shadow-zinc-800/30
                             transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">{suggestedAction.icon}</span>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-base text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {suggestedAction.title}
                        </span>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {suggestedAction.label}
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}

      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="Ask me anything about parenting..."
          value={input}
          onChange={handleInput}
          className="min-h-[24px] overflow-hidden resize-none rounded-xl text-base 
                     bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700
                     focus:border-indigo-500 dark:focus:border-indigo-400
                     shadow-sm hover:shadow-md transition-shadow duration-200"
          rows={3}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (isLoading) {
                toast.error("Please wait for the response!");
              } else {
                submitForm();
              }
            }
          }}
        />

        {isLoading ? (
          <Button
            className="rounded-lg absolute bottom-2 right-2 bg-red-500 hover:bg-red-600"
            onClick={(event) => {
              event.preventDefault();
              stop();
            }}
          >
            <StopIcon size={14} />
          </Button>
        ) : (
          <Button
            className="rounded-lg absolute bottom-2 right-2 bg-indigo-500 hover:bg-indigo-600"
            onClick={(event) => {
              event.preventDefault();
              submitForm();
            }}
            disabled={input.length === 0 || uploadQueue.length > 0}
          >
            <ArrowUpIcon size={14} />
          </Button>
        )}

        <Button
          className="rounded-lg absolute bottom-2 right-12 border-zinc-200 dark:border-zinc-700
                     hover:bg-zinc-100 dark:hover:bg-zinc-700"
          onClick={(event) => {
            event.preventDefault();
            fileInputRef.current?.click();
          }}
          variant="outline"
          disabled={isLoading}
        >
          <PaperclipIcon size={14} />
        </Button>
      </div>

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll">
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: "",
                name: filename,
                contentType: "",
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
