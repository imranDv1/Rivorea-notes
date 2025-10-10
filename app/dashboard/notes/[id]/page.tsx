/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { authClient } from '@/lib/auth-client'
import { useEditorNotificationStore } from '@/context/simpleEditorupddate'

type tParams = { id: string }

const Page = (props: { params: Promise<tParams> }) => {
  const [params, setParams] = useState<tParams | null>(null)
  const [notebody, setNotes] = useState<any | null>(null)
  const [isFetched, setIsFetched] = useState(false)
  const [MAX_CHARS, setMaxChars] = useState<number>(1000) // default limit

  const { data: session } = authClient.useSession()
  const userId = session?.user?.id
  const refreshEditorSignal = useEditorNotificationStore(
    (state) => state.refreshEditorSignal
  )

  // Resolve params promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await props.params
      setParams(resolved)
    }
    resolveParams()
  }, [props.params])

  // Fetch MAX_CHARS based on user subscription
  useEffect(() => {
    if (!userId) return
 
    const fetchMaxChars = async () => {
      try {
        const res = await fetch('/api/getSubs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        })

        if (!res.ok) throw new Error('Failed to fetch MAX_CHARS')

        const data = await res.json()
        setMaxChars(data.MAX_CHARS || 1000)
      } catch (err) {
        console.error(err)
        setMaxChars(1000) // fallback if error
      }
    }

    fetchMaxChars()
  }, [userId])

  // Fetch note data (depends on refresh signal)
  useEffect(() => {
    if (!userId || !params) return

    const fetchNotes = async () => {
      setIsFetched(false)
      try {
        const res = await fetch('/api/notebody', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, noteId: params.id }),
        })

        if (!res.ok) throw new Error('Failed to fetch notes')

        const data = await res.json()
        setNotes(data.notebody || null)
      } catch (err) {
        console.error(err)
        setNotes(null)
      } finally {
        setIsFetched(true)
      }
    }

    fetchNotes()
  }, [userId, params, refreshEditorSignal])

  if (!params || !isFetched) return null

  const isThereContent =
    notebody?.content && Object.keys(notebody.content).length > 0

  return (
    <div className='w-full overflow-x-auto'>
      <div className='w-full h-max flex items-center justify-center'>
        <SimpleEditor
          noteId={params.id}
          content={isThereContent ? notebody.content : undefined}
          editable={false}
          MAX_CHARS={MAX_CHARS} // ✅ Now dynamic based on subscription
        />
      </div>
    </div>
  )
}

export default Page
