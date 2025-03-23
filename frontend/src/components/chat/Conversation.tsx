import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Intro from "./Intro";
import useChat from "@/stores/logic/useChat";
import { useEffect, useRef } from "react";

export default function ChatPage() {
  const { convId } = useParams<{ convId: string }>();
  const { messages, getMessages, c_loading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      if (convId) {
        const result = await getMessages(convId);
        if (!result) {
          navigate("/");
        }
      }
    };
    fetchMessages();
  }, [convId, getMessages, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const groupMessagesByDate = () => {
    if (!messages) return [];
    
    const groups: { [key: string]: typeof messages } = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return Object.entries(groups);
  };

  return (
    <ScrollArea className="h-full max-h-[70vh]">
      {messages?.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {groupMessagesByDate().map(([date, messages]) => (
            <div key={date} className="space-y-4">
              <div className="text-center text-sm font-medium text-ctp-subtext1 py-2">
                {date}
              </div>
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
                    <ReactMarkdown>
                      {message.message}
                    </ReactMarkdown>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {formatTime(message.timestamp)}
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
