"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, TrendingUp, DollarSign, Plus, Settings, UserPlus, BarChart3, Megaphone } from "lucide-react"
import { ClubOverview } from "./club-overview"
import { EventManagement } from "./event-management"
import { RecruitmentManagement } from "./recruitment-management"
import { ContentManagement } from "./content-management"
import { ClubSettings } from "./club-settings"
import { ClubAnalytics } from "./club-analytics"

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

export function ClubDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const quickActionsRef = useRef<HTMLDivElement>(null)

  const handleQuickAction = () => {
    setActiveTab("overview")
    setTimeout(() => {
      quickActionsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100) 
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated Particles & Glitters Background */}
      <ParticleGlitterBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up transition-all duration-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ISTE-MIT Manipal</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Building the next generation of developers</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 animate-pulse">
                Active
              </Badge>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-transform duration-200 hover:scale-105 shadow-lg" onClick={handleQuickAction}>
                <Plus className="w-4 h-4 mr-2" />
                Quick Action
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="admin-stat-card admin-stat-card-blue animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Members</p>
                <p className="text-3xl font-bold">140</p>
              </div>
              <Users className="w-8 h-8 text-white/90" />
            </div>
          </div>
          <div className="admin-stat-card admin-stat-card-purple animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Active Events</p>
                <p className="text-3xl font-bold">7</p>
              </div>
              <Calendar className="w-8 h-8 text-white/90" />
            </div>
          </div>
          <div className="admin-stat-card admin-stat-card-green animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Engagement Rate</p>
                <p className="text-3xl font-bold">87%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white/90" />
            </div>
          </div>
          <div className="admin-stat-card admin-stat-card-orange animate-scale-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Budget Used</p>
                <p className="text-3xl font-bold">₹30K</p>
              </div>
              <DollarSign className="w-8 h-8 text-white/90" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 animate-fade-in-up delay-500">
          <TabsList className="grid w-full grid-cols-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-md transition-all duration-300 club-card-glow">
            <TabsTrigger value="overview" className="flex items-center space-x-2 transition-colors duration-200 hover:bg-green-100/40 dark:hover:bg-green-900/20 club-card-glow">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2 transition-colors duration-200 hover:bg-blue-100/40 dark:hover:bg-blue-900/20 club-card-glow">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="recruitment" className="flex items-center space-x-2 transition-colors duration-200 hover:bg-purple-100/40 dark:hover:bg-purple-900/20 club-card-glow">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Recruitment</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center space-x-2 transition-colors duration-200 hover:bg-pink-100/40 dark:hover:bg-pink-900/20 club-card-glow">
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 transition-colors duration-200 hover:bg-yellow-100/40 dark:hover:bg-yellow-900/20 club-card-glow">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2 transition-colors duration-200 hover:bg-gray-100/40 dark:hover:bg-gray-900/20 club-card-glow">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="animate-fade-in-up delay-600">
              <ClubOverview
                onNavigate={view => {
                  if (view === 'analytics') setActiveTab('analytics')
                }}
                quickActionsRef={quickActionsRef as React.RefObject<HTMLDivElement>}
              />
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="animate-fade-in-up delay-700">
              <EventManagement />
            </div>
          </TabsContent>

          <TabsContent value="recruitment">
            <div className="animate-fade-in-up delay-800">
              <RecruitmentManagement />
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="animate-fade-in-up delay-900">
              <ContentManagement />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="animate-fade-in-up delay-1000">
              <ClubAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="animate-fade-in-up delay-1100">
              <ClubSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
