import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: number
  content: string
  sender: "user" | "bot"
  timestamp: string
}

const messages: Message[] = [
  {
    id: 1,
    content: "Hi! I need help with React hooks. Can you explain useEffect?",
    sender: "user",
    timestamp: "2:30 PM",
  },
  {
    id: 2,
    content:
      "I'll help you understand useEffect! The useEffect hook lets you perform side effects in function components. It serves a similar purpose to componentDidMount, componentDidUpdate, and componentDidUnmount in class components, but unified into a single API.\n\nHere's a basic example:\n\n```jsx\nuseEffect(() => {\n  // This code runs after every render\n  console.log('Component rendered');\n\n  return () => {\n    // Cleanup code (optional)\n    console.log('Component will unmount or re-render');\n  };\n}, []); // Empty dependency array means it only runs once on mount\n```",
    sender: "bot",
    timestamp: "2:31 PM",
  },
  {
    id: 3,
    content: "That makes sense! But when should I add dependencies to the dependency array?",
    sender: "user",
    timestamp: "2:32 PM",
  },
  {
    id: 4,
    content:
      "You should add dependencies to the array when your effect uses any values from your component's scope (like props or state). This ensures the effect runs when those values change.\n\nFor example:\n\n```jsx\nconst [count, setCount] = useState(0);\n\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]); // Effect runs when count changes\n```\n\nIf you omit count from the dependency array, you might have stale closure issues where your effect doesn't 'see' the latest count value.",
    sender: "bot",
    timestamp: "2:33 PM",
  },
]

export default function ChatPage() {
  return (
        <ScrollArea className="h-[75vh]">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`group relative max-w-[80%] rounded-lg px-3 py-2 ${
                    message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <div className="prose prose-invert min-w-full">
                    {message.content.split("\n").map((text, i) => (
                      <p key={i} className="mb-1 last:mb-0">
                        {text}
                      </p>
                    ))}
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
          </div>
        </ScrollArea>       
  )
}
