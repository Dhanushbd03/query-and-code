import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/stores/logic/useAuthStore";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import useDialogStore from "@/stores/ui/useAuthDialog";
type Props = {
  setIsSignup: (value: boolean) => void;
};
export default function SignUpForm(Props: Props) {
  const { closeAuthDialog } = useDialogStore();
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const success = await useAuthStore.getState().signUp(name, email, password);
    if (success) {
      closeAuthDialog();
    } else {
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <Card className="w-full max-w-md z-50 bg-ctp-surface0 border-ctp-flamingo ">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl text-ctp-text">
              Create an account
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-ctp-base text-ctp-text hover:text-ctp-text"
            onClick={closeAuthDialog}
          >
            <X className="h-4 w-4 " />
          </Button>
        </div>
        <CardDescription className="text-ctp-subtext1">
          Already have an account?{" "}
          <Button
            className="text-primary hover:underline hover:bg-transparent hover:text-ctp-text"
            variant={"ghost"}
            onClick={() => {
              Props.setIsSignup(false);
            }}
          >
            Login
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4 text-ctp-peach">
          <div className="space-y-2">
            <Label htmlFor="name">Name*</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password*</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              required
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
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
            <Button
              variant="outline"
              className="w-full bg-ctp-surface2 text-ctp-text"
              type="button"
            >
              Cancel
            </Button>
            <Button className="w-full bg-ctp-base text-ctp-text" type="submit">
              Sign up
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
