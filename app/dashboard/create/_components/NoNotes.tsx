"use client"
import { Button } from '@/components/ui/button'
import { useDialog } from '@/context/CreateDialogContext'
import Image from 'next/image'
import React from 'react'

const NoNotes = () => {
      const {  openDialog  } = useDialog();
  return (
       <div className="w-full h-screen flex flex-col gap-3 items-center justify-center">
         <Image src='/images/NoItems.png' alt="noNotes found " width={100} height={100} className="w-86" />
         <h1 className="font-bold text-2xl">There is no notes </h1>
           <Button onClick={openDialog}>Create new Note</Button>
       </div>
  )
}

export default NoNotes