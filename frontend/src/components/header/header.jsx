import { Button } from "@/components/ui/button"
import { MessageCircle } from 'lucide-react'

export function Header() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div className="text-sm text-gray-400">
          Days left in your trial: <span className="text-white">14</span>
        </div>
      </div>
      <Button variant="secondary" size="sm">
        Upgrade Now
      </Button>
    </div>
  )
}

