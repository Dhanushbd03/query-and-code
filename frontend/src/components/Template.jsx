export function TemplateCard({ icon: Icon, title, description} ) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-6 relative group">
      <div className="absolute right-4 top-4">
        <button className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full hover:bg-gray-700">
          PREVIEW
        </button>
      </div>
      <div className="mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

