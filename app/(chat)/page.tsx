// app/(chat)/ClientChat.tsx
"use client"; 

import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import React, { useEffect, useState } from 'react'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'

export default function ClientChat() {
  const [session, setSession] = useState<Session | null>(null)
  const [missingKeys, setMissingKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const id = nanoid()

  useEffect(() => {
    const fetchSessionAndKeys = async () => {
      try {
        const sessionData = (await auth()) as Session
        const missingKeysData = await getMissingKeys()

        setSession(sessionData)
        setMissingKeys(missingKeysData)
      } catch (error) {
        console.error('Error fetching session or keys:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessionAndKeys()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Please log in to access Umi Care's services.</div>
  }

  if (missingKeys.length > 0) {
    return <div>Missing required configurations: {missingKeys.join(', ')}</div>
  }

  return (
    <AI
      initialAIState={{
        chatId: id,
        messages: [],
        initialPrompt: `You are an AI assistant helping a patient at Umi Care. The patient might ask healthcare-related questions. Please provide accurate, clear, and helpful responses.`
      }}
    >
      <Chat id={id} session={session} missingKeys={missingKeys} />
    </AI>
  )
}
