import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import useScraping from '@/stores/logic/useScraping'
import useLanguage from '@/stores/logic/useLanguage'
import ScrapingLogs from '@/components/admin/ScrapingLogs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DataCollection() {
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>("")
  const { startScraping, stopScraping, is_scraping: isScraping, error } = useScraping()
  const { languages, getLanguages, loading: languagesLoading } = useLanguage()

  useEffect(() => {
    getLanguages()
  }, [getLanguages])

  const selectedLanguage = languages.find(lang => lang.id === selectedLanguageId)

  const handleScrape = async () => {
    if (!selectedLanguageId || !selectedLanguage) {
      toast({
        title: "Error",
        description: "Please select a language first",
        variant: "destructive",
      })
      return
    }

    try {
      await startScraping(selectedLanguageId)
      toast({
        title: "Success",
        description: "Scraping started successfully",
        variant: "success",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to start scraping",
        variant: "destructive",
      })
    }
  }

  const handleStop = async () => {
    try {
      await stopScraping()
      toast({
        title: "Success",
        description: "Scraping stopped successfully",
        variant: "success",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to stop scraping",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="h-full">
      <Card className="bg-ctp-surface0 border-ctp-flamingo h-full flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-ctp-text">Data Collection</CardTitle>
          <CardDescription className="text-ctp-subtext0">Manage your data collection and vectorization processes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0 space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="language" className="text-ctp-text text-sm">Language</Label>
              <Select
                value={selectedLanguageId}
                onValueChange={setSelectedLanguageId}
                disabled={languagesLoading || isScraping}
              >
                <SelectTrigger className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text h-9">
                  <SelectValue placeholder={languagesLoading ? "Loading languages..." : "Select a language"} />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.id} value={language.id.toString()}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedLanguage && (
              <div className="flex gap-2">
                <Button 
                  className="bg-ctp-flamingo hover:bg-ctp-flamingo/90 text-ctp-base h-9"
                  onClick={handleScrape}
                  disabled={isScraping || languagesLoading}
                >
                  {isScraping ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    "Start Scraping"
                  )}
                </Button>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {selectedLanguage && (
            <div className="text-sm text-ctp-subtext0 bg-ctp-surface1 p-2 rounded-md border border-ctp-surface2">
              Files will be saved to: <span className="font-mono">content/{selectedLanguage.name.toLowerCase()}</span>
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrapingLogs onStop={handleStop} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 