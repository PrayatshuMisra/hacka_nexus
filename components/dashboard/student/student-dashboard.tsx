"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Sparkles, ArrowLeft, Trophy, Users, Bell, Clock, XCircle, Search } from "lucide-react"
import { ProfileSidebar } from "./profile-sidebar"
import { ClubFeed } from "./club-feed"
import { RecommendedClubs } from "./recommended-clubs"
import { UpcomingEvents } from "./upcoming-events"
import { ApplicationStatus } from "./application-status"
import { ClubLeaderboard } from "./club-leaderboard"
import CampusMap from "./campus-map"
import { QuizInterface } from "./quiz-interface"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { clubsAPI, usersAPI, applicationsAPI } from "@/lib/api"
import type { Club } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { NotificationFeed } from "./notification-feed"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase"

function ParticleGlitterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animationFrameId: number
    const dpr = window.devicePixelRatio || 1
    const width = window.innerWidth
    const height = window.innerHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.scale(dpr, dpr)

    const colors = ['#34d399', '#60a5fa', '#a78bfa', '#facc15', '#f472b6']
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 0.5 + 0.2,
      angle: Math.random() * Math.PI * 2,
      glitter: Math.random() > 0.7,
      alpha: Math.random() * 0.5 + 0.5,
    }))

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.glitter ? '#fff' : p.color
        ctx.shadowBlur = p.glitter ? 16 : 6
        ctx.fill()
        ctx.restore()

        p.x += Math.cos(p.angle) * p.speed
        p.y += Math.sin(p.angle) * p.speed * 0.7
        p.angle += (Math.random() - 0.5) * 0.01

        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10
 
        if (p.glitter && Math.random() > 0.95) p.alpha = Math.random() * 0.5 + 0.5
      }
      animationFrameId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
    />
  )
}

function JoinClubButton({ clubId, clubName }: { clubId: number, clubName: string }) {
  const [requested, setRequested] = useState(false)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const handleRequest = async () => {
    setLoading(true)
    let userId = null
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user-data')
      if (userData) {
        try {
          const parsed = JSON.parse(userData)
          userId = parsed.id
        } catch {}
      }
    }
    if (!userId) {
      toast({ title: 'Error', description: 'User not found', variant: 'destructive' })
      setLoading(false)
      return
    }

    const { error } = await supabase.from('club_applications').insert({
      club_id: clubId,
      user_id: userId,
      status: 'pending',
      applied_date: new Date().toISOString(),
    })
    if (error) {
      toast({ title: 'Error', description: 'Failed to send join request', variant: 'destructive' })
      setLoading(false)
      return
    }
    toast({
      title: 'Request Sent',
      description: 'Your request to join the club was sent to the club admins, they will get back to you soon.',
      variant: 'success',
    })
    setRequested(true)
    setLoading(false)
  }
  return (
    <Button
      className={`w-full font-semibold rounded-xl shadow-lg transition-all duration-300 active:scale-95 focus:ring-2 focus:ring-emerald-400 ${requested ? 'bg-gray-300 text-gray-600' : 'bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white'}`}
      onClick={handleRequest}
      disabled={requested || loading}
    >
      {requested ? 'Request Sent' : loading ? 'Requesting...' : 'Join Club'}
    </Button>
  )
}

