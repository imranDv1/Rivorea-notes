import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

import { expo } from "@better-auth/expo";

// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),

    emailAndPassword: { 
    enabled: true, 
  }, 

    socialProviders : {
       google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    },

    baseURL : process.env.NEXT_PUBLIC_APP_URL,
  plugins: [expo()],
 
     
});