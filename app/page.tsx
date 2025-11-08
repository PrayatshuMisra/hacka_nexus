"use client"

import { useState, useEffect } from "react"
import { EnhancedLoginForm } from "@/components/auth/enhanced-login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { Header } from "@/components/dashboard/header"
import { StudentDashboard } from "@/components/dashboard/student/student-dashboard"
import { ClubDashboard } from "@/components/dashboard/club/club-dashboard"
import { Toaster } from "@/components/ui/toaster"
import type { User } from "@/types"
import { AdminDashboard } from "@/components/dashboard/admin/admin-dashboard"
import { ProfileSidebar } from "@/components/dashboard/student/profile-sidebar"
import { supabase } from "@/lib/supabase"

export default function NexusSyncApp() {
  const [currentView, setCurrentView] = useState<"auth" | "signup" | "student" | "club_member" | "admin" | "profile">("auth")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = typeof window !== 'undefined' ? window.matchMedia("(prefers-color-scheme: dark)").matches : false
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark)

    setDarkMode(shouldUseDark)
    document.documentElement.classList.toggle("dark", shouldUseDark)
  }, [])

  useEffect(() => {
    const restoreSession = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
  
        const { data: userProfile, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", session.user.email)
          .single()
        if (userProfile) {
          setCurrentUser({
            ...userProfile,
            fullName: userProfile.full_name,
            email: userProfile.email,
            profileImageUrl: userProfile.profile_image_url
          })
          setCurrentView(userProfile.role === "admin" ? "admin" : userProfile.role === "club_admin" || userProfile.role === "club_member" ? "club_member" : "student")
        }
      }
      setLoading(false)
    }
    restoreSession()
  }, [])

  const handleLogin = async (role: string, user: User) => {
    setLoading(true)

    setCurrentView(role as any)
    setCurrentUser(user)
    setLoading(false)
  }

  const handleSignupSuccess = async (role: string, user: User) => {
    setLoading(true)
    setCurrentView(role as any)
    setCurrentUser(user)
    setLoading(false)
  }

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setCurrentView("auth")
    setCurrentUser(null)
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-data")
    setLoading(false)
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    document.documentElement.classList.toggle("dark", newDarkMode)
    localStorage.setItem("theme", newDarkMode ? "dark" : "light")
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (currentView === "auth") {
    return (
      <>
        <EnhancedLoginForm onLogin={handleLogin} onSignupClick={() => setCurrentView("signup")} />
        <Toaster />
      </>
    )
  }

  if (currentView === "signup") {
    return (
      <>
        <SignupForm onSignupSuccess={handleSignupSuccess} onBackToLogin={() => setCurrentView("auth")} />
        <Toaster />
      </>
    )
  }

  if (currentView === "student") {
    return (
      <>
        <Header
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          userRole="student"
          currentUser={currentUser ? {
            name: currentUser.fullName,
            email: currentUser.email,
            image: currentUser.profileImageUrl || ""
          } : null}
          onProfileClick={() => setCurrentView("profile")}
        />
        <StudentDashboard user={currentUser!} />
        <Toaster />
      </>
    )
  }

  if (currentView === "club_member") {
    return (
      <>
        <Header
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          userRole="club"
          currentUser={currentUser ? {
            name: currentUser.fullName || "",
            email: currentUser.email,
            image: currentUser.profileImageUrl || ""
          } : null}
        />
        <ClubDashboard />
        <Toaster />
      </>
    )
  }

  if (currentView === "admin") {
    return (
      <>
        <Header
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          userRole="admin"
          currentUser={currentUser ? {
            name: currentUser.fullName || "",
            email: currentUser.email,
            image: currentUser.profileImageUrl || ""
          } : null}
        />
        <AdminDashboard />
        <Toaster />
      </>
    )
  }

  if (currentView === "profile") {
    return (
      <>
        <Header
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          userRole="student"
          currentUser={currentUser ? {
            name: currentUser.fullName,
            email: currentUser.email,
            image: currentUser.profileImageUrl || ""
          } : null}
        />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <button
            className="mb-4 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={() => setCurrentView("student")}
          >
            ← Back to Dashboard
          </button>
          <ProfileSidebar />
        </div>
        <Toaster />
      </>
    )
  }

  return null
}