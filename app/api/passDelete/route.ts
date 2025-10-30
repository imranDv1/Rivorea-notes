import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export async function DELETE(request: Request) {
  const { id , userId } = await request.json();
  if(!id || !userId){
    return NextResponse.json({ message: "id and userId are required" }, { status: 400 });
  }
  const pass = await prisma.passwordManeger.findUnique({
    where: { id },
  });
  if(!pass){
    return NextResponse.json({ message: "pass not found" }, { status: 404 });
  }
  if(pass.userId !== userId){
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }
  await prisma.passwordManeger.delete({
    where: {
         id : id,
         userId : userId,
    },
  });
  return NextResponse.json({ message: "pass deleted successfully" }, { status: 200 });
}