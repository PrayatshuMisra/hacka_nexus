"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StudentDashboard } from '@/components/dashboard/student/student-dashboard'
import { Header } from '@/components/dashboard/header'
import { useTheme } from 'next-themes'

export default function StudentDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<string>('dashboard')
  const { theme, setTheme } = useTheme()

  useEffect(() => {

    const userData = localStorage.getItem('user-data')
    const sessionToken = localStorage.getItem('session-token')

    if (!userData || !sessionToken) {
      router.push('/')
      return
    }

    try {
      const user = JSON.parse(userData)
      if (user.role !== 'student') {
        router.push('/')
        return
      }
      setUser(user)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/')
      return
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleToggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
 
    localStorage.removeItem('user-data')
    localStorage.removeItem('session-token')

    const { supabase } = require('@/lib/supabase')
    supabase.auth.signOut()

    router.push('/')
  }

  const handleProfileClick = () => {

    setCurrentView('profile')
  }

  const handleNavigation = (view: string) => {
    setCurrentView(view)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-800">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header
        darkMode={theme === 'dark'}
        onToggleDarkMode={handleToggleDarkMode}
        onLogout={handleLogout}
        userRole={user.role}
        currentUser={{
          name: user.fullName || user.full_name,
          email: user.email,
          image: user.profileImageUrl || user.profile_image_url
        }}
        onProfileClick={handleProfileClick}
      />
      <StudentDashboard 
        user={user} 
      />
    </div>
  )
} 