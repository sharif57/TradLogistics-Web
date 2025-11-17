"use client"

import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetPrivacyPolicyQuery, useUpdatePrivacyPoliceMutation } from "@/redux/feature/settingSlice"
import 'react-quill-new/dist/quill.snow.css'
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import { useState } from "react"
import dynamic from "next/dynamic"

export default function PrivacyAndPolicy() {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState('')

  const { data, isLoading, error } = useGetPrivacyPolicyQuery(undefined)
  const [updatePrivacyPolice] = useUpdatePrivacyPoliceMutation()

  const policyDescription = data?.data[0]?.description || ""

  const handleEditClick = () => {
    setValue(policyDescription) 

    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      await updatePrivacyPolice({
        id: data?.data[0]?.id, 
        description: value,
      }).unwrap()
      setIsEditing(false) 
    } catch (err) {
      console.error("Failed to save privacy policy:", err)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setValue('') 
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Privacy and Policy</h2>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading privacy policy.</p>
        ) : !isEditing ? (
          <p dangerouslySetInnerHTML={{ __html: policyDescription }}></p>
        ) : (
          <ReactQuill theme="snow" value={value} onChange={setValue} />
        )}
      </div>

      <div className="flex justify-end pt-4 gap-4">
        {!isEditing ? (
          <Button onClick={handleEditClick} className="bg-[#8FD2FF] hover:bg-[#8FD2FF] text-black">Edit Policy</Button>
        ) : (
          <>
            <Button variant="outline" className="bg-[#8FD2FF] hover:bg-[#8FD2FF] text-black" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        )}
      </div>
    </div>
  )
}