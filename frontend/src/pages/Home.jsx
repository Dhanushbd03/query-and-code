import { Sidebar } from "./components/sidebar"
import { Header } from "./components/header"
import { TemplateCard } from "./components/template-card"
import { Bot, Globe, HelpCircle, BookOpen, HelpingHand, UserCheck, MessageSquareIcon as MessageSquareQuestion, ThumbsUp, Ticket } from 'lucide-react'

const templates = [
  {
    icon: Bot,
    title: "Blank Bot",
    description: "Create a blank chatbot, which you can train and customize later."
  },
  {
    icon: Globe,
    title: "Website",
    description: "Crawl your website's content to get answers to popular user questions."
  },
  {
    icon: HelpCircle,
    title: "Zendesk",
    description: "Scan your Zendesk help center articles to answer customer questions."
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    description: "Scrap your Knowledge Base articles to answer customer questions."
  },
  {
    icon: HelpingHand,
    title: "Online Quiz Bot",
    description: "Engage your customers with a chatbot quiz tailored to your needs."
  },
  {
    icon: UserCheck,
    title: "Job Application Bot",
    description: "Automate sourcing candidates to speed up your hiring process."
  },
  {
    icon: MessageSquareQuestion,
    title: "FAQ Bot",
    description: "Answer frequently asked questions with a chatbot to save your time."
  },
  {
    icon: ThumbsUp,
    title: "Customer Satisfaction",
    description: "Automate collecting surveys to capture the voice and opinions of your customers."
  },
  {
    icon: Ticket,
    title: "Create HelpDesk Tickets",
    description: "Let customers create HelpDesk tickets while chatting with your chatbot."
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="pl-16 p-6">
        <Header />
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Set up your chatbot</h1>
          <p className="text-gray-400 mb-8">
            Train your chatbot with data, use our ready-to-use templates or start from scratch.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <TemplateCard key={index} {...template} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

