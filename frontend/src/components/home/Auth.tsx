import useDialogStore from "@/stores/ui/useAuthDialog";
import SignUpForm from "./Signup";
import SignInForm from "./Signin";
import logo from "@/assets/logo2.png";
import { useState } from "react";

const Auth = () => {
  const { isAuthOpen } = useDialogStore();
  const [isSignUp, setIsSignUp] = useState(false);
  return isAuthOpen ? (
    <div className="flex items-center justify-center bg-ctp-base/50 p-4 absolute top-0 left-0 w-full h-full filter">
      <div className="bg-ctp-surface0 border-ctp-flamingo flex" >
        <div className="rounded-lg border p-1 bg-ctp-surface0 border-ctp-flamingo ">
          <img src={logo} alt="" className="h-full object-contain " />
        </div>
        {isSignUp ? (
          <SignUpForm setIsSignup={setIsSignUp} />
        ) : (
          <SignInForm setIsSignup={setIsSignUp} />
        )}
      </div>
    </div>
  ) : null;
};

export default Auth;
