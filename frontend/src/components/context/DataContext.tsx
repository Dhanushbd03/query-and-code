import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"

export default function DataContext() {
  const [collectionData, setCollectionData] = useState({
    source: "",
    description: "",
    format: ""
  })

  const [vectorizationData, setVectorizationData] = useState({
    model: "",
    chunkSize: "",
    overlap: ""
  })

  const [isCollecting, setIsCollecting] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const handleStartCollection = async () => {
    setIsCollecting(true)
    setLogs([])
    
    // Simulate collection process with logs
    const newLogs = [
      "Starting data collection process...",
      "Validating data source...",
      "Connecting to source...",
      "Reading data...",
      "Processing data...",
      "Collection completed successfully!"
    ]

    // Simulate real-time log updates
    for (const log of newLogs) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLogs(prev => [...prev, log])
    }

    setIsCollecting(false)
  }

  return (
    <div className="p-6 h-full">
      <Card className="bg-ctp-surface0 border-ctp-flamingo h-full">
        <CardHeader>
          <CardTitle className="text-ctp-text">Data Management</CardTitle>
          <CardDescription className="text-ctp-subtext0">Manage your data collection and vectorization processes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="collect" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-ctp-surface1">
              <TabsTrigger value="collect" className="data-[state=active]:bg-ctp-surface0 text-ctp-text">Collect Data</TabsTrigger>
              <TabsTrigger value="vectorize" className="data-[state=active]:bg-ctp-surface0 text-ctp-text">Vectorize Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="collect" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="source" className="text-ctp-text">Data Source</Label>
                  <Input
                    id="source"
                    placeholder="Enter data source URL or path"
                    className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                    value={collectionData.source}
                    onChange={(e) => setCollectionData({ ...collectionData, source: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-ctp-text">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the data you're collecting"
                    className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                    value={collectionData.description}
                    onChange={(e) => setCollectionData({ ...collectionData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format" className="text-ctp-text">Data Format</Label>
                  <Input
                    id="format"
                    placeholder="e.g., JSON, CSV, TXT"
                    className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                    value={collectionData.format}
                    onChange={(e) => setCollectionData({ ...collectionData, format: e.target.value })}
                  />
                </div>
                <Button 
                  className="w-full bg-ctp-flamingo hover:bg-ctp-flamingo/90 text-ctp-base"
                  onClick={handleStartCollection}
                  disabled={isCollecting}
                >
                  {isCollecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Collecting...
                    </>
                  ) : (
                    "Start Collection"
                  )}
                </Button>

                {logs.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-ctp-text mb-2">Collection Logs</Label>
                    <ScrollArea className="h-[200px] w-full rounded-md border border-ctp-flamingo bg-ctp-surface1 p-4">
                      <div className="space-y-2">
                        {logs.map((log, index) => (
                          <div key={index} className="text-sm text-ctp-text">
                            {log}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="vectorize" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-ctp-text">Embedding Model</Label>
                  <Input
                    id="model"
                    placeholder="Select embedding model"
                    className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                    value={vectorizationData.model}
                    onChange={(e) => setVectorizationData({ ...vectorizationData, model: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chunkSize" className="text-ctp-text">Chunk Size</Label>
                  <Input
                    id="chunkSize"
                    type="number"
                    placeholder="Enter chunk size"
                    className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                    value={vectorizationData.chunkSize}
                    onChange={(e) => setVectorizationData({ ...vectorizationData, chunkSize: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overlap" className="text-ctp-text">Overlap Size</Label>
                  <Input
                    id="overlap"
                    type="number"
                    placeholder="Enter overlap size"
                    className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                    value={vectorizationData.overlap}
                    onChange={(e) => setVectorizationData({ ...vectorizationData, overlap: e.target.value })}
                  />
                </div>
                <Button className="w-full bg-ctp-flamingo hover:bg-ctp-flamingo/90 text-ctp-base">Start Vectorization</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 