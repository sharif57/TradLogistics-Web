
"use client"

import { useEditTermsAndConditionsMutation, useGetTermsAndConditionsQuery } from "@/redux/feature/settingSlice"
import { Shield } from "lucide-react"
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import 'react-quill-new/dist/quill.snow.css'
import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "../ui/button"

export default function TrustAndSafety() {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState('')

  const { data, isLoading, error } = useGetTermsAndConditionsQuery(undefined)
  const [editTermsAndConditions] = useEditTermsAndConditionsMutation()

  const termsDescription = data?.data[0]?.description || ""

  const handleEditClick = () => {
    setValue(termsDescription)
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      await editTermsAndConditions({
        id: data?.data[0]?.id, 
        description: value,
      }).unwrap()
      setIsEditing(false) 
    } catch (err) {
      console.error("Failed to save terms:", err)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setValue('') 
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Terms and Conditions</h2>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading terms and conditions.</p>
        ) : !isEditing ? (
          <p dangerouslySetInnerHTML={{ __html: termsDescription }}></p>
        ) : (
          <ReactQuill theme="snow" value={value} onChange={setValue} />
        )}
      </div>

      <div className="flex justify-end pt-4 gap-4">
        {!isEditing ? (
          <Button onClick={handleEditClick} className="bg-[#8FD2FF] hover:bg-[#8FD2FF] text-black">Edit Terms</Button>
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