import { Button } from "@/components/ui/button"
function MediaTabs() {
    const tabs = ["All", "Text", "Image", "Video", "Music", "Analytics"]
    return (
      <div className="border-b border-gray-800 mb-4">
        <div className="flex gap-4">
          {tabs.map((tab, index) => (
            <Button
              key={tab}
              variant="ghost"
              className={`px-4 py-2 ${
                index === 0 ? "text-green-500 border-b-2 border-green-500" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>
    )
  }


  export default MediaTabs;