import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    apiKey: "sk-...",
    modelName: "gpt-4",
    maxTokens: "2000",
    temperature: "0.7",
    enableLogging: true,
    enableAnalytics: true,
    maintenanceMode: false,
    rateLimit: "100",
    timeout: "30",
  })

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-ctp-subtext0">Manage your application settings and configurations.</p>
        </div>

        <div className="grid gap-6">
          {/* API Configuration */}
          <Card className="bg-ctp-surface0 border-ctp-flamingo">
            <CardHeader>
              <CardTitle className="text-white">API Configuration</CardTitle>
              <CardDescription className="text-ctp-subtext0">
                Configure your API settings and model parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-ctp-text">API Key</Label>
                <Input
                  id="apiKey"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelName" className="text-ctp-text">Model Name</Label>
                <Input
                  id="modelName"
                  value={settings.modelName}
                  onChange={(e) => setSettings({ ...settings, modelName: e.target.value })}
                  className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxTokens" className="text-ctp-text">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    value={settings.maxTokens}
                    onChange={(e) => setSettings({ ...settings, maxTokens: e.target.value })}
                    className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-ctp-text">Temperature</Label>
                  <Input
                    id="temperature"
                    value={settings.temperature}
                    onChange={(e) => setSettings({ ...settings, temperature: e.target.value })}
                    className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="bg-ctp-surface0 border-ctp-flamingo">
            <CardHeader>
              <CardTitle className="text-white">System Settings</CardTitle>
              <CardDescription className="text-ctp-subtext0">
                Configure system-wide settings and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-ctp-text">Enable Logging</Label>
                  <p className="text-sm text-ctp-subtext0">Enable detailed system logging</p>
                </div>
                <Switch
                  checked={settings.enableLogging}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableLogging: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-ctp-text">Enable Analytics</Label>
                  <p className="text-sm text-ctp-subtext0">Collect usage analytics and metrics</p>
                </div>
                <Switch
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableAnalytics: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-ctp-text">Maintenance Mode</Label>
                  <p className="text-sm text-ctp-subtext0">Put the system in maintenance mode</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Rate Limiting */}
          <Card className="bg-ctp-surface0 border-ctp-flamingo">
            <CardHeader>
              <CardTitle className="text-white">Rate Limiting</CardTitle>
              <CardDescription className="text-ctp-subtext0">
                Configure rate limiting and timeout settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rateLimit" className="text-ctp-text">Rate Limit (requests/min)</Label>
                  <Input
                    id="rateLimit"
                    value={settings.rateLimit}
                    onChange={(e) => setSettings({ ...settings, rateLimit: e.target.value })}
                    className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout" className="text-ctp-text">Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    value={settings.timeout}
                    onChange={(e) => setSettings({ ...settings, timeout: e.target.value })}
                    className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-ctp-flamingo hover:bg-ctp-flamingo/90 text-ctp-base"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}