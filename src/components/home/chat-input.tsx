// 'use client'

// import { Send, Plus } from 'lucide-react'
// import { useState } from 'react'

// interface ChatInputProps {
//   inputValue: string
//   onInputChange: (value: string) => void
//   onSendMessage: () => void
// }

// export default function ChatInput({
//   inputValue,
//   onInputChange,
//   onSendMessage
// }: ChatInputProps) {
//   const [rows, setRows] = useState(1)

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       onSendMessage()
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     onInputChange(e.target.value)
//     const newRows = Math.min(Math.max(1, e.target.value.split('\n').length), 4)
//     setRows(newRows)
//   }

//   return (
//     <footer className="sticky bottom-0 z-50 w-full border-t border-border bg-background">
//       <div className="h-20 sm:h-24 md:h-28 flex flex-col justify-end px-4 sm:px-6 md:px-8 py-3 sm:py-4">
//         <div className="max-w-4xl mx-auto w-full">
//           <div className="flex items-end gap-2 sm:gap-3">


//             <div className="flex-1 flex items-end gap-2 sm:gap-3">
//               <textarea
//                 value={inputValue}
//                 onChange={handleChange}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Start new conversation here"
//                 className="flex-1 px-4 py-2 sm:py-3 bg-muted text-foreground rounded-lg resize-none max-h-20 sm:max-h-24 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                 rows={rows}
//               />

//               <button
//                 onClick={onSendMessage}
//                 disabled={!inputValue.trim()}
//                 className="p-2.5 sm:p-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
//                 aria-label="Send message"
//               >
//                 <Send className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//               </button>
//             </div>
//           </div>


//         </div>
//       </div>
//     </footer>
//   )
// }
'use client'

import { Send, Plus } from 'lucide-react'
import { useState } from 'react'

interface ChatInputProps {
  inputValue: string
  onInputChange: (value: string) => void
  onSendMessage: () => void
}

export default function ChatInput({
  inputValue,
  onInputChange,
  onSendMessage
}: ChatInputProps) {
  const [rows, setRows] = useState(1)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value)
    const newRows = Math.min(Math.max(1, e.target.value.split('\n').length), 4)
    setRows(newRows)
  }

  return (
    <footer className="flex-shrink-0 w-full border-t border-border bg-background">
      <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        <div className="w-full">
          {/* <div className="flex items-end gap-2 sm:gap-3">


            <div className="flex-1 flex items-end gap-2 sm:gap-3">
              <textarea
                value={inputValue}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-2 sm:py-3 bg-muted text-foreground rounded-lg resize-none max-h-20 sm:max-h-24 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                rows={rows}
              />

              <button
                onClick={onSendMessage}
                disabled={!inputValue.trim()}
                className="p-2.5 sm:p-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                aria-label="Send message"
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>
          </div> */}
          

        </div>
        <div className="flex items-center w-full max-w-2xl mx-auto bg-muted  rounded-lg shadow-sm">
          <textarea
            value={inputValue}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            rows={rows}
            placeholder="Type your message here ..."
            className="flex-1 px-4 py-2 sm:py-3 bg-muted text-foreground rounded-lg resize-none max-h-20 sm:max-h-24 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={onSendMessage}
            disabled={!inputValue.trim()}
            className="bg-blue-500  hover:bg-blue-600 text-white p-2 rounded-full">
            <Plus size={20} />
          </button>
        </div>

      </div>
    </footer>
  )
}
