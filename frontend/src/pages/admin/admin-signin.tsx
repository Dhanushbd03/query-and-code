"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Lock, LogIn, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAdminAuthStore } from "@/stores/logic/adminAuthStore"
import { useNavigate } from "react-router-dom"

export default function AdminSignIn() {
  const navigate = useNavigate()
  const signin = useAdminAuthStore((state) => state.signin)
  const [email, set_email] = useState("")
  const [password, set_password] = useState("")
  const [show_password, set_show_password] = useState(false)
  const [is_loading, set_is_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    set_error(null)

    if (!email || !password) {
      set_error("Please enter both email and password")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      set_error("Please enter a valid email address")
      return
    }

    set_is_loading(true)

    try {
      const result = await signin(email, password)
      
      if (result.success) {
        navigate('/admin')
      } else {
        set_error(result.message || "Invalid email or password")
      }
    } catch (err) {
      set_error("An error occurred. Please try again.")
    } finally {
      set_is_loading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 w-full">
      <Card className="w-full max-w-md bg-ctp-surface0 border-ctp-flamingo text-ctp-text">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Query and code Admin</CardTitle>
          <CardDescription className="text-center">Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => set_email(e.target.value)}
                disabled={is_loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show_password ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => set_password(e.target.value)}
                  disabled={is_loading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => set_show_password(!show_password)}
                >
                  {show_password ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{show_password ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={is_loading}>
              {is_loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground flex items-center">
            <Lock className="h-3 w-3 mr-1" />
            Secure admin access only
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
