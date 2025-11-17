"use client"

import { useGetAboutQuery, useUpdateAboutMutation } from "@/redux/feature/settingSlice"
import { ScrollText } from "lucide-react"
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "../ui/button"

export default function AboutUs() {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState('')

  const { data, isLoading, error } = useGetAboutQuery(undefined)
  const [updateAbout] = useUpdateAboutMutation()

  // Initialize editor with existing about content when data is available
  const aboutDescription = data?.data[0]?.description || ""

  const handleEditClick = () => {
    setValue(aboutDescription) // Populate editor with current about content
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      await updateAbout({
        id: data?.data[0]?.id, // Assuming the API expects an ID
        description: value,
      }).unwrap()
      setIsEditing(false) // Close editor after saving
    } catch (err) {
      console.error("Failed to save about content:", err)
      // Optionally show an error message to the user
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setValue('') // Clear editor content
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ScrollText className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">About Us</h2>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading about content.</p>
        ) : !isEditing ? (
          <p dangerouslySetInnerHTML={{ __html: aboutDescription }}></p>
        ) : (
          <ReactQuill theme="snow" value={value} onChange={setValue} />
        )}
      </div>

      <div className="flex justify-end pt-4 gap-4">
        {!isEditing ? (
          <Button onClick={handleEditClick} className="bg-[#8FD2FF] hover:bg-[#8FD2FF] text-black">Edit About</Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleCancel} className="bg-[#8FD2FF] hover:bg-[#8FD2FF] text-black">Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        )}
      </div>
    </div>
  )
}