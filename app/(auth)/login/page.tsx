import LoginPage from "@/components/login";
import { Ripple } from "@/components/ui/ripple";
import React from "react";
import Link from "next/link";

const Login = () => {
  return (
    <div className="w-full h-screen overflow-hidden flex items-center justify-center relative">
      <Ripple />

      <LoginPage />
      <div className="mt-4 flex flex-col items-center justify-center gap-2 md:flex-row">
        <p className="text-sm text-gray-500">
          <Link href="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </Link>
        </p>
        <span className="hidden text-gray-500 md:block">•</span>
        <p className="text-sm text-gray-500">
          <Link href="/terms" className="text-blue-500 hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
