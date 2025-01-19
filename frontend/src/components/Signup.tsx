import React, { useState } from "react";
import useAuthStore from "@/stores/logic/useAuthStore";
import useAuthDialog from "@/stores/ui/useAuthDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Zustand state for authentication and dialog control
  const signUp = useAuthStore((state) => state.signUp);
  const isAuthOpen = useAuthDialog((state) => state.isAuthOpen);
  const closeAuthDialog = useAuthDialog((state) => state.closeAuthDialog);

  const handleSignUp = () => {
    if (username && password) {
      // Call the sign-up function (assuming it's handling authentication)
      signUp(username, password);
      alert("Sign-up successful! You can now sign in.");
      setUsername("");
      setPassword("");
      closeAuthDialog();  // Close the dialog after successful sign-up
    } else {
      alert("Please enter a valid username and password.");
    }
  };

  return (
    <div>
      {/* Dialog for SignUp */}
      <Dialog open={isAuthOpen} onOpenChange={closeAuthDialog}>
        <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-96">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800">Sign Up</DialogTitle>
            <DialogDescription className="text-gray-600">
              Please enter your details to create a new account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleSignUp}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
            >
              Sign Up
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignUp;
