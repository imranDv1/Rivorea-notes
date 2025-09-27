import LoginPage from "@/components/login";
import React from "react";

const Login = () => {
  return (
    <div className="w-full h-screen overflow-hidden flex items-center justify-center relative">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-black relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[length:14px_24px]" />
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 
            h-[1000px] w-[1000px] rounded-full 
            bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"
          />
        </div>
      </div>
      {/* /background */}

      <LoginPage />
    </div>
  );
};

export default Login;
