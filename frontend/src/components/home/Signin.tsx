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
import { X } from "lucide-react";
import useDialogStore from "@/stores/ui/useAuthDialog";
import useAuthStore from "@/stores/logic/useAuthStore";

type Props = {
  setIsSignup: (value: boolean) => void;
};

export default function SignInForm(props: Props) {
  const { closeAuthDialog } = useDialogStore();
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;
    const success = await useAuthStore.getState().signIn(identifier, password);
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
              Signin to your account
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
          Don't have any account ?{" "}
          <Button
            className="text-primary hover:underline hover:bg-transparent hover:text-ctp-text"
            variant={"ghost"}
            onClick={() => {
              props.setIsSignup(true);
            }}
          >
            Signup
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4 text-ctp-peach">
          <div className="space-y-2">
            <Label htmlFor="email">Email / Username*</Label>
            <Input
              name="identifier"
              placeholder="Enter your email / username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password*</Label>
            <Input
              type="password"
              name="password"
              placeholder="Create a password"
              required
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="w-full bg-ctp-surface2 text-ctp-text"
              type="button"
              onClick={closeAuthDialog}
            >
              Cancel
            </Button>
            <Button className="w-full bg-ctp-base text-ctp-text" type="submit">
              Sign in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
