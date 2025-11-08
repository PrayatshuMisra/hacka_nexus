"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Star,
  Eye,
  Download,
  Filter,
  BarChart3,
  Award,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function ClubOversight() {
  const [clubs, setClubs] = useState([
    {
      id: 1,
      name: "ISTE MIT Manipal",
      logo: "/placeholder.svg?height=40&width=40",
      category: "Technical",
      members: 140,
      events: 17,
      rating: 4.8,
      engagement: 87,
      budget: 200000,
      spent: 135000,
      lastActivity: "2025-06-26",
      status: "active",
      growth: 15,
      satisfaction: 4.9,
    },
    {
      id: 2,
      name: "Chords n Co. MIT",
      logo: "/placeholder.svg?height=40&width=40",
      category: "Cultural",
      members: 68,
      events: 8,
      rating: 4.9,
      engagement: 92,
      budget: 150000,
      spent: 85000,
      lastActivity: "2025-06-28",
      status: "active",
      growth: 8,
      satisfaction: 4.8,
    },
    {
      id: 3,
      name: "Rotaract Club MIT",
      logo: "/placeholder.svg?height=40&width=40",
      category: "Service",
      members: 101,
      events: 9,
      rating: 4.7,
      engagement: 78,
      budget: 180000,
      spent: 120000,
      lastActivity: "2025-06-27",
      status: "active",
      growth: 12,
      satisfaction: 4.6,
    },
    {
      id: 4,
      name: "Photography Club",
      logo: "/placeholder.svg?height=40&width=40",
      category: "Creative",
      members: 85,
      events: 3,
      rating: 4.2,
      engagement: 45,
      budget: 50000,
      spent: 15000,
      lastActivity: "202-06-28",
      status: "inactive",
      growth: -5,
      satisfaction: 4.1,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || club.category === filterCategory
    const matchesStatus = filterStatus === "all" || club.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "status-approved"
      case "inactive":
        return "status-rejected"
      case "warning":
        return "status-pending"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPerformanceLevel = (rating: number) => {
    if (rating >= 4.5) return { level: "Excellent", color: "text-green-600" }
    if (rating >= 4.0) return { level: "Good", color: "text-blue-600" }
    if (rating >= 3.5) return { level: "Average", color: "text-orange-600" }
    return { level: "Needs Improvement", color: "text-red-600" }
  }

  const overallStats = {
    totalClubs: clubs.length,
    activeClubs: clubs.filter((c) => c.status === "active").length,
    totalMembers: clubs.reduce((sum, club) => sum + club.members, 0),
    totalEvents: clubs.reduce((sum, club) => sum + club.events, 0),
    avgRating: clubs.reduce((sum, club) => sum + club.rating, 0) / clubs.length,
    avgEngagement: clubs.reduce((sum, club) => sum + club.engagement, 0) / clubs.length,
  }

  const ClubDetailsDialog = ({ club }: { club: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="glass-button">
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl animate-fade-in-up">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-14 h-14">
              <AvatarImage src={club.logo || "/placeholder.svg"} />
              <AvatarFallback>{club.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-bold">{club.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{club.category}</Badge>
                <Badge className={getStatusColor(club.status)}>{club.status}</Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-xl font-bold text-blue-600">{club.members}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Members</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-xl font-bold text-green-600">{club.events}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <div className="text-xl font-bold text-yellow-600">{club.rating}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <div className="text-xl font-bold text-orange-600">{club.engagement}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Engagement</div>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">Last activity: {new Date(club.lastActivity).toLocaleDateString()}</div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent animate-slide-in-top">Club Oversight</h2>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="glass-button animate-fade-in-up" onClick={() => setActiveTab("analytics")}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-2">
        <Card className="admin-stat-card admin-stat-card-blue animate-scale-in glassy-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-white/90" />
              <Badge className="bg-white/20 text-white border-white/30">Total</Badge>
            </div>
            <p className="text-white/80 text-sm font-medium">Total Clubs</p>
            <p className="text-3xl font-bold text-white">{overallStats.totalClubs}</p>
          </CardContent>
        </Card>

        <Card className="admin-stat-card admin-stat-card-green animate-scale-in glassy-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-white/90" />
              <Badge className="bg-white/20 text-white border-white/30">Active</Badge>
            </div>
            <p className="text-white/80 text-sm font-medium">Active Clubs</p>
            <p className="text-3xl font-bold text-white">{overallStats.activeClubs}</p>
          </CardContent>
        </Card>

        <Card className="admin-stat-card admin-stat-card-purple animate-scale-in glassy-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-white/90" />
              <Badge className="bg-white/20 text-white border-white/30">Members</Badge>
            </div>
            <p className="text-white/80 text-sm font-medium">Total Members</p>
            <p className="text-3xl font-bold text-white">{overallStats.totalMembers.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="admin-stat-card animate-scale-in glassy-card" style={{ background: 'linear-gradient(135deg, #059669 90%, #10b981 100%)', boxShadow: '0 4px 32px 0 rgba(16,185,129,0.25)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-white/90" />
              <Badge className="bg-white/20 text-white border-white/30">Events</Badge>
            </div>
            <p className="text-white/80 text-sm font-medium">Total Events</p>
            <p className="text-3xl font-bold text-white">{overallStats.totalEvents}</p>
          </CardContent>
        </Card>

        <Card className="admin-stat-card admin-stat-card-yellow animate-scale-in glassy-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-white/90" />
              <Badge className="bg-white/20 text-white border-white/30">Avg</Badge>
            </div>
            <p className="text-white/80 text-sm font-medium">Avg Rating</p>
            <p className="text-3xl font-bold text-white">{overallStats.avgRating.toFixed(1)}</p>
          </CardContent>
        </Card>

        <Card className="admin-stat-card admin-stat-card-orange animate-scale-in glassy-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-white/90" />
              <Badge className="bg-white/20 text-white border-white/30">Engage</Badge>
            </div>
            <p className="text-white/80 text-sm font-medium">Avg Engagement</p>
            <p className="text-3xl font-bold text-white">{Math.round(overallStats.avgEngagement)}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <Card className="admin-glass-strong rounded-xl p-4 mb-6 animate-fade-in-up">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center bg-white/60 dark:bg-gray-900/60 rounded-lg px-3">
                  <Filter className="w-4 h-4 text-blue-500 mr-2" />
                  <Input
                    placeholder="Search clubs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="nexus-input border-0 bg-transparent shadow-none"
                  />
                </div>
                <div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="nexus-input w-full glassy-select"
                  >
                    <option value="all">All Categories</option>
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Service">Service</option>
                    <option value="Creative">Creative</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="nexus-input w-full glassy-select"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="warning">Warning</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clubs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClubs.map((club) => (
              <Card key={club.id} className="nexus-card glassy-card animate-fade-in-up hover:scale-[1.025] hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={club.logo || "/placeholder.svg"} />
                        <AvatarFallback>{club.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {club.name}
                          {club.rating >= 4.7 && <span className="ml-1 animate-pulse"><Award className="w-4 h-4 text-yellow-400" /></span>}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{club.category}</Badge>
                          <Badge className={getStatusColor(club.status)}>{club.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <ClubDetailsDialog club={club} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{club.members}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Members</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{club.events}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement Rate</span>
                        <span>{club.engagement}%</span>
                      </div>
                      <Progress value={club.engagement} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Budget Utilization</span>
                        <span>{Math.round((club.spent / club.budget) * 100)}%</span>
                      </div>
                      <Progress value={(club.spent / club.budget) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{club.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {club.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={club.growth > 0 ? "text-green-600" : "text-red-600"}>
                          {club.growth > 0 ? "+" : ""}
                          {club.growth}%
                        </span>
                      </div>
                      <span className="text-gray-500">Last: {new Date(club.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="nexus-card">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clubs.map((club) => {
                    const performance = getPerformanceLevel(club.rating)
                    return (
                      <div
                        key={club.id}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={club.logo || "/placeholder.svg"} />
                            <AvatarFallback>{club.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{club.name}</p>
                            <p className={`text-sm ${performance.color}`}>{performance.level}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold">{club.rating}</span>
                          </div>
                          <p className="text-sm text-gray-500">{club.engagement}% engagement</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader>
                <CardTitle>Club Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Healthy Clubs</span>
                    </div>
                    <span className="font-semibold">{clubs.filter((c) => c.rating >= 4.5).length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <span>Needs Attention</span>
                    </div>
                    <span className="font-semibold">
                      {clubs.filter((c) => c.rating >= 3.5 && c.rating < 4.5).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span>Critical</span>
                    </div>
                    <span className="font-semibold">{clubs.filter((c) => c.rating < 3.5).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Club Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clubs
                  .sort((a, b) => b.rating - a.rating)
                  .map((club, index) => (
                    <div
                      key={club.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : index === 2
                                ? "bg-orange-500"
                                : "bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={club.logo || "/placeholder.svg"} />
                        <AvatarFallback>{club.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{club.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{club.members} members</span>
                          <span>{club.events} events</span>
                          <span>{club.engagement}% engagement</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold">{club.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          {club.growth > 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          )}
                          <span className={club.growth > 0 ? "text-green-600" : "text-red-600"}>
                            {club.growth > 0 ? "+" : ""}
                            {club.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="nexus-card">
              <CardHeader>
                <CardTitle>Club Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  📈 Club growth chart would go here
                </div>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  🥧 Category distribution chart would go here
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="nexus-card">
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">87%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Engagement</div>
                  <div className="text-xs text-green-600 mt-1">+5% from last month</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">4.7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
                  <div className="text-xs text-green-600 mt-1">+0.2 from last month</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">92%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Clubs</div>
                  <div className="text-xs text-green-600 mt-1">Stable</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">15%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</div>
                  <div className="text-xs text-green-600 mt-1">+3% from last quarter</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
