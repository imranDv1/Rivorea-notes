import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
      // تضيف نماذج ثانية حسب الدومينات اللي تستخدمها
    ],
    // يمكن تضيف unoptimized إذا تحب تعطل تحسين الصور:
    // unoptimized: true,
  },
};

export default nextConfig;
