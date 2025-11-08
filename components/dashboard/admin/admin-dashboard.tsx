"use client"

import { useState, useRef, useEffect } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Clock,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Settings,
  MessageSquare,
  BarChart3,
  Shield,
  FileText,
  Activity,
  Zap,
  Target,
  Award,
} from "lucide-react"
import { EventApprovals } from "./event-approvals"
import { BudgetManagement } from "./budget-management"
import { ClubOversight } from "./club-oversight"
import { ConflictChecker } from "./conflict-checker"
import { UserManagement } from "./user-management"
import { ReportsAnalytics } from "./reports-analytics"
import { CommunicationTools } from "./communication-tools"
import { AdminSettings } from "./admin-settings"
import { AdminOverview } from "./admin-overview"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
    if (!canvas) return
    canvas.width = width * dpr
    canvas.height = height * dpr
    if (canvas.style) {
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
    }
    ctx.scale(dpr, dpr)
    const colors = ['#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#fbbf24']
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 0.6 + 0.2,
      angle: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.5 + 0.5,
      glitter: Math.random() > 0.7,
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
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', opacity: 0.7 }}
      aria-hidden="true"
    />
  )
}

function AdminActivities() {
  const activities = [
    { id: 1, type: "approval", title: "TechTatva 2025 approved", club: "ISTE MIT", time: "2 hours ago", status: "approved", priority: "high" },
    { id: 2, type: "budget", title: "Budget request submitted", club: "Chords n Co.", time: "4 hours ago", status: "pending", priority: "medium" },
    { id: 3, type: "conflict", title: "Venue conflict detected", club: "Robotics Club", time: "6 hours ago", status: "warning", priority: "high" },
    { id: 4, type: "registration", title: "New club registered", club: "Photography Club", time: "1 day ago", status: "success", priority: "low" },

  ]
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "approval": return <CheckCircle className="w-5 h-5 text-green-500" />
      case "budget": return <DollarSign className="w-5 h-5 text-blue-500" />
      case "conflict": return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "registration": return <Users className="w-5 h-5 text-purple-500" />
      default: return <Activity className="w-5 h-5 text-gray-500" />
    }
  }
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "admin-badge-danger"
      case "medium": return "admin-badge-warning"
      case "low": return "admin-badge-success"
      default: return "admin-badge-info"
    }
  }
  return (
    <div className="admin-section-spacing">
      <div className="admin-card animate-fade-in-up">
        <CardHeader className="admin-card-header">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <span>All Activities & History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 admin-hover-lift"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <Badge className={getPriorityColor(activity.priority)}>{activity.priority}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.club} • {activity.time}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Badge
                    className={
                      activity.status === "approved" || activity.status === "success"
                        ? "admin-badge-success"
                        : activity.status === "pending"
                        ? "admin-badge-warning"
                        : activity.status === "warning"
                        ? "admin-badge-danger"
                        : "admin-badge-info"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </div>
  )
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const dashboardStats = {
    pendingApprovals: 8,
    totalClubs: 12,
    activeEvents: 20,
    totalBudget: 2500000,
    monthlySpending: 180000,
    conflictAlerts: 3,
    activeUsers: 369,
    systemHealth: 98.5,
  }

  const quickActions = [
    { icon: CheckCircle, label: "Approve Events", count: 5, color: "emerald", tab: "approvals" },
    { icon: AlertTriangle, label: "Resolve Conflicts", count: 3, color: "red", tab: "conflicts" },
    { icon: DollarSign, label: "Review Budgets", count: 7, color: "blue", tab: "budget" },
    { icon: MessageSquare, label: "Send Announcement", count: 0, color: "purple", tab: "communication" },
  ]

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated Particles & Glitters Background */}
      <ParticleGlitterBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 admin-section-spacing">
        {/* Enhanced Header with Glassmorphism */}
        <div className="admin-glass-strong rounded-2xl p-6 mb-8 animate-slide-in-top">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">MIT Manipal Club Management System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 dark:text-green-300 text-sm font-medium">System Online</span>
              </div>
              <Button className="admin-button-primary" onClick={() => setActiveTab('settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Quick Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
          <div className="admin-stat-card admin-stat-card-orange animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-white/90" />
                <Badge className="bg-white/20 text-white border-white/30">Urgent</Badge>
              </div>
              <p className="text-white/80 text-sm font-medium">Pending Approvals</p>
              <p className="text-3xl font-bold text-white">{dashboardStats.pendingApprovals}</p>
              <div className="flex items-center mt-2 text-white/80 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+2 today</span>
              </div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card-blue animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-white/90" />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
              </div>
              <p className="text-white/80 text-sm font-medium">Active Clubs</p>
              <p className="text-3xl font-bold text-white">{dashboardStats.totalClubs}</p>
              <div className="flex items-center mt-2 text-white/80 text-xs">
                <Activity className="w-3 h-3 mr-1" />
                <span>All active</span>
              </div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card-green animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-white/90" />
                <Badge className="bg-white/20 text-white border-white/30">Live</Badge>
              </div>
              <p className="text-white/80 text-sm font-medium">Active Events</p>
              <p className="text-3xl font-bold text-white">{dashboardStats.activeEvents}</p>
              <div className="flex items-center mt-2 text-white/80 text-xs">
                <Zap className="w-3 h-3 mr-1" />
                <span>5 this week</span>
              </div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card-purple animate-scale-in" style={{ animationDelay: "0.4s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-white/90" />
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              </div>
              <p className="text-white/80 text-sm font-medium">Total Budget</p>
              <p className="text-3xl font-bold text-white">₹{(dashboardStats.totalBudget / 100000).toFixed(1)}L</p>
              <div className="flex items-center mt-2 text-white/80 text-xs">
                <Target className="w-3 h-3 mr-1" />
                <span>67% utilized</span>
              </div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card-blue animate-scale-in" style={{ animationDelay: "0.5s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-white/90" />
                <Badge className="bg-white/20 text-white border-white/30">+8%</Badge>
              </div>
              <p className="text-white/80 text-sm font-medium">Monthly Spend</p>
              <p className="text-3xl font-bold text-white">₹{(dashboardStats.monthlySpending / 1000).toFixed(0)}K</p>
              <div className="flex items-center mt-2 text-white/80 text-xs">
                <Activity className="w-3 h-3 mr-1" />
                <span>On track</span>
              </div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card-red animate-scale-in" style={{ animationDelay: "0.6s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-8 h-8 text-white/90" />
                <Badge className="bg-white/20 text-white border-white/30">Alert</Badge>
              </div>
              <p className="text-white/80 text-sm font-medium">Conflicts</p>
              <p className="text-3xl font-bold text-white">{dashboardStats.conflictAlerts}</p>
              <div className="flex items-center mt-2 text-white/80 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                <span>Needs attention</span>
              </div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card-green animate-scale-in" style={{ animationDelay: "0.7s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-white/90" />
                <div className="admin-status-online w-2 h-2 bg-white/40 rounded-full"></div>
              </div>
              <p className="text-white/80 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold text-white">{dashboardStats.activeUsers.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-white/80 text-xs">
                <Activity className="w-3 h-3 mr-1" />
                <span>89% online</span>
              </div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card-yellow animate-scale-in" style={{ animationDelay: "0.8s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-white/90" />
                <Badge className="bg-white/20 text-white border-white/30">Excellent</Badge>
              </div>
              <p className="text-white/80 text-sm font-medium">System Health</p>
              <p className="text-3xl font-bold text-white">{dashboardStats.systemHealth}%</p>
              <div className="flex items-center mt-2 text-white/80 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>All systems go</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="admin-card mb-8 animate-slide-in-left bg-gradient-to-br from-white/60 via-blue-100/40 to-emerald-100/30 dark:from-gray-900/60 dark:via-blue-950/40 dark:to-emerald-950/30 admin-glass-strong border border-blue-200 dark:border-blue-900/40 shadow-2xl rounded-2xl">
          <div className="admin-card-header p-6 pb-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent flex items-center gap-2">
              <Zap className="w-6 h-6 animate-pulse text-blue-500 dark:text-emerald-400" />
              Quick Actions
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-base mt-1 font-medium">Instant access to your most important admin tasks</p>
          </div>
          <CardContent className="p-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <TooltipProvider>
                {quickActions.map((action, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className={`admin-hover-lift p-6 h-auto flex-col space-y-3 border-2 border-transparent bg-white/60 dark:bg-gray-900/60 shadow-lg rounded-xl transition-all duration-300 hover:scale-105 hover:border-${action.color}-400 focus-visible:ring-2 focus-visible:ring-${action.color}-400 group animate-fade-in-up`}
                        style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                        onClick={() => setActiveTab(action.tab)}
                      >
                        <div
                          className={`p-3 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-inner`}
                        >
                          <action.icon className={`w-7 h-7 text-${action.color}-600 dark:text-${action.color}-400 animate-bounce`} />
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">{action.label}</p>
                          {action.count > 0 && (
                            <Badge
                              className={`admin-badge-${action.color === "red" ? "danger" : action.color === "blue" ? "info" : action.color === "emerald" ? "success" : "warning"} mt-1 animate-scale-in`}
                            >
                              {action.count} pending
                            </Badge>
                          )}
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-sm font-medium">
                      {`Go to ${action.label}`}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </CardContent>
        </div>

        {/* Enhanced Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="admin-content-spacing">
          <div className="admin-glass rounded-xl p-2 mb-6">
            <TabsList className="admin-tabs-list w-full grid grid-cols-4 lg:grid-cols-10 gap-1">
              <TabsTrigger value="overview" className="admin-tabs-trigger flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="activities" className="admin-tabs-trigger flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Activities</span>
              </TabsTrigger>
              <TabsTrigger value="approvals" className="admin-tabs-trigger flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Approvals</span>
                {dashboardStats.pendingApprovals > 0 && <Badge className="admin-notification-dot"></Badge>}
              </TabsTrigger>
              <TabsTrigger value="budget" className="admin-tabs-trigger flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Budget</span>
              </TabsTrigger>
              <TabsTrigger value="clubs" className="admin-tabs-trigger flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Clubs</span>
              </TabsTrigger>
              <TabsTrigger value="conflicts" className="admin-tabs-trigger flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Conflicts</span>
                {dashboardStats.conflictAlerts > 0 && <Badge className="admin-notification-dot"></Badge>}
              </TabsTrigger>
              <TabsTrigger value="users" className="admin-tabs-trigger flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="admin-tabs-trigger flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="communication" className="admin-tabs-trigger flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Comms</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="admin-tabs-trigger flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="animate-fade-in">
            <AdminOverview onNavigate={view => {
              if (view === 'activities') setActiveTab('activities')
              else if (view === 'approvals') setActiveTab('approvals')
              else if (view === 'budget') setActiveTab('budget')
              else if (view === 'conflicts') setActiveTab('conflicts')
              else if (view === 'reports') setActiveTab('reports')
            }} />
          </TabsContent>

          <TabsContent value="activities" className="animate-fade-in">
            <AdminActivities />
          </TabsContent>

          <TabsContent value="approvals" className="animate-fade-in">
            <EventApprovals />
          </TabsContent>

          <TabsContent value="budget" className="animate-fade-in">
            <BudgetManagement />
          </TabsContent>

          <TabsContent value="clubs" className="animate-fade-in">
            <ClubOversight />
          </TabsContent>

          <TabsContent value="conflicts" className="animate-fade-in">
            <ConflictChecker />
          </TabsContent>

          <TabsContent value="users" className="animate-fade-in">
            <UserManagement />
          </TabsContent>

          <TabsContent value="reports" className="animate-fade-in">
            <ReportsAnalytics />
          </TabsContent>

          <TabsContent value="communication" className="animate-fade-in">
            <CommunicationTools />
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-in">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
