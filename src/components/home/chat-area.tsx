'use client'

import { Menu } from 'lucide-react'
import ChatMessages from './chat-messages'
import ChatInput from './chat-input'
// import ChatHeader from '@/components/chat-header'
// import ChatMessages from '@/components/chat-messages'
// import ChatInput from '@/components/chat-input'

interface Message {
  id: string
  type: 'user' | 'support'
  text: string
  timestamp: string
  label?: string
}

interface Contact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
}

interface ChatAreaProps {
  contact: Contact
  messages: Message[]
  inputValue: string
  onInputChange: (value: string) => void
  onSendMessage: () => void
  onMenuClick: () => void
}

export default function ChatArea({
  contact,
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  onMenuClick
}: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col h-screen w-full overflow-hidden">
      <header className="flex-shrink-0 w-full border-b border-border bg-background">
        <div className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-muted rounded-lg transition-colors md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-lg">
                {contact.avatar}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{contact.name}</p>
              </div>
            </div>
          </div>
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors hover:scale-105"
            aria-label="Search"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </header>

      <ChatMessages messages={messages} />

      <ChatInput
        inputValue={inputValue}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
      />
    </div>
  )
}
