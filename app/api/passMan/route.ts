import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(request: Request) {
  try {
    const { userId , title , description , emailOruser , password , category } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    if(!title){
        return NextResponse.json({ message: "title is required" }, { status: 400 });
    }

    if(!emailOruser){
        return NextResponse.json({ message: "emailOruser is required" }, { status: 400 });
    }

    if(!password){
        return NextResponse.json({ message: "password is required" }, { status: 400 });
    }

    if(!category){
        return NextResponse.json({ message: "category is required" }, { status: 400 });
    }

    if(!description){
        return NextResponse.json({ message: "description is required" }, { status: 400 });
    }


    // how to download bcrypt in nextjs 15 app directory using pnpm
   

    const hashPassword =  bcrypt.hashSync(password, 10);

    const PassMan = await prisma.passwordManeger.create({
      data: {
        userId,
        title,
        description,
        emailOruser,
        password : hashPassword,
        category,
      },
    });

    
    return NextResponse.json({ message: "Pass created successfully", PassMan }, );
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}



