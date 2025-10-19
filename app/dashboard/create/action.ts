"use server";

import { revalidatePath } from "next/cache";

type Data = {
  userId: string | undefined;
  title: string;
  description: string;
  category: string[];
};

export async function CreateNote(data: Data) {
  try {
   await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });


    revalidatePath("/dashboard/create");
    return { success: true };
  } catch (error) {
    return { success: false , error };
  }
}


