import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { expo } from "@better-auth/expo";
import { prisma } from "./db";



export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite", // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
  },
  	session: {
		expiresIn: 60 * 60 * 24 * 30, // 30 days
		updateAge: 60 * 60 * 24, // Refresh every day
		disableSessionRefresh: false, // Enable auto-extension
		freshAge: 60 * 15, // 15 minute freshness window
	},
  plugins: [expo({})],

  socialProviders: {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID_WEB!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  trustedOrigins: [
    "myapp://",
    "http://localhost:3000",
    "https://rivorea-notes.vercel.app",
  ],
});
