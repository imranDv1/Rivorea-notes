"use server";
import { auth } from "@/lib/auth";
import arcjet, { validateEmail } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

type SignUpTypes = {
  email: string;
  password: string;
  name: string;
};
type SignInTypes = {
  email: string;
  password: string;
};

const aj = arcjet.withRule(
  validateEmail({
    mode: "LIVE",
    block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
  })
);
type SignUpResult =
  | { success: true }
  | { success: false; error: { message: string } };

export async function SignUp(data: SignUpTypes): Promise<SignUpResult> {
  const req = await request();
  const decision = await aj.protect(req, {
    email: data.email,
  });
  if (!decision.isAllowed())
    return { success: false, error: { message: "Email is not valid" } };

  try {
    await auth.api.signUpEmail({
      body: {
        email: data.email, // user email address
        password: data.password, // user password -> min 8 characters by default
        name: data.name, // user display name
        callbackURL: "/dashboard",
      },
    });
    revalidatePath("/signUp");

    return { success: true };
  } catch (err) {
    const error = err as Error;
    return { success: false, error };
  }
}

// export async function SignIn(data: SignInTypes): Promise<SignUpResult> {
//   const req = await request();
//   const decision = await aj.protect(req, {
//     email: data.email,
//   });
//   if (!decision.isAllowed())
//     return { success: false, error: { message: "Email is not valid" } };

//   try {
//     await auth.api.signInEmail({
//       body: {
//         email: data.email, // user email address
//         password: data.password, // user password -> min 8 characters by default
//         callbackURL: "/dashboard",
//       },

//     });
//     revalidatePath("/login");
//     return { success: true };
//   } catch (err) {
//     const error = err as Error;
//     return { success: false, error };
//   }
// }
