'use client'

import { useEffect, useRef } from 'react'

interface Message {
  id: string
  type: 'user' | 'support'
  text: string
  timestamp: string
  label?: string
}

interface ChatMessagesProps {
  messages: Message[]
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto ">
      <div className="w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-start' : 'justify-end'} gap-2`}
            >
              <div
                className={`flex flex-col gap-1.5 ${
                  message.type === 'user' ? 'items-start max-w-xs sm:max-w-md md:max-w-xl' : 'items-end max-w-xs sm:max-w-md md:max-w-lg'
                }`}
              >
                {/* {message.label && (
                  <span className="text-xs sm:text-sm text-muted-foreground px-3">{message.label}</span>
                )} */}
                <div
                  className={`px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-sm sm:text-base leading-relaxed ${
                    message.type === 'user'
                      ? 'bg-muted text-foreground rounded-bl-none rounded-r-full rounded-tl-full'
                      : 'bg-primary text-white rounded-br-none rounded-l-full rounded-tr-full  shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs font-normal">{message.text}</p>
                </div>
                <span className="text-xs text-muted-foreground px-3">{message.timestamp}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}
