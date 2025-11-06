
import SignUpPage from "@/components/signUp";
import { Ripple } from "@/components/ui/ripple";
import React from "react";
  
const SignUp = () => {
  return (
    <div className="w-full h-screen overflow-hidden flex items-center justify-center relative">
     <Ripple />
    

      <SignUpPage />
    </div>
  );
};

export default SignUp;
