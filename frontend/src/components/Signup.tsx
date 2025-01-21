"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import logo from "@/assets/logo.png";
import useDialogStore from "@/stores/ui/useAuthDialog";

export default function SignUpForm() {
  const { isAuthOpen, closeAuthDialog } = useDialogStore();
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return isAuthOpen ? (
    <div className="flex items-center justify-center bg-black/75 p-4 absolute top-0 left-0 w-full h-full filter">
      <div className="rounded-lg border p-1 bg-mainbg">
        <img src={logo} alt="" className="h-full object-contain invert" />
      </div>
      <Card className="w-full max-w-md z-50 bg-mainbg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl text-white">Create an account</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={closeAuthDialog}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-white">
            Already have an account?{" "}
            <a href="#" className="text-primary hover:underline">
              Log in
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Name*</Label>
              <Input id="name" placeholder="Enter your name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email*</Label>
              <Input id="email" placeholder="Enter your email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password*</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                required
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree with{" "}
                <a href="#" className="text-primary hover:underline">
                  terms and conditions
                </a>
              </label>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="w-full" type="button">
                Cancel
              </Button>
              <Button className="w-full" type="submit">
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  ) : null;
}
