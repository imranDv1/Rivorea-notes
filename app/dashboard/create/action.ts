'use server'

import { toast } from "sonner";

export async function CreateNote(data : object) {
     try {
     await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    

      toast.success("note created sucessfully ");
    } catch (error) {
      const e = error as Error;
      toast.error(e.message);
    }
}