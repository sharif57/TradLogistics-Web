'use client'

import { Search } from 'lucide-react'

export default function ChatHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border ">
      <div className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 md:px-8">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">Support</h1>
        <button
          className="p-2 hover:bg-muted rounded-lg transition-colors duration-200 hover:scale-105"
          aria-label="Search"
        >
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
        </button>
      </div>
    </header>
  )
}
