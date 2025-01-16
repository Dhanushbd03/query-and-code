import { Button } from "@/components/ui/button"
import { type LucideIcon } from 'lucide-react'

interface TemplateCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function TemplateCard({ icon: Icon, title, description }: TemplateCardProps) {
  return (
    <div className="bg-slate-900 rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-slate-800 rounded-lg">
          <Icon className="w-5 h-5 text-slate-400" />
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          PREVIEW
        </Button>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  )
}

