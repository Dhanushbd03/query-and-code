import { LayoutGrid, Zap, Users, MessageCircle, CreditCard, BarChart, Flag, Settings } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-gray-900 flex flex-col items-center py-4 space-y-6">
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
        <MessageCircle className="w-6 h-6 text-white" />
      </div>
      <nav className="flex flex-col space-y-4">
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white">
          <LayoutGrid className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white">
          <Zap className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white">
          <Users className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white">
          <MessageCircle className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white">
          <CreditCard className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white">
          <BarChart className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white">
          <Flag className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white">
          <Settings className="w-5 h-5" />
        </button>
      </nav>
    </div>
  )
}

