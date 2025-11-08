"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  ArrowRight,
  Activity,
  Zap,
  Target,
  Award,
  Clock,
  Star,
} from "lucide-react"

export function AdminOverview({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const recentActivities = [
    {
      id: 1,
      type: "approval",
      title: "TechTatva 2025 approved",
      club: "ISTE MIT",
      time: "2 hours ago",
      status: "approved",
      priority: "high",
    },
    {
      id: 2,
      type: "budget",
      title: "Budget request submitted",
      club: "Chord n Co. Club",
      time: "4 hours ago",
      status: "pending",
      priority: "medium",
    },
    {
      id: 3,
      type: "conflict",
      title: "Venue conflict detected",
      club: "Robotics Club",
      time: "6 hours ago",
      status: "warning",
      priority: "high",
    },
    {
      id: 4,
      type: "registration",
      title: "New club registered",
      club: "Photography Club",
      time: "1 day ago",
      status: "success",
      priority: "low",
    },
  ]

  const topPerformingClubs = [
    {
      id: 1,
      name: "ISTE MIT Manipal",
      events: 17,
      members: 140,
      rating: 4.8,
      budget: 85000,
      growth: 15,
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Chord n Co. MIT",
      events: 9,
      members: 68,
      rating: 4.9,
      budget: 45000,
      growth: 12,
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Rotaract Club",
      events: 6,
      members: 101,
      rating: 4.7,
      budget: 65000,
      growth: 8,
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]

  const systemHealth = {
    uptime: 99.9,
    activeUsers: 425,
    responseTime: 120,
    errorRate: 0.1,
    performance: 95,
    security: 98,
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "budget":
        return <DollarSign className="w-5 h-5 text-blue-500" />
      case "conflict":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "registration":
        return <Users className="w-5 h-5 text-purple-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "admin-badge-danger"
      case "medium":
        return "admin-badge-warning"
      case "low":
        return "admin-badge-success"
      default:
        return "admin-badge-info"
    }
  }

  return (
    <div className="admin-section-spacing">
      {/* Key Metrics Row with Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="admin-metric-card p-6 animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl">
              <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <Badge className="admin-badge-success">+12%</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Events</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">32</p>
            <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>12% this month</span>
            </div>
          </div>
        </div>

        <div className="admin-metric-card p-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <Badge className="admin-badge-success">+8%</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active Students</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">425</p>
            <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>8% this month</span>
            </div>
          </div>
        </div>

        <div className="admin-metric-card p-6 animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <Badge className="admin-badge-warning">-3%</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Budget Utilization</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">67%</p>
            <div className="flex items-center text-sm text-red-600 dark:text-red-400">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span>3% this month</span>
            </div>
          </div>
        </div>

        <div className="admin-metric-card p-6 animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl">
              <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <Badge className="admin-badge-success">Excellent</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">System Health</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{systemHealth.uptime}%</p>
            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Activities */}
        <div className="lg:col-span-2 admin-content-spacing">
          <div className="admin-card animate-slide-in-left">
            <CardHeader className="admin-card-header">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <span>Recent Activities</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest system activities and updates</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="admin-button-secondary"
                  onClick={() => onNavigate && onNavigate('activities')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 admin-hover-lift"
                    style={{ animationDelay: `${index * 0.1}s` }}
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

          {/* Enhanced Budget Overview */}
          <div className="admin-card animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="admin-card-header">
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>Budget Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹25L</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Allocated</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">₹16.8L</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Spent</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹3.2L</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pending</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹5L</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Remaining</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-700 dark:text-gray-300">Budget Utilization</span>
                  <span className="text-blue-600 dark:text-blue-400">67%</span>
                </div>
                <div className="admin-progress">
                  <div className="admin-progress-bar" style={{ width: "67%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>₹0</span>
                  <span>₹25L</span>
                </div>
              </div>
            </CardContent>
          </div>
        </div>

        {/* Right Column */}
        <div className="admin-content-spacing">
          {/* Top Performing Clubs */}
          <div className="admin-card animate-slide-in-right">
            <CardHeader className="admin-card-header">
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-600" />
                <span>Top Performing Clubs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topPerformingClubs.map((club, index) => (
                  <div
                    key={club.id}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 admin-hover-lift"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <Avatar className="w-10 h-10 border-2 border-white dark:border-gray-700 shadow-md">
                      <AvatarImage src={club.logo || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold">
                        {club.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{club.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{club.events} events</span>
                        <span>•</span>
                        <span>{club.members} members</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span>{club.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ₹{(club.budget / 1000).toFixed(0)}K
                      </div>
                      <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>+{club.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>

          {/* Enhanced System Health */}
          <div className="admin-card animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="admin-card-header">
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-green-600" />
                <span>System Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{systemHealth.uptime}%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Uptime</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{systemHealth.activeUsers}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Active Users</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Performance</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {systemHealth.performance}%
                  </span>
                </div>
                <div className="admin-progress">
                  <div className="admin-progress-bar" style={{ width: `${systemHealth.performance}%` }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Security Score</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {systemHealth.security}%
                  </span>
                </div>
                <div className="admin-progress">
                  <div className="admin-progress-bar" style={{ width: `${systemHealth.security}%` }}></div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{systemHealth.responseTime}ms</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600 dark:text-gray-400">Error Rate</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{systemHealth.errorRate}%</span>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  )
}
