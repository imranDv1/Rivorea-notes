import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request:Request) {
    const {noteId , userId} = await request.json()

    if(!userId){
        return NextResponse.json({ success: false, message: "userId isrequired" },{ status: 400 })
    }
       if(!noteId){
        return NextResponse.json({ success: false, message: "noteId is required" },{ status: 400 })
    }


  const notes = await prisma.note.findUnique({
    where : {
      id : noteId
    }
  })

  if(!notes) return null

  const notebody = await prisma.noteBody.findUnique({
    where : {
      noteId : noteId
    }
  })

    return NextResponse.json({ notebody });



}