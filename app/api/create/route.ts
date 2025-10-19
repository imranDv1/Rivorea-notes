import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    const {title , description , category, userId} = await request.json()
    if(!userId){
        return NextResponse.json({message:"userId are requred"})
    }

    if(!title){
        return NextResponse.json({message:"place enter the title "})
    }
    if(!description){
        return NextResponse.json({message:"place enter the descripion "})
    }
    if(!category){
        return NextResponse.json({message:"place enter the category "})
    }

    const prisma =  new PrismaClient()
 
    try {
        await prisma.note.create({
            data:{
                id: uuidv4(),
                title,
                description,
                category,
                userId
            }
        })

        return NextResponse.json("note create successfuly")
    } catch (error) {
        return NextResponse.json("error  create note"+ error)
    }
}

// 📝 Support editing notes
export async function PUT(request: Request) {
    const { noteId, id, title, description, category, userId } = await request.json()

    if (!id) {
        return NextResponse.json({ message: "note id is required" })
    }
    if (!userId) {
        return NextResponse.json({ message: "userId is required" })
    }
    if (!title) {
        return NextResponse.json({ message: "please enter the title" })
    }
    if (!description) {
        return NextResponse.json({ message: "please enter the description" })
    }
    if (!category) {
        return NextResponse.json({ message: "please enter the category" })
    }

    const prisma = await new PrismaClient()

    try {
        const updated = await prisma.note.update({
            where: { id: noteId },
            data: {
                title,
                description,
                category,
                userId
            }
        })

        return NextResponse.json({ message: "note updated successfully", note: updated })
    } catch (error) {
        return NextResponse.json("error updating note " + error)
    }
}
