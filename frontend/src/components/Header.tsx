import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Logo from './Logo'
export function Header() {
  return (
    <div className="flex items-center justify-between px-6 py-2 border-b">
        <Logo />
      <Button variant="secondary" size="sm" className="flex items-center gap-2">
        <Bell className="w-4 h-4" />
        Upgrade Now
      </Button>
    </div>
  )
}

