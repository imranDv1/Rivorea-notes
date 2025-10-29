import { prisma } from "@/lib/db"
import { success } from "zod"

type Pass = {
userId : string
title : string
description : string
emailOruser : string
password : string
category : string
}


export default async function CreateNewPass (data : Pass){
try {
  await prisma.passwordManeger.create({
    data 
 })
  return {success : true , message:"Pass create successfuly"}
} catch (error) {
      return {success : false , message:"error create new Pass"}

}
}


export async function GetAllPass(userId: string) {
   try {
   const res = await fetch('http://localhost:3000/api/passManGet',{
    method : 'POST',
    headers: {'Content-Type': 'application/json'},
    body : JSON.stringify({userId}),
   })
// the res is array of objects
   return res.json()
   } catch (error) {
      return { success: false, message: "error fetching Pass" };  
   }
}