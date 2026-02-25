
'use client'

import ChatArea from '@/components/home/chat-area'
import Sidebar from '@/components/home/sidebar'
import { useGetInboxQuery, useGetMessagesQuery, useMarkAsReadMutation } from '@/redux/feature/chatSlice'
import { skipToken } from '@reduxjs/toolkit/query'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface Message {
  id: string
  type: 'user' | 'support'
  text: string
  timestamp: string
  label?: string
  createdAtMs?: number
}

interface Contact {
  id: string
  conversationId: number
  publicId: string
  userId: number   // ← the OTHER user's id (customer/driver)
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
  last_message: { text: string; created_at: string } | null
}

interface InboxResponse {
  status: string
  data: InboxConversation[]
}

interface ConversationMessage {
  id: number
  conversation: number
  sender: number          // ← sender's numeric user id
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const getSocketBaseUrl = (rawUrl: string): string => {
  if (!rawUrl) return ''
  try {
    const parsed = new URL(rawUrl)
    const protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${parsed.host}`
  } catch {
    return rawUrl
      .replace(/^https?:\/\//, (p) => (p === 'https://' ? 'wss://' : 'ws://'))
      .replace(/\/api(?:\/.*)?$/, '')
      .replace(/\/$/, '')
  }
}

const formatTime = (dateStr?: string) =>
  new Date(dateStr ?? Date.now()).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

const resolveMessageSide = (params: {
  senderId?: number | string | null
  senderRole?: string
  currentUserId: number | null
  contactUserId: number | null
}): Message['type'] => {
  const { senderId, senderRole, currentUserId, contactUserId } = params
  const numericSender = senderId != null ? Number(senderId) : null

  // 1. Compare with logged-in admin id
  if (numericSender != null && currentUserId != null) {
    return numericSender === currentUserId ? 'support' : 'user'
  }

  // 2. Compare with the contact (other person) id
  if (numericSender != null && contactUserId != null) {
    return numericSender === contactUserId ? 'user' : 'support'
  }

  // 3. Role fallback
  const role = senderRole?.toLowerCase() ?? ''
  if (['admin', 'support', 'agent', 'staff'].includes(role)) return 'support'
  return 'user'
}

// ── Component ─────────────────────────────────────────────────────────────────
function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [wsHistoryMessages, setWsHistoryMessages] = useState<Message[]>([])
  const [liveMessages, setLiveMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  const [markAsRead] = useMarkAsReadMutation();

  // ── Stable refs ───────────────────────────────────────────────────────────
  const wsRef = useRef<WebSocket | null>(null)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingMessagesRef = useRef<string[]>([])
  const pendingUrlMessageRef = useRef<string | null>(null)
  const pendingUrlConversationRef = useRef<string | null>(null)
  const pinnedSelectedIdRef = useRef<string | null>(null)
  const handledUrlRef = useRef(false)
  const routerRef = useRef(router)
  const searchParamsRef = useRef(searchParams)
  // Keep latest values accessible inside WS closure without triggering reconnect
  const currentUserIdRef = useRef<number | null>(null)
  const selectedContactRef = useRef<Contact | null>(null)

  useEffect(() => { routerRef.current = router }, [router])
  useEffect(() => { searchParamsRef.current = searchParams }, [searchParams])
  useEffect(() => { currentUserIdRef.current = currentUserId }, [currentUserId])
  useEffect(() => { selectedContactRef.current = selectedContact }, [selectedContact])

  // ── Decode JWT for currentUserId ──────────────────────────────────────────
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) { setCurrentUserId(null); return }
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1])) as {
        user_id?: string | number
      }
      const parsedId = Number(payload?.user_id)
      setCurrentUserId(Number.isNaN(parsedId) ? null : parsedId)
    } catch {
      setCurrentUserId(null)
    }
  }, [])

  // ── Inbox ─────────────────────────────────────────────────────────────────
  const { data, refetch } = useGetInboxQuery(undefined)

  const contacts = useMemo((): Contact[] => {
    const inboxData = (data as InboxResponse | undefined)?.data ?? []
    return inboxData.map((conv) => {
      const messageTime = conv.last_message?.created_at ?? conv.created_at
      return {
        id: conv.public_id,
        conversationId: conv.id,
        publicId: conv.public_id,
        userId: conv.other_user.user_id,
        name: conv.other_user.name,
        role: conv.other_user.role,
        phone: conv.other_user.phone,
        avatar: conv.other_user.profile_image,
        lastMessage: conv.last_message?.text ?? 'No messages yet',
        timestamp: new Date(messageTime).toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          month: 'short',
          day: '2-digit',
        }),
        unreadCount: conv.unread_count,
      }
    })
  }, [data])

  // ── Capture URL params once ───────────────────────────────────────────────
  useEffect(() => {
    if (handledUrlRef.current) return
    const conversationId = searchParams.get('conversationId')
    const text = searchParams.get('text')
    if (!conversationId && !text) return
    pendingUrlConversationRef.current = conversationId
    pendingUrlMessageRef.current = text
  }, [searchParams])

  // ── Auto-select contact ───────────────────────────────────────────────────
  useEffect(() => {
    if (!contacts.length) { setSelectedContact(null); return }

    const pinnedId = pinnedSelectedIdRef.current
    if (pinnedId) {
      const pinnedMatch = contacts.find((c) => c.id === pinnedId || c.publicId === pinnedId)
      if (pinnedMatch) {
        if (selectedContact?.id !== pinnedMatch.id) {
          setSelectedContact(pinnedMatch)
        }
        return
      }
    }

    const pendingConversationId = pendingUrlConversationRef.current
    if (pendingConversationId) {
      const match = contacts.find(
        (c) => c.publicId === pendingConversationId || c.id === pendingConversationId
      )
      if (match && selectedContact?.id !== match.id) {
        setSelectedContact(match)
        return
      }
    }
    setSelectedContact((prev) => {
      if (!prev) return contacts[0]
      return contacts.find((c) => c.id === prev.id) ?? contacts[0]
    })
  }, [contacts, selectedContact?.id])

  // ── REST fallback (when WS history is empty) ──────────────────────────────
  const { data: conversationMessagesData } = useGetMessagesQuery(
    selectedContact?.publicId ?? skipToken
  )

  const formattedMessages = useMemo((): Message[] => {
    const apiMessages =
      (conversationMessagesData as ConversationMessagesResponse | undefined)?.data ?? []
    return apiMessages.map((msg) => ({
      id: msg.id.toString(),
      // ✅ Use sender id comparison — correct on reload
      type: resolveMessageSide({
        senderId: msg.sender,
        senderRole: msg.sender_role,
        currentUserId,
        contactUserId: selectedContact?.userId ?? null,
      }),
      text: msg.text,
      timestamp: formatTime(msg.created_at),
      label: msg.sender_name,
      createdAtMs: new Date(msg.created_at).getTime(),
    }))
  }, [conversationMessagesData, currentUserId, selectedContact?.userId])

  // ── Reset on conversation change ──────────────────────────────────────────
  useEffect(() => {
    setLiveMessages([])
    setWsHistoryMessages([])
  }, [selectedContact?.publicId])

  // ── Stable addLiveMessage (zero deps, functional update = no stale closure) ─
  const addLiveMessage = useCallback((incoming: Message) => {
    setLiveMessages((prev) => {
      // 1. Deduplicate by server id
      if (!incoming.id.startsWith('local-') && prev.some((m) => m.id === incoming.id)) {
        return prev
      }
      // 2. Replace optimistic echo (same text, within 10s)
      const matchIdx = prev.findIndex(
        (m) =>
          m.id.startsWith('local-') &&
          m.text === incoming.text &&
          incoming.createdAtMs !== undefined &&
          m.createdAtMs !== undefined &&
          Math.abs(m.createdAtMs - incoming.createdAtMs) < 10_000
      )
      if (matchIdx >= 0) {
        const next = [...prev]
        next[matchIdx] = incoming
        return next
      }
      return [...prev, incoming]
    })
  }, []) // zero deps

  // ── WebSocket ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedContact?.publicId) {
      wsRef.current?.close()
      wsRef.current = null
      return
    }

    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    const wsUrlFromEnv = process.env.NEXT_PUBLIC_WS_URL || ''
    const wsBase =
      getSocketBaseUrl(wsUrlFromEnv) ||
      getSocketBaseUrl(apiUrl) ||
      'ws://10.10.12.49:8000'

    const publicId = selectedContact.publicId
    const socketUrl = `${wsBase}/ws/chat/${publicId}/?token=${encodeURIComponent(accessToken)}`
    let isCancelled = false

    const clearUrlParams = () => {
      const params = new URLSearchParams(searchParamsRef.current.toString())
      params.delete('conversationId')
      params.delete('text')
      const q = params.toString()
      routerRef.current.replace(q ? `/inbox?${q}` : '/inbox', { scroll: false })
    }

    const connectSocket = () => {
      if (isCancelled) return

      const socket = new WebSocket(socketUrl)
      wsRef.current = socket

      socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'fetch_chat', page: 1, page_size: 30 }))

        while (pendingMessagesRef.current.length) {
          const q = pendingMessagesRef.current.shift()
          if (q) socket.send(q)
        }

        const pendingText = pendingUrlMessageRef.current
        const pendingConvId = pendingUrlConversationRef.current
        if (!handledUrlRef.current && pendingText && pendingConvId === publicId) {
          socket.send(JSON.stringify({ type: 'send_message', text: pendingText }))
          handledUrlRef.current = true
          pendingUrlMessageRef.current = null
          pendingUrlConversationRef.current = null
          clearUrlParams()
        }
      }

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data as string) as {
            type?: string
            id?: string | number
            text?: string
            message?: string
            sender?: number
            sender_id?: number
            sender_name?: string
            sender_role?: string
            role?: string
            created_at?: string
            data?: {
              id?: string | number
              text?: string
              message?: string
              sender?: number
              sender_id?: number
              sender_name?: string
              sender_role?: string
              role?: string
              created_at?: string
              messages?: Array<{
                id: number
                sender_id: number
                sender?: number
                role?: string
                sender_name?: string
                text: string
                created_at: string
              }>
            }
          }

          // ── chat_details: full history ──────────────────────────────────
          if (payload.type === 'chat_details' && payload.data?.messages) {
            // Read latest values from refs (no stale closure)
            const myId = currentUserIdRef.current
            const contactId = selectedContactRef.current?.userId ?? null

            const history: Message[] = payload.data.messages.map((m) => ({
              id: m.id.toString(),
              // ✅ sender id comparison — consistent with REST
              type: resolveMessageSide({
                senderId: m.sender ?? m.sender_id,
                senderRole: m.role,
                currentUserId: myId,
                contactUserId: contactId,
              }),
              text: m.text,
              timestamp: formatTime(m.created_at),
              label: m.sender_name ?? m.role ?? 'User',
              createdAtMs: new Date(m.created_at).getTime(),
            }))
            setWsHistoryMessages(history)
            setLiveMessages([])
            return
          }

          // ── Ignore unrelated types ────────────────────────────────────
          const allowedTypes = new Set(['message', 'send_message', 'new_message', 'chat_message'])
          if (payload.type && !allowedTypes.has(payload.type)) return

          // ── Live message ──────────────────────────────────────────────
          const msgData =
            payload.data && (payload.data.text || payload.data.message)
              ? payload.data
              : payload

          const text = msgData.text ?? msgData.message
          if (!text) return

          const senderId = msgData.sender ?? msgData.sender_id
          const senderRole = msgData.sender_role ?? msgData.role
          const createdAt = msgData.created_at
          const createdAtMs = createdAt ? new Date(createdAt).getTime() : Date.now()
          const serverMsgId = msgData.id ? String(msgData.id) : `ws-${Date.now()}`

          // Read latest values from refs
          const myId = currentUserIdRef.current
          const contactId = selectedContactRef.current?.userId ?? null

          const incoming: Message = {
            id: serverMsgId,
            // ✅ sender id comparison — correct for live messages too
            type: resolveMessageSide({
              senderId,
              senderRole,
              currentUserId: myId,
              contactUserId: contactId,
            }),
            text,
            timestamp: formatTime(createdAt),
            label: msgData.sender_name ?? senderRole ?? 'User',
            createdAtMs,
          }

          addLiveMessage(incoming)
        } catch {
          // ignore parse errors
        }
      }

      socket.onerror = () => {
        if (wsRef.current === socket) wsRef.current = null
      }

      socket.onclose = () => {
        if (isCancelled) return
        if (wsRef.current === socket) wsRef.current = null
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = setTimeout(connectSocket, 2000)
      }
    }

    connectSocket()

    return () => {
      isCancelled = true
      wsRef.current?.close()
      wsRef.current = null
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContact?.publicId, addLiveMessage])

  // ── Merge history + live ──────────────────────────────────────────────────
  const messages = useMemo(() => {
    const base: Message[] = wsHistoryMessages.length ? wsHistoryMessages : formattedMessages
    const baseIds = new Set(base.map((m) => m.id))
    const dedupedLive = liveMessages.filter((m) => !baseIds.has(m.id))
    return [...base, ...dedupedLive]
  }, [formattedMessages, wsHistoryMessages, liveMessages])

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSendMessage = () => {
    const text = inputValue.trim()
    if (!text) return

    const payload = JSON.stringify({ type: 'send_message', text })
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(payload)
    } else {
      pendingMessagesRef.current.push(payload)
    }

    // Optimistic — always RIGHT for admin
    const optimistic: Message = {
      id: `local-${Date.now()}`,
      type: 'support',
      text,
      timestamp: formatTime(),
      label: 'You',
      createdAtMs: Date.now(),
    }
    setLiveMessages((prev) => [...prev, optimistic])
    setInputValue('')
  }

  // ── Select contact ────────────────────────────────────────────────────────
  const handleSelectContact = (contact: Contact) => {
    pinnedSelectedIdRef.current = contact.id
    setSelectedContact(contact)

    const params = new URLSearchParams(searchParamsRef.current.toString())
    params.set('conversationId', contact.publicId)
    params.delete('text')
    const nextQuery = params.toString()
    routerRef.current.replace(nextQuery ? `/inbox?${nextQuery}` : '/inbox', { scroll: false })

    if (contact.unreadCount > 0) {
      markAsRead(contact.publicId)
        .unwrap()
        .catch(() => {
          // ignore read failure in UI flow
        })
        .finally(() => {
          refetch()
        })
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar
        contacts={contacts}
        selectedContact={selectedContact}
        onSelectContact={handleSelectContact}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
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

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen w-full"><span className="text-muted-foreground">Loading inbox...</span></div>}>
      <ChatPage />
    </Suspense>
  )
}