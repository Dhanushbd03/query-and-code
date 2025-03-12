import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Intro from "./Intro";
import useChat from "@/stores/logic/useChat";
import { useEffect, useRef } from "react";

export default function ChatPage() {
  const { convId } = useParams<{ convId: string }>();
  const { messages, getMessages, c_loading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (convId) {
      getMessages(convId);
    }
  }, [convId, getMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-full max-h-[70vh]">
      {messages?.length > 0 ? (
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
                className={`group relative max-w-[80%] rounded-lg px-3 py-2 h-full ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                <ReactMarkdown >
                  {message.message}
                </ReactMarkdown>
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
          {c_loading && (
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
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <Intro />
      )}
    </ScrollArea>
  );
}
