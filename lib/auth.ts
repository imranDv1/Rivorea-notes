import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { expo } from "@better-auth/expo";
import { prisma } from "./db";

// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),

    emailAndPassword: { 
    enabled: true, 
  }, 
    plugins: [
    expo({
 
    }),
    nextCookies(), // <-- last
  ],

    socialProviders : {
       google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    },
baseURL : process.env.NEXT_PUBLIC_APP_URL,
    trustedOrigins: ["myapp://", "http://localhost:3000", "https://rivorea-notes.vercel.app"],

     
});