export function StudentDashboard({ user }: { user: any }) {
  const [currentView, setCurrentView] = useState("dashboard");
  const [clubs, setClubs] = useState<Club[]>([])
  const [loadingClubs, setLoadingClubs] = useState(false)
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [profileTab] = useState<'profile'>('profile')
  const [notifPrefs, setNotifPrefs] = useState({ email: true, push: true, sms: false })
  const [userName, setUserName] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [clubsJoined, setClubsJoined] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [eventSearch, setEventSearch] = useState("");
  const [eventCategory, setEventCategory] = useState("All");
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const eventCategories = ["All", "Technical", "Cultural", "Service", "Workshops"];

  const allTags = Array.from(new Set(clubs.flatMap(club => club.tags || [])));
  const tagOptions = ["All", ...allTags];

  const filteredClubs = clubs.filter(club => {
    const matchesTag = selectedTag === "All" || (club.tags && club.tags.includes(selectedTag));
    const matchesSearch =
      club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.description.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const joinedClubIds = clubsJoined.map((c: any) => c.id)

  const handleNavigation = (view: string) => {
    setCurrentView(view);
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  }

  const handleProfileClick = () => setCurrentView("profile");

  useEffect(() => {
    if (currentView === "clubs") {
      setLoadingClubs(true)
      clubsAPI.getAll().then((data) => {
        setClubs(data)
        setLoadingClubs(false)
      })
    }
  }, [currentView])

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('🔍 Starting fetchProfile...')
      let userId = null
      let clubMembers: any[] = []
      
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user-data')
        console.log('📦 User data from localStorage:', userData)
        if (userData) {
          try {
            const parsed = JSON.parse(userData)
            userId = parsed.id
            console.log('🆔 User ID extracted:', userId)
            setUserName(parsed.fullName || parsed.full_name || 'Student')
            // Set user profile from localStorage data as fallback
            setUserProfile(parsed)
          } catch (error) {
            console.error('❌ Error parsing user data:', error)
            // Set default user data to prevent infinite loading
            setUserName('Student')
            setUserProfile({ id: 1, fullName: 'Student', role: 'student' })
            setIsDataLoaded(true)
            return
          }
        } else {
          // Set default user data if no localStorage data
          setUserName('Student')
          setUserProfile({ id: 1, fullName: 'Student', role: 'student' })
          setIsDataLoaded(true)
          return
        }
      }
      
      if (!userId) {
        console.error('❌ No user ID found, using default')
        setUserName('Student')
        setUserProfile({ id: 1, fullName: 'Student', role: 'student' })
        setIsDataLoaded(true)
        return
      }

      try {
        console.log('🔄 Fetching profile from database...')
        // Try to fetch updated profile from database
        const profile = await usersAPI.getProfile(userId)
        console.log('✅ Profile fetched:', profile)
        setUserProfile(profile)
      } catch (error) {
        console.error('❌ Error fetching profile:', error)
        // Keep the localStorage data if database fetch fails
      }

      try {
        console.log('🔄 Fetching achievements...')
        const { data: achData } = await supabase
          .from("achievements")
          .select("*")
          .eq("user_id", userId)
        console.log('✅ Achievements fetched:', achData)
        setAchievements(achData || [])
      } catch (error) {
        console.error('❌ Error fetching achievements:', error)
        setAchievements([])
      }

      try {
        console.log('🔄 Fetching club memberships...')
        const { data: clubMembersData } = await supabase
          .from("club_members")
          .select("club:clubs(*), joined_at")
          .eq("user_id", userId)
        clubMembers = clubMembersData || []
        console.log('✅ Club memberships fetched:', clubMembers)
        setClubsJoined(clubMembers.map((cm: any) => cm.club))
      } catch (error) {
        console.error('❌ Error fetching club memberships:', error)
        setClubsJoined([])
      }

      try {
        console.log('🔄 Fetching event history...')
        const { data: regData } = await supabase
          .from("registrations")
          .select("event:events(title,start_date), registration_date")
          .eq("user_id", userId)

        const eventHistory = (regData || []).map((r: any) => ({
          type: 'event',
          action: `Registered for ${r.event?.title}`,
          date: r.registration_date || r.event?.start_date,
        }))
        const clubHistory = clubMembers.map((cm: any) => ({
          type: 'club',
          action: `Joined ${cm.club?.name}`,
          date: cm.joined_at,
        }))
    
        const combinedHistory = [...eventHistory, ...clubHistory].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
        console.log('✅ History fetched:', combinedHistory)
        setHistory(combinedHistory)
      } catch (error) {
        console.error('❌ Error fetching history:', error)
        setHistory([])
      }
      
      console.log('✅ fetchProfile completed')
      setIsDataLoaded(true)
    }
    
    // Set a timeout to ensure dashboard loads even if data fetching takes too long
    const timeoutId = setTimeout(() => {
      console.log('⏰ Data loading timeout, showing dashboard anyway')
      setIsDataLoaded(true)
    }, 5000) // 5 second timeout
    
    fetchProfile()
    
    return () => clearTimeout(timeoutId)
  }, [])

  return (() => {
    if (currentView === "profile") {
      const user = userProfile || {}
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/40 via-blue-50/40 to-purple-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
          <div className="w-full max-w-4xl glass-card-gradient rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="flex md:flex-col gap-2 md:w-56 w-full justify-between md:justify-start bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 border-r border-gray-200 dark:border-gray-800">
              <Button variant='secondary' className="w-full justify-start text-lg" disabled>
                <Avatar className="w-6 h-6 mr-2"><AvatarImage src={user.profileImageUrl || "/placeholder.svg?height=100&width=100"} /><AvatarFallback>{user.fullName?.slice(0,2)}</AvatarFallback></Avatar> Profile
              </Button>
            </div>
            {/* Main Content: Show all sections in one scrollable view */}
            <div className="flex-1 min-w-0 p-8 space-y-10 overflow-y-auto max-h-[80vh]">
              {/* Profile Info */}
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="w-24 h-24 ring-4 ring-emerald-200 dark:ring-emerald-800 shadow-lg">
                    <AvatarImage src={user.profileImageUrl || "/placeholder.svg?height=100&width=100"} />
                    <AvatarFallback>{user.fullName?.slice(0,2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-3xl font-bold mb-1">{user.fullName}</h2>
                    <div className="text-gray-600 dark:text-gray-400 mb-1">{user.email}</div>
                    <div className="text-gray-500 dark:text-gray-500 text-sm">{user.department} • Year {user.yearOfStudy}</div>
                    <div className="text-xs text-gray-400 mt-1">Reg No: {user.registrationNumber}</div>
                  </div>
                </div>
              </div>
              {/* Achievements */}
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Achievements</h2>
                {achievements.length === 0 ? <div className="text-gray-400">No achievements yet.</div> : achievements.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-emerald-50 dark:from-yellow-900/20 dark:to-emerald-900/20 shadow">
                    <Trophy className='w-6 h-6 text-yellow-400' />
                    <div>
                      <div className="font-semibold">{a.title}</div>
                      <div className="text-xs text-gray-500">{a.description}</div>
                    </div>
                    <div className="ml-auto font-bold text-yellow-500">+{a.points} pts</div>
                  </div>
                ))}
              </div>
              {/* Clubs Joined */}
              <div className="space-y-3 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Clubs Joined</h2>
                {clubsJoined.length === 0 ? <div className="text-gray-400">No clubs joined yet.</div> : clubsJoined.map((c, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow">
                    <Users className="w-6 h-6 text-blue-500" />
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-gray-500">Member</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* History */}
              <div className="space-y-3 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">History</h2>
                {history.length === 0 ? <div className="text-gray-400">No history yet.</div> : history.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-900/20">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-medium">{h.action}</div>
                      <div className="text-xs text-gray-500">{h.date ? new Date(h.date).toLocaleDateString() : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (currentView === "map") {
      return (
        <div>
          <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b">
            <Button variant="ghost" onClick={handleBackToDashboard} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <CampusMap />
        </div>
      )
    }
    if (currentView === "quizzes") {
      return (
        <div>
          <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b">
            <Button variant="ghost" onClick={handleBackToDashboard} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <QuizInterface />
        </div>
      )
    }
    if (currentView === "events") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-blue-50/40 to-purple-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 relative overflow-x-hidden">
          {/* Animated SVG/gradient background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-pulse">
              <defs>
                <linearGradient id="eventsGradient" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#34d399" />
                  <stop offset="1" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
              <ellipse cx="400" cy="200" rx="380" ry="120" fill="url(#eventsGradient)" opacity="0.13" />
              <circle cx="700" cy="80" r="60" fill="#a5b4fc" opacity="0.10">
                <animate attributeName="cy" values="80;120;80" dur="6s" repeatCount="indefinite" />
              </circle>
              <circle cx="120" cy="60" r="40" fill="#6ee7b7" opacity="0.10">
                <animate attributeName="cy" values="60;100;60" dur="7s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          <div className="max-w-3xl mx-auto relative z-10">
            <Button variant="ghost" onClick={handleBackToDashboard} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            {/* Animated Banner/Header */}
            <div className="rounded-3xl shadow-2xl bg-gradient-to-r from-emerald-400/90 to-blue-500/90 dark:from-emerald-700/80 dark:to-blue-900/80 p-8 mb-8 flex items-center gap-6 relative overflow-hidden">
              <div className="flex-shrink-0">
                <Calendar className="w-14 h-14 text-white drop-shadow-xl animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Upcoming Events</h1>
                <p className="text-lg text-white/90 font-medium">Discover, register, and participate in the latest events happening on campus. Filter by category or search for your favorite events!</p>
              </div>
              <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
                <svg width="180" height="120" viewBox="0 0 180 120" fill="none"><ellipse cx="90" cy="60" rx="90" ry="60" fill="#fff" /></svg>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 mb-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search events..."
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-gray-700/50 border-gray-200/50 dark:border-gray-600/50"
                  />
                </div>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {eventCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-6">
              <UpcomingEvents />
            </div>
          </div>
        </div>
      )
    }
    if (currentView === "clubs") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-blue-50/40 to-purple-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 relative overflow-x-hidden">
          {/* Animated SVG/gradient background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-pulse">
              <defs>
                <linearGradient id="clubsGradient" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#34d399" />
                  <stop offset="1" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
              <ellipse cx="400" cy="200" rx="380" ry="120" fill="url(#clubsGradient)" opacity="0.13" />
              <circle cx="700" cy="80" r="60" fill="#a5b4fc" opacity="0.10">
                <animate attributeName="cy" values="80;120;80" dur="6s" repeatCount="indefinite" />
              </circle>
              <circle cx="120" cy="60" r="40" fill="#6ee7b7" opacity="0.10">
                <animate attributeName="cy" values="60;100;60" dur="7s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            <Button variant="ghost" onClick={handleBackToDashboard} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            {/* Animated Banner/Header */}
            <div className="rounded-3xl shadow-2xl bg-gradient-to-r from-emerald-400/90 to-blue-500/90 dark:from-emerald-700/80 dark:to-blue-900/80 p-8 mb-8 flex items-center gap-6 relative overflow-hidden">
              <div className="flex-shrink-0">
                <Users className="w-14 h-14 text-white drop-shadow-xl animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Join Clubs</h1>
                <p className="text-lg text-white/90 font-medium">Discover and join amazing clubs at MIT Manipal. Find your passion, develop skills, and make new friends!</p>
              </div>
              <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
                <svg width="180" height="120" viewBox="0 0 180 120" fill="none"><ellipse cx="90" cy="60" rx="90" ry="60" fill="#fff" /></svg>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 mb-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search clubs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-gray-700/50 border-gray-200/50 dark:border-gray-600/50"
                  />
                </div>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {tagOptions.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clubs Grid */}
            {loadingClubs ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading clubs...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <Card key={club.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold mb-1">{club.name}</h2>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {(Array.isArray(club.tags)
                              ? club.tags
                              : typeof club.tags === 'string'
                                ? (() => {
                                    try {
                                      const parsed = JSON.parse(club.tags as string)
                                      if (Array.isArray(parsed)) return parsed
                                      return (club.tags as string).split(',').map((t: string) => t.trim())
                                    } catch {
                                      return (club.tags as string).split(',').map((t: string) => t.trim())
                                    }
                                  })()
                              : []
                            ).map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 mb-1">{club.category}</div>
                          <div className="text-xs text-gray-500 mb-1">Faculty Advisor: {club.facultyAdvisor}</div>
                          <div className="text-xs text-gray-500 mb-1">Email: {club.email}</div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Members: {club.memberCount}</span>
                            <span>Events: {club.totalEvents}</span>
                            <span>⭐ {club.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{club.description}</p>
                      {joinedClubIds.includes(club.id) ? (
                        <Button className="w-full bg-gray-300 text-gray-600 font-semibold rounded-xl shadow-lg" disabled>
                          Already Joined
                        </Button>
                      ) : (
                        <JoinClubButton clubId={club.id} clubName={club.name} />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }
    if (currentView === "notifications") {
      return (
        <div>
          <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b">
            <Button variant="ghost" onClick={handleBackToDashboard} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <NotificationFeed />
        </div>
      )
    }

    return (
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen overflow-x-hidden">
        {/* Animated Particles & Glitters Background */}
        <ParticleGlitterBackground />
        <div className="relative z-10">
          {!isDataLoaded ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-emerald-800 dark:text-emerald-200 text-lg">Loading your dashboard...</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">This may take a few moments</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-screen">
              {/* Left Sidebar - Profile & Quick Actions */}
              <div className="lg:col-span-1 animate-slide-left space-y-8">
                <ProfileSidebar onNavigate={handleNavigation} />
                <RecommendedClubs />
              </div>
              {/* Main Content */}
              <div className="lg:col-span-2 flex flex-col min-h-screen" style={{height: '100%'}}>
                {/* Welcome Banner */}
                <Card className="student-welcome-banner border-0 shadow-2xl text-white overflow-hidden relative animate-slide-up rounded-3xl backdrop-blur-xl bg-white/30 dark:bg-gray-900/40 transition-transform duration-300 hover:scale-105 hover:-rotate-x-2 hover:rotate-y-2">
                  {/* Animated SVG background */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-pulse">
                      <defs>
                        <linearGradient id="waveGradient" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#34d399" />
                          <stop offset="1" stopColor="#60a5fa" />
                        </linearGradient>
                      </defs>
                      <path d="M0 120 Q 200 180 400 120 T 800 120 V200 H0Z" fill="url(#waveGradient)" opacity="0.3" />
                      <circle cx="700" cy="60" r="40" fill="#a5b4fc" opacity="0.18">
                        <animate attributeName="cy" values="60;90;60" dur="4s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="120" cy="40" r="30" fill="#6ee7b7" opacity="0.18">
                        <animate attributeName="cy" values="40;70;40" dur="5s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </div>
                  <CardContent className="p-8 relative z-10">
                    <h2 className="flex items-center mb-4 text-3xl font-bold">
                      <Sparkles className="w-8 h-8 mr-3 text-yellow-300 animate-pulse" />
                      {userName ? `Welcome back, ${userName}! 👋` : 'Welcome back, Student! 👋'}
                    </h2>
                    <p className="opacity-90 mb-2 text-lg leading-relaxed font-medium">
                    Discover amazing clubs and events happening around MIT Manipal campus. Your journey to connect, learn,
                    and grow starts here!
                    </p>
                    <p className="text-emerald-200 dark:text-emerald-300 italic mb-6 text-base font-semibold">
                      "Success is the sum of small efforts, repeated day in and day out."
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        onClick={() => handleNavigation("clubs")}
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Join New Club
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        onClick={() => handleNavigation("events")}
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        Browse Events
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* --- NEW: History section in main content --- */}
                <div className="space-y-8 animate-fade-in">
                  {/* Achievements */}
                  <div className="space-y-4 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-4">Achievements</h2>
                    {achievements.length === 0 ? <div className="text-gray-400">No achievements yet.</div> : achievements.map((a, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-emerald-50 dark:from-yellow-900/20 dark:to-emerald-900/20 shadow">
                        <Trophy className='w-6 h-6 text-yellow-400' />
                        <div>
                          <div className="font-semibold">{a.title}</div>
                          <div className="text-xs text-gray-500">{a.description}</div>
                        </div>
                        <div className="ml-auto font-bold text-yellow-500">+{a.points} pts</div>
                      </div>
                    ))}
                  </div>
                  {/* Clubs Joined */}
                  <div className="space-y-3 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-4">Clubs Joined</h2>
                    {clubsJoined.length === 0 ? <div className="text-gray-400">No clubs joined yet.</div> : clubsJoined.map((c, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow">
                        <Users className="w-6 h-6 text-blue-500" />
                        <div>
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-xs text-gray-500">Member</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* History */}
                  <div className="space-y-3 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-4">History</h2>
                    {history.length === 0 ? <div className="text-gray-400">No history yet.</div> : history.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-900/20">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <div>
                          <div className="font-medium">{h.action}</div>
                          <div className="text-xs text-gray-500">{h.date ? new Date(h.date).toLocaleDateString() : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Club Feed below the main sections, fill remaining vertical space */}
                <div className="animate-slide-up animate-stagger-2 mt-8 flex-1 flex flex-col min-h-0">
                  <div className="flex-1 flex flex-col min-h-0">
                    <ClubFeed />
                  </div>
                </div>
              </div>
              {/* Right Sidebar */}
              <div className="lg:col-span-1 space-y-8 animate-slide-right">
                <div className="animate-stagger-1">
                  <UpcomingEvents />
                </div>
                <div className="animate-stagger-2">
                  <ApplicationStatus />
                </div>
                <div className="animate-stagger-3">
                  <ClubLeaderboard topN={3} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  })()
}
