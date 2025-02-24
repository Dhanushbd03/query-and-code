import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { getMessages, Message } from "@/api/api_routes";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import Intro from "./Intro";

type Props = {
  loading: boolean;
};

export default function ChatPage({ loading }: Props) {
  const [messages, set_messages] = useState<Message[]>([]);
  const { convId } = useParams();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!convId) return;
      const response = await getMessages(convId as string);
      if (response.success) set_messages(response.data);
    };
    fetchMessages();
  }, [convId]);

  const formatMessage = (message: string) => {
    const regex = /```(\w+)?\s([\s\S]*?)```/g;
    const parts: { text?: string; code?: string; language?: string }[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(message)) !== null) {
      const [language, code] = match;
      const textBefore = message.slice(lastIndex, match.index).trim();

      if (textBefore) {
        parts.push({ text: textBefore });
      }

      parts.push({ code: code.trim(), language: language || "plaintext" });
      lastIndex = regex.lastIndex;
    }

    const remainingText = message.slice(lastIndex).trim();
    if (remainingText) {
      parts.push({ text: remainingText });
    }

    return parts;
  };

  return (
    <ScrollArea className="h-[75vh]">
      {messages.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`group relative max-w-[80%] rounded-lg px-3 py-2 ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                <div className="prose prose-invert min-w-full">
                  {formatMessage(message.message).map((block, i) =>
                    block.code ? (
                      <SyntaxHighlighter
                        key={i}
                        language={block.language}
                        style={coy}
                        className="rounded-md overflow-hidden"
                      >
                        {block.code}
                      </SyntaxHighlighter>
                    ) : (
                      <p key={i} className="mb-1 last:mb-0">
                        {block.text}
                      </p>
                    )
                  )}
                </div>
                <span className="absolute bottom-0 translate-y-full pt-1 text-xs text-gray-400">
                  {message.timestamp}
                </span>
              </div>
              {message.sender === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {/* Show Skeleton for the next incoming message */}
          {loading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <Skeleton className="h-full w-full rounded-full" />
              </Avatar>
              <div className="bg-gray-800 text-gray-100 max-w-[80%] rounded-lg px-3 py-2 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <Intro />
      )}
    </ScrollArea>
  );
}
