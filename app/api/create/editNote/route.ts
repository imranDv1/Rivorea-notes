import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"


// 📝 Support editing notes
export async function PUT(request: Request) {
    const { id, title, description, category, userId } = await request.json()

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
            where: { id },
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
