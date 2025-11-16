'use client'

import ChatHeader from '@/components/home/chat-header'
import ChatInput from '@/components/home/chat-input'
import ChatMessages from '@/components/home/chat-messages'
import { useState } from 'react'


interface Message {
  id: string
  type: 'user' | 'support'
  text: string
  timestamp: string
  label?: string
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'user',
    text: 'Hi, I have a question\nI can\'t reach a page from my path',
    timestamp: '10:32 PM',
    label: 'User'
  },
  {
    id: '2',
    type: 'support',
    text: 'Common issue!\nI can\'t reach a page from my path',
    timestamp: '10:32 PM',
    label: 'Support'
  },
  {
    id: '3',
    type: 'user',
    text: 'I am unable to access\nI can\'t reach a page from my path',
    timestamp: '10:32 PM',
    label: 'User'
  },
  {
    id: '4',
    type: 'support',
    text: 'We are working on this\nI can\'t reach a page from my path',
    timestamp: '10:32 PM',
    label: 'Support'
  }
]

export default function Page() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        type: 'user',
        text: inputValue,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        label: 'User'
      }
      setMessages([...messages, newMessage])
      setInputValue('')
    }
  }

  return (
    <div className="flex flex-col h-screen w-full ">
      <ChatHeader />
      <ChatMessages messages={messages} />
      <ChatInput
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}
