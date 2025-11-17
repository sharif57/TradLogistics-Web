'use client'

import ChatArea from '@/components/home/chat-area'
import Sidebar from '@/components/home/sidebar'
import { useState } from 'react'
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
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
}

const contacts: Contact[] = [
  {
    id: '1',
    name: 'Jennifer Markus',
    avatar: '👩‍💼',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '2',
    name: 'Iva Ryan',
    avatar: '👱‍♀️',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '3',
    name: 'Jerry Heifer',
    avatar: '👨‍💼',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '4',
    name: 'David Elson',
    avatar: '👨‍🦰',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
  {
    id: '5',
    name: 'Mary Friend',
    avatar: '👩‍🦱',
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for...',
    timestamp: 'Today | 09:30 PM'
  },
]

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'user',
    text: 'Oh, hello! All perfectly.\nI will check it and get back to you soon',
    timestamp: '04:45 PM',
    label: 'User'
  },
  {
    id: '2',
    type: 'support',
    text: 'Oh, hello! All perfectly.\nI will check it and get back to you soon',
    timestamp: '04:45 PM',
    label: 'Support'
  },
  {
    id: '3',
    type: 'user',
    text: 'Oh, hello! All perfectly.\nI will check it and get back to you soon',
    timestamp: '04:45 PM',
    label: 'User'
  },
  {
    id: '4',
    type: 'support',
    text: 'Oh, hello! All perfectly.\nI will check it and get back to you soon',
    timestamp: '04:45 PM',
    label: 'Support'
  }
]

export default function Page() {
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0])
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
