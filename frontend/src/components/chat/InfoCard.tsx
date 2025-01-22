
function InfoCard({ title, description }: { title: string; description: string }) {
    return (
      <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <h3 className="font-medium text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    )
  }
  

export default InfoCard;