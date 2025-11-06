import LoginPage from "@/components/login";
import { Ripple } from "@/components/ui/ripple";
import React from "react";
import Link from "next/link";

const Login = () => {
  return (
    <div className="w-full h-screen overflow-hidden flex items-center justify-center relative">
      <Ripple />

      <LoginPage />

    </div>
  );
};

export default Login;
