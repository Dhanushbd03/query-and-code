import InfoCard from "./InfoCard"
import { Bot } from "lucide-react"
const Intro = () => {
  return (
    <div className="max-w-3xl mx-auto text-center relative ">
        <div className="size-24 bg-ctp-text rounded-full mx-auto mb-6 flex items-center justify-center">
          <Bot className="size-16" />
        </div>
        <h1 className="text-4xl font-bold text-ctp-text mb-4">
          Need help? Let's get started..
        </h1>
        <p className="text-ctp-subtext1 mb-8">
          "Hi there! I'm your go-to guide for all things code documentation—ask
          me anything, and let's decode your queries together!"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <InfoCard
            title="Saved Prompt Templates"
            description="Use a pre-saved template prompt template for quick responses"
          />
          <InfoCard
            title="Media Type Selection"
            description="Select which media type you want to talk about today"
          />
          <InfoCard
            title="Multilingual Support"
            description="Choose which language to use for your chat"
          />
        </div>
      </div>
  )
}

export default Intro