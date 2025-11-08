"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Bell, Moon, Sun, Settings, LogOut, User, BellRing, Clock, Trophy, Users, XCircle } from "lucide-react"
import { notificationsAPI } from "@/lib/api"
import type { Notification } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface HeaderProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  onLogout: () => void
  userRole: string
  currentUser?: {
    name: string
    email: string
    image: string
  } | null
  onProfileClick?: () => void
}

export function Header({ darkMode, onToggleDarkMode, onLogout, userRole, currentUser, onProfileClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [openAchievements, setOpenAchievements] = useState(false)
  const [openClubs, setOpenClubs] = useState(false)
  const [openNotifications, setOpenNotifications] = useState(false)
  const [openHistory, setOpenHistory] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [notifPrefs, setNotifPrefs] = useState({ email: true, push: true, sms: false })
  const { toast } = useToast()
  const [openProfile, setOpenProfile] = useState(false)
  const [profileTab, setProfileTab] = useState('achievements')

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const data = await notificationsAPI.getByUser(1) // Mock user ID
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.isRead).length)
    } catch (error) {
      console.error("Failed to load notifications:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
   
    console.log("Searching for:", searchQuery)
  }

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await notificationsAPI.markAsRead(notificationId)
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const achievements = [
    { title: "Rising Star", desc: "Participated in 10+ events", points: 100, icon: <Trophy className="w-6 h-6 text-yellow-400" /> },
    { title: "Club Leader", desc: "Joined 5 clubs", points: 50, icon: <Users className="w-6 h-6 text-emerald-500" /> },
  ]
  const clubs = [
    { name: "GDSC", role: "Member", joined: "2023-01-10" },
    { name: "IEEE", role: "Member", joined: "2023-02-15" },
  ]
  const history = [
    { action: "Joined GDSC", date: "2023-01-10" },
    { action: "Attended AI/ML Workshop", date: "2023-03-05" },
    { action: "Joined IEEE", date: "2023-02-15" },
  ]

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/title2.png" alt="NexusSync" className="h-14 w-auto mr-3" />
            <Badge variant="secondary" className="ml-2 text-xs capitalize">
              {userRole}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search clubs, events..."
                className="pl-10 w-64 bg-gray-50/50 dark:bg-gray-700/50 border-gray-200/50 dark:border-gray-600/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 student-dropdown-bg" align="end">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <Badge variant="secondary">{unreadCount} new</Badge>
                  </div>
                </div>
                <ScrollArea className="h-80">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <BellRing className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-l-4 ${
                            notification.isRead
                              ? "border-transparent"
                              : "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                notification.isRead ? "bg-gray-300" : "bg-emerald-500"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTimeAgo(notification.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* Dark Mode Toggle */}
            <Button variant="ghost" size="icon" onClick={onToggleDarkMode}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.image || "/placeholder.svg?height=32&width=32"} alt="User" />
                    <AvatarFallback>{currentUser?.name?.slice(0, 2).toUpperCase() || "JD"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser?.name || "John Doe"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser?.email || "john.doe@learner.manipal.edu"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-red-600 dark:text-red-400">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
