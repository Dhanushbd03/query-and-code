import InfoCard from './InfoCard';
import MediaTabs from './MediaTabs';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Bot } from 'lucide-react';
function Content() {
    return (
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="size-24 bg-Text rounded-full mx-auto mb-6 flex items-center justify-center">
            <Bot className='size-16' />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Need help? Let's get started..</h1>
          <p className="text-gray-400 mb-8">
            "Hi there! I'm your go-to guide for all things code documentation—ask me anything, and let's decode your
            queries together!"
          </p>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <InfoCard
              title="Saved Prompt Templates"
              description="Use a pre-saved template prompt template for quick responses"
            />
            <InfoCard title="Media Type Selection" description="Select which media type you want to talk about today" />
            <InfoCard title="Multilingual Support" description="Choose which language to use for your chat" />
          </div>
  
          <MediaTabs />
  
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Message Query&Code ...."
              className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>
    )
  }

  export default Content;