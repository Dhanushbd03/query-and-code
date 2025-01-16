import { Bot, Globe, HelpCircle, MessageSquare, PenTool, Settings, TicketIcon, Users, Zap } from 'lucide-react'
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { TemplateCard } from "@/components/TemplateCard"

const templates = [
  {
    icon: Bot,
    title: "Blank Bot",
    description: "Create a blank chatbot, which you can train and customize later.",
  },
  {
    icon: Globe,
    title: "Website",
    description: "Crawl your website's content to get answers to popular user questions.",
  },
  {
    icon: Zap,
    title: "Zendesk",
    description: "Scan your Zendesk help center articles to answer customer questions.",
  },
  {
    icon: HelpCircle,
    title: "Knowledge Base",
    description: "Scrap your Knowledge Base articles to answer customer questions.",
  },
  {
    icon: MessageSquare,
    title: "Online Quiz Bot",
    description: "Engage your customers with a chatbot quiz tailored to your needs.",
  },
  {
    icon: Users,
    title: "Job Application Bot",
    description: "Automate sourcing candidates to speed up your hiring process.",
  },
  {
    icon: PenTool,
    title: "FAQ Bot",
    description: "Answer frequently asked questions with a chatbot to save your time.",
  },
  {
    icon: Settings,
    title: "Customer Satisfaction",
    description: "Automate collecting surveys to capture the voice and opinions of your customers.",
  },
  {
    icon: TicketIcon,
    title: "Create HelpDesk Tickets",
    description: "Let customers create HelpDesk tickets while chatting with your chatbot.",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2">Set up your chatbot</h1>
            <p className="text-slate-400">
              Train your chatbot with data, use our ready-to-use templates or start
              from scratch.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template, index) => (
              <TemplateCard key={index} {...template} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

