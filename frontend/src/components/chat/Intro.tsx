import { useParams } from "react-router-dom";
import InfoCard from "./InfoCard"
import { Bot } from "lucide-react"
const Intro = () => {
  const { lang } = useParams();

  return (
    <div className="max-w-3xl mx-auto text-center relative ">
        <div className="size-24 bg-ctp-text rounded-full mx-auto mb-6 flex items-center justify-center">
          <Bot className="size-16" />
        </div>
        <h1 className="text-4xl font-bold text-ctp-text mb-4">
           Need help with {lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : ""}? Let's get started..
        </h1>
        <p className="text-ctp-subtext1 mb-8">
          "Hi there! I'm your go-to guide for all things code documentation—ask
          me anything, and let's decode your queries together!"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <InfoCard
            title="Smart Code Assistance"
            description="Your AI-powered coding companion—fetching answers, explaining code, and boosting productivity in seconds!"
          />
          <InfoCard
            title="Faster Problem-Solving"
            description="Get instant solutions—no more endless searching, just precise answers when you need them!"
          />
          <InfoCard
            title="Enhanced Understanding"
            description="Transform complex code into clarity with AI-powered explanations!"
          />
        </div>
      </div>
  )
}

export default Intro