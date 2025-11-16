'use client'

import { X, Search } from 'lucide-react'
import { useState } from 'react'

interface Contact {
    id: string
    name: string
    avatar: string
    lastMessage: string
    timestamp: string
}

interface SidebarProps {
    contacts: Contact[]
    selectedContact: Contact
    onSelectContact: (contact: Contact) => void
    isOpen: boolean
    onClose: () => void
}

export default function Sidebar({
    contacts,
    selectedContact,
    onSelectContact,
    isOpen,
    onClose
}: SidebarProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed md:static inset-y-0 left-0 z-40 w-72 border-r border-border bg-[#e7f1f8] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    } flex flex-col h-screen overflow-hidden`}
            >
                {/* Header - fixed height, doesn't scroll */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">All Messages</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-background rounded-lg transition-colors md:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5 text-foreground" />
                    </button>
                </div>

                {/* Search - fixed height, doesn't scroll */}
                <div className="flex-shrink-0 p-4 border-b border-border">
                    <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none"
                        />
                    </div>
                </div>

                {/* Contacts list - scrollable */}
                <div className="flex-1 overflow-y-auto">
                    {filteredContacts.map((contact) => (
                        <button
                            key={contact.id}
                            onClick={() => {
                                onSelectContact(contact)
                                onClose()
                            }}
                            className={`w-full px-4 py-3 flex items-start gap-3 border-b border-border hover:bg-background transition-colors ${selectedContact.id === contact.id ? 'bg-[#F8F9FD]' : ''
                                }`}
                        >
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-lg flex-shrink-0 mt-1">
                                {contact.avatar}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 text-left space-y-1">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {contact.name}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                    {contact.lastMessage}
                                </p>
                                <p className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                                    {contact.timestamp}
                                </p>
                            </div>

                            {/* Timestamp */}

                        </button>
                    ))}
                </div>
            </aside>
        </>
    )
}
