/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useResetPasswordMutation } from "@/redux/feature/authSlice"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ChangePassword() {
  const router= useRouter();
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }))
  }

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const validatePasswords = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("All password fields are required.")
      return false
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New password and confirm password do not match.")
      return false
    }

    // Add more password strength checks as needed (e.g., regex for special characters)
    return true
  }

  const handleSave = async () => {
    if (!validatePasswords()) return

    try {
      const response = await resetPassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      }).unwrap()
      toast.success(response.message || "Password changed successfully!")
      // Reset form after success
      setPasswords({ current: "", new: "", confirm: "" })
      router.push('/')
      
    } catch (error: any) {
      const errorMessage =
        error.data?.message || "Something went wrong. Please try again later."
      toast.error(errorMessage)
      console.error("Password change error:", error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>

      <div className="space-y-4">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-sm font-medium text-gray-700">
            Current Password
          </Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showPasswords.current ? "text" : "password"}
              value={passwords.current}
              onChange={(e) => handlePasswordChange("current", e.target.value)}
              className="pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">
            New Password
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPasswords.new ? "text" : "password"}
              value={passwords.new}
              onChange={(e) => handlePasswordChange("new", e.target.value)}
              className="pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) => handlePasswordChange("confirm", e.target.value)}
              className="pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSave}
          className="px-8 py-2 bg-[#8FD2FF] hover:bg-[#8FD2FF] text-black text-white rounded-lg font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  )
}