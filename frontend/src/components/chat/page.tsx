import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"

export default function Home() {
  return (
    <div className="flex h-screen bg-black/90">
      <Sidebar />
      <MainContent />
    </div>
  )
}

