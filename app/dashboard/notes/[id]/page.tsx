import Tiptap from '@/components/Tiptap';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

import { prisma } from '@/lib/db';

import React from 'react'

type tParams = { id: string };

const  page = async (props: { params: tParams}) => {
  const {id} = props.params

  const notes = await prisma.note.findUnique({
    where : {
      id : id
    }
  })

  if(!notes) return null

  const notebody = await prisma.noteBody.findUnique({
    where : {
      noteId : id
    }
  })

const isThereContent = notebody && notebody.content && Object.keys(notebody.content).length > 0;


  return (
    <div className='w-full overx'>

      <div className='w-full h-max flex items-center justify-center'>
       {isThereContent? (<>
      <SimpleEditor noteId={id} content={notebody.content} editable={false}/>
       </>): (
          <SimpleEditor noteId={id}/>
       ) }
      </div>
    </div>
  )
}

export default page