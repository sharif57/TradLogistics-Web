'use client'

import ChatArea from '@/components/home/chat-area'
import Sidebar from '@/components/home/sidebar'
import { useGetInboxQuery, useGetMessagesQuery } from '@/redux/feature/chatSlice'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useMemo, useRef, useState } from 'react'
// import Sidebar from '@/components/sidebar'
// import ChatArea from '@/components/chat-area'

interface Message {
  id: string
  type: 'user' | 'support'
  text: string
  timestamp: string
  label?: string
}

interface Contact {
  id: string
  conversationId: number
  publicId: string
  userId: number
  name: string
  role: string
  phone: string
  avatar: string | null
  lastMessage: string
  timestamp: string
  unreadCount: number
}

interface InboxConversation {
  id: number
  public_id: string
  created_at: string
  unread_count: number
  other_user: {
    user_id: number
    name: string
    phone: string
    role: string
    profile_image: string | null
  }
  last_message: {
    text: string
    created_at: string
  } | null
}

interface InboxResponse {
  status: string
  data: InboxConversation[]
}

interface ConversationMessage {
  id: number
  conversation: number
  sender: number
  sender_name: string
  sender_role?: string
  sender_avatar: string | null
  text: string
  created_at: string
}

interface ConversationMessagesResponse {
  status: string
  data: ConversationMessage[]
}

const getSocketBaseUrl = (rawUrl: string): string => {
  if (!rawUrl) {
    return ''
  }

  try {
    const parsed = new URL(rawUrl)
    const protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${parsed.host}`
  } catch {
    return rawUrl
      .replace(/^https?:\/\//, (protocol) => (protocol === 'https://' ? 'wss://' : 'ws://'))
      .replace(/\/api(?:\/.*)?$/, '')
      .replace(/\/$/, '')
  }
}

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [liveMessages, setLiveMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const getMessageTypeFromRole = (senderRole?: string, senderId?: number): Message['type'] => {
    const normalizedRole = senderRole?.toLowerCase()

    if (normalizedRole === 'driver') {
      return 'user'
    }

    if (normalizedRole === 'customer') {
      return 'support'
    }

    if (currentUserId !== null && senderId !== undefined) {
      return senderId === currentUserId ? 'support' : 'user'
    }

    return 'user'
  }

  const { data } = useGetInboxQuery(undefined)

  const contacts = useMemo((): Contact[] => {
    const inboxData = (data as InboxResponse | undefined)?.data ?? []

    return inboxData.map((conversation) => {
      const messageTime = conversation.last_message?.created_at ?? conversation.created_at

      return {
        id: conversation.public_id,
        conversationId: conversation.id,
        publicId: conversation.public_id,
        userId: conversation.other_user.user_id,
        name: conversation.other_user.name,
        role: conversation.other_user.role,
        phone: conversation.other_user.phone,
        avatar: conversation.other_user.profile_image,
        lastMessage: conversation.last_message?.text ?? 'No messages yet',
        timestamp: new Date(messageTime).toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          month: 'short',
          day: '2-digit',
        }),
        unreadCount: conversation.unread_count,
      }
    })
  }, [data])

  useEffect(() => {
    if (!contacts.length) {
      setSelectedContact(null)
      return
    }

    setSelectedContact((prev) => {
      if (!prev) {
        return contacts[0]
      }

      const stillExists = contacts.find((contact) => contact.id === prev.id)
      return stillExists ?? contacts[0]
    })
  }, [contacts])

  const { data: conversationMessagesData , refetch} = useGetMessagesQuery(
    selectedContact?.publicId ?? skipToken
  )

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      setCurrentUserId(null)
      return
    }

    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1])) as { user_id?: string | number }
      const parsedId = Number(payload?.user_id)
      setCurrentUserId(Number.isNaN(parsedId) ? null : parsedId)
    } catch {
      setCurrentUserId(null)
    }
  }, [])

  const formattedMessages = useMemo((): Message[] => {
    const apiMessages = (conversationMessagesData as ConversationMessagesResponse | undefined)?.data ?? []

    return apiMessages.map((message) => ({
      id: message.id.toString(),
      type: getMessageTypeFromRole(message.sender_role, message.sender),
      text: message.text,
      timestamp: new Date(message.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      label: message.sender_name,
    }))
  }, [conversationMessagesData, currentUserId])

  useEffect(() => {
    setLiveMessages([])
  }, [selectedContact?.publicId])

  useEffect(() => {
    if (!selectedContact?.publicId) {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      return
    }

    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      return
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    const wsUrlFromEnv = process.env.NEXT_PUBLIC_WS_URL || ''
    let wsBase = getSocketBaseUrl(wsUrlFromEnv)

    if (!wsBase) {
      wsBase = getSocketBaseUrl(apiUrl)
    }

    if (!wsBase) {
      wsBase = 'ws://10.10.12.49:8000'
    }

    const socketUrl = `${wsBase}/ws/chat/${selectedContact.publicId}/?token=${encodeURIComponent(accessToken)}`
    const socket = new WebSocket(socketUrl)
    wsRef.current = socket

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as {
          id?: string | number
          text?: string
          message?: string
          sender?: number
          sender_name?: string
          sender_role?: string
          created_at?: string
          type?: string
        }

        if (payload.type && payload.type !== 'message') {
          return
        }

        const text = payload.text ?? payload.message
        if (!text) {
          return
        }

        const newMessage: Message = {
          id: payload.id ? String(payload.id) : `${Date.now()}`,
          type: getMessageTypeFromRole(payload.sender_role, payload.sender),
          text,
          timestamp: payload.created_at
            ? new Date(payload.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          label: payload.sender_name || 'Support',
        }

        setLiveMessages((prev) => {
          if (payload.id && prev.some((message) => message.id === String(payload.id))) {
            return prev
          }
          return [...prev, newMessage]
        })
      } catch {
        // no-op
      }
    }

    return () => {
      socket.close()
      if (wsRef.current === socket) {
        wsRef.current = null
      }
    }
  }, [selectedContact?.publicId, currentUserId])

  const messages = useMemo(
    () => [...formattedMessages, ...liveMessages],
    [formattedMessages, liveMessages]
  )

  const handleSendMessage = () => {
    const text = inputValue.trim()
    if (text) {
      const ws = wsRef.current
      const isSocketOpen = ws?.readyState === WebSocket.OPEN
      refetch() // Refetch messages to ensure we have the latest data, especially if WebSocket is not open
      if (isSocketOpen) {
        ws.send(
          JSON.stringify({
            type: 'message',
            text,
          })
        )
      }

      if (!isSocketOpen) {
        const newMessage: Message = {
          id: `local-${Date.now()}`,
          type: 'user',
          text,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          label: 'You',
        }
        setLiveMessages((prev) => [...prev, newMessage])
      }

      setInputValue('')
    }
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar
        contacts={contacts}
        selectedContact={selectedContact}
        onSelectContact={setSelectedContact}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Chat area with fixed header/footer and scrollable middle */}
      <ChatArea
        contact={selectedContact}
        messages={messages}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
    </div>
  )
}
