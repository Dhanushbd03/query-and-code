import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <div className="bg-blue-500 p-2 rounded">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Days left in your trial.</span>
          <span className="text-sm font-medium">14</span>
        </div>
      </div>
      <Button variant="secondary" size="sm" className="flex items-center gap-2">
        <Bell className="w-4 h-4" />
        Upgrade Now
      </Button>
    </div>
  )
}

