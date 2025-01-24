
function InfoCard({ title, description }: { title: string; description: string }) {
    return (
      <div className="p-4 bg-ctp-base border border-ctp-flamingo rounded-lg">
        <h3 className="font-medium text-ctp-text mb-2">{title}</h3>
        <p className="text-sm text-ctp-subtext1">{description}</p>
      </div>
    )
  }
  

export default InfoCard;