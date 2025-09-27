import React from "react";
import CreateNotes from "./createNotes";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

const Page = async () => {
  // get user session from server side
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id; // depends on your auth structure

  const notes = await prisma.note.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <CreateNotes  notes={notes}/>;
};

export default Page;
