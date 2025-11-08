import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Bell, FileText, Megaphone, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function NotificationFeed() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchNotifications = async () => {
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
      if (!userId) return setLoading(false)
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      setNotifications(data || [])
      setLoading(false)
    }
    fetchNotifications()
  }, [])
  const typeMeta = {
    meeting: { icon: <Calendar className="w-7 h-7 text-emerald-500 drop-shadow-lg" />, badge: "Meeting", badgeClass: "bg-emerald-100 text-emerald-700" },
    recruitment: { icon: <Megaphone className="w-7 h-7 text-blue-500 drop-shadow-lg" />, badge: "Recruitment", badgeClass: "bg-blue-100 text-blue-700" },
    interview: { icon: <Users className="w-7 h-7 text-purple-500 drop-shadow-lg" />, badge: "Interview", badgeClass: "bg-purple-100 text-purple-700" },
    mom: { icon: <FileText className="w-7 h-7 text-yellow-500 drop-shadow-lg" />, badge: "MoM", badgeClass: "bg-yellow-100 text-yellow-700" },
    event: { icon: <Calendar className="w-7 h-7 text-blue-500 drop-shadow-lg" />, badge: "Event", badgeClass: "bg-blue-100 text-blue-700" },
    application: { icon: <FileText className="w-7 h-7 text-emerald-500 drop-shadow-lg" />, badge: "Application", badgeClass: "bg-emerald-100 text-emerald-700" },
    club: { icon: <Users className="w-7 h-7 text-blue-500 drop-shadow-lg" />, badge: "Club", badgeClass: "bg-blue-100 text-blue-700" },
  }
  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }
  function groupNotifications(notifications: any[]) {
    const today: any[] = []
    const earlier: any[] = []
    const now = new Date()
    notifications.forEach(n => {
      const nDate = new Date(n.created_at)
      if (
        nDate.getDate() === now.getDate() &&
        nDate.getMonth() === now.getMonth() &&
        nDate.getFullYear() === now.getFullYear()
      ) {
        today.push(n)
      } else {
        earlier.push(n)
      }
    })
    return { today, earlier }
  }
  const { today, earlier } = groupNotifications(notifications)
  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center py-8 px-2">
        <Card className="border-0 shadow-2xl max-w-2xl w-full mx-auto mt-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl relative z-10 rounded-3xl overflow-hidden">
          <CardContent className="space-y-8 pb-8 text-center">
            <p className="text-lg">Loading notifications...</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="relative min-h-screen flex items-center justify-center py-8 px-2">
      {/* Animated SVG/gradient background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-pulse">
          <defs>
            <linearGradient id="notifGradient" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          <ellipse cx="400" cy="200" rx="380" ry="120" fill="url(#notifGradient)" opacity="0.13" />
          <circle cx="700" cy="80" r="60" fill="#a5b4fc" opacity="0.10">
            <animate attributeName="cy" values="80;120;80" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="120" cy="60" r="40" fill="#6ee7b7" opacity="0.10">
            <animate attributeName="cy" values="60;100;60" dur="7s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <Card className="border-0 shadow-2xl max-w-2xl w-full mx-auto mt-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl relative z-10 rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            <Bell className="w-7 h-7 text-emerald-500 animate-bounce" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pb-8">
          {today.length > 0 && (
            <div>
              <div className="text-xs uppercase font-bold text-emerald-500 mb-2 tracking-widest">Today</div>
              <div className="space-y-4">
                {today.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-emerald-100 dark:border-emerald-900 shadow-lg transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl hover:bg-emerald-50/80 dark:hover:bg-emerald-900/30 cursor-pointer group"
                  >
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <span className="drop-shadow-xl group-hover:scale-110 transition-transform duration-200">
                        {typeMeta[n.type as keyof typeof typeMeta].icon}
                      </span>
                      <Badge className={`text-xs px-2 py-0.5 font-semibold shadow ${typeMeta[n.type as keyof typeof typeMeta].badgeClass} group-hover:scale-105 transition-transform duration-200`}>{typeMeta[n.type as keyof typeof typeMeta].badge}</Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg truncate text-emerald-900 dark:text-emerald-200 group-hover:text-emerald-700">{n.title}</span>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-1 group-hover:text-gray-900 dark:group-hover:text-white">{n.description}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 group-hover:text-emerald-600">
                        <span><Clock className="w-3 h-3 inline-block mr-1" />{formatTimeAgo(n.created_at)}</span>
                        <span>•</span>
                        <span>{n.club}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {earlier.length > 0 && (
            <div>
              <div className="text-xs uppercase font-bold text-blue-500 mb-2 mt-6 tracking-widest">Earlier</div>
              <div className="space-y-4">
                {earlier.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-blue-100 dark:border-blue-900 shadow-md transition-all duration-200 hover:scale-[1.015] hover:shadow-xl hover:bg-blue-50/80 dark:hover:bg-blue-900/30 cursor-pointer group"
                  >
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <span className="drop-shadow-xl group-hover:scale-110 transition-transform duration-200">
                        {typeMeta[n.type as keyof typeof typeMeta].icon}
                      </span>
                      <Badge className={`text-xs px-2 py-0.5 font-semibold shadow ${typeMeta[n.type as keyof typeof typeMeta].badgeClass} group-hover:scale-105 transition-transform duration-200`}>{typeMeta[n.type as keyof typeof typeMeta].badge}</Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg truncate text-blue-900 dark:text-blue-200 group-hover:text-blue-700">{n.title}</span>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-1 group-hover:text-gray-900 dark:group-hover:text-white">{n.description}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 group-hover:text-blue-600">
                        <span><Clock className="w-3 h-3 inline-block mr-1" />{formatTimeAgo(n.created_at)}</span>
                        <span>•</span>
                        <span>{n.club}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {today.length === 0 && earlier.length === 0 && (
            <div className="text-center text-gray-400 py-8">No notifications yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 