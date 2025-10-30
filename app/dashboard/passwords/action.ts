"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { IconArrowAutofitRight } from "@tabler/icons-react";
import { headers } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export default async function CreateNewPass(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }
  const userId = session.user.id;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const emailOruser = formData.get("emailOruser") as string;
  const password = formData.get("password") as string;
  const category = formData.get("category") as string;
  try {
    const res = await fetch(`${BASE_URL}/api/passMan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        title,
        description,
        emailOruser,
        password,
        category,
      }),
    });
    if (!res.ok) {
      console.log(`try to create new Pass: ${await res.json()}`);
      return { success: false, message: "error create new Pass" };
    }
    return { success: true, message: "Pass create successfuly" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "error create new Pass" };
  }
}

export type EditPassPayload = {
  id: string;
  title?: string;
  description?: string;
  emailOruser?: string;
  password?: string;
  category?: string;
};

export async function EditPass(payload: EditPassPayload) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }
  try {
    const res = await fetch(`${BASE_URL}/api/passEdit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "error updating Pass",
      };
    }
    return {
      success: true,
      message: data?.message || "Pass updated successfully",
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "error updating Pass" };
  }
}

export async function DeletePass(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }
  const userId = session.user.id;
  try {
    const res = await fetch(`${BASE_URL}/api/passDelete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId }),
    });
    if (!res.ok) {
      console.log(await res.json());
      return { success: false, message: "error deleting Pass" };
    }
    return { success: true, message: "Pass deleted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "error deleting Pass" };
  } finally {
    return { success: true, message: "Pass deleted successfully" };
  }
}
