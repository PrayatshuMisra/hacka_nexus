"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Download, Calendar, Users, DollarSign, Star, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { jsPDF } from "jspdf"
import { saveAs } from "file-saver"

export function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReport, setSelectedReport] = useState("overview")
  const { toast } = useToast()

  const analyticsData = {
    overview: {
      totalEvents: 32,
      totalUsers: 284,
      budgetUtilization: 78,
      avgSatisfaction: 4.2,
      trends: {
        events: "+12%",
        users: "+8%",
        budget: "-5%",
        satisfaction: "+0.3"
      }
    },
    events: {
      byCategory: [
        { name: "Technical", count: 15, percentage: 46.875 },
        { name: "Cultural", count: 8, percentage: 25.0 },
        { name: "Sports", count: 3, percentage: 9.375 },
        { name: "Academic", count: 4, percentage: 12.5 },
        { name: "Social", count: 2, percentage: 6.25 }
      ],
      byMonth: [
        { month: "Aug", events: 6, attendance: 450 },
        { month: "Sep", events: 10, attendance: 680 },
        { month: "Oct", events: 4, attendance: 820 },
        { month: "Nov", events: 5, attendance: 750 },
        { month: "Dec", events: 3, attendance: 580 },
        { month: "Jan", events: 4, attendance: 780 }
      ]
    },
    clubs: {
      topPerforming: [
        { name: "ISTE MIT Manipal", events: 12, members: 140, rating: 4.8 },
        { name: "Chords n Co. Club MIT", events: 5, members: 89, rating: 4.6 },
        { name: "Robotics Club", events: 4, members: 101, rating: 4.5 },
        { name: "LDQ Club", events: 7, members: 45, rating: 4.4 },
        { name: "Photography Club", events: 4, members: 98, rating: 4.3 }
      ],
      membershipGrowth: [
        { month: "Aug", members: 1200 },
        { month: "Sep", members: 1450 },
        { month: "Oct", members: 1680 },
        { month: "Nov", members: 1890 },
        { month: "Dec", members: 2100 },
        { month: "Jan", members: 2350 }
      ]
    },
    budget: {
      allocation: [
        { category: "Events", allocated: 800000, spent: 620000, percentage: 77.5 },
        { category: "Equipment", allocated: 400000, spent: 280000, percentage: 70.0 },
        { category: "Marketing", allocated: 200000, spent: 150000, percentage: 75.0 },
        { category: "Miscellaneous", allocated: 100000, spent: 45000, percentage: 45.0 }
      ],
      monthlySpend: [
        { month: "Aug", amount: 120000 },
        { month: "Sep", amount: 180000 },
        { month: "Oct", amount: 220000 },
        { month: "Nov", amount: 190000 },
        { month: "Dec", amount: 150000 },
        { month: "Jan", amount: 200000 }
      ]
    }
  }

  function downloadPDF(title: string, filename: string, content: string) {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(title, 10, 15)
    doc.setFontSize(12)
    doc.text(content, 10, 30)
    doc.save(filename)
    toast({ title: "Download Started", description: `${filename} (PDF) is downloading.` })
  }

  function downloadCSV(filename: string, headers: string[], rows: string[][]) {
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, filename)
    toast({ title: "Download Started", description: `${filename} (CSV) is downloading.` })
  }

  function handleEventReport(type: string) {
    if (type === "event-summary") {
      downloadPDF(
        "Event Summary Report",
        `event-summary-${selectedPeriod}.pdf`,
        "This is a mock Event Summary report for the selected period."
      )
    } else if (type === "attendance") {
      downloadCSV(
        `attendance-report-${selectedPeriod}.csv`,
        ["Event", "Month", "Attendance"],
        analyticsData.events.byMonth.map(m => ["Sample Event", m.month, m.attendance.toString()])
      )
    } else if (type === "feedback") {
      downloadPDF(
        "Feedback Analysis Report",
        `feedback-analysis-${selectedPeriod}.pdf`,
        "This is a mock Feedback Analysis report for the selected period."
      )
    } else if (type === "events") {
      downloadPDF(
        "All Events Report",
        `all-events-${selectedPeriod}.pdf`,
        "This is a mock All Events report for the selected period."
      )
    }
  }

  function handleClubReport(type: string) {
    if (type === "club-performance") {
      downloadPDF(
        "Club Performance Report",
        `club-performance-${selectedPeriod}.pdf`,
        "This is a mock Club Performance report for the selected period."
      )
    } else if (type === "membership") {
      downloadCSV(
        `membership-analysis-${selectedPeriod}.csv`,
        ["Club", "Members"],
        analyticsData.clubs.topPerforming.map(c => [c.name, c.members.toString()])
      )
    } else if (type === "engagement") {
      downloadPDF(
        "Engagement Metrics Report",
        `engagement-metrics-${selectedPeriod}.pdf`,
        "This is a mock Engagement Metrics report for the selected period."
      )
    } else if (type === "clubs") {
      downloadPDF(
        "All Clubs Report",
        `all-clubs-${selectedPeriod}.pdf`,
        "This is a mock All Clubs report for the selected period."
      )
    }
  }

  function handleFinancialReport(type: string) {
    if (type === "budget-summary") {
      downloadPDF(
        "Budget Summary Report",
        `budget-summary-${selectedPeriod}.pdf`,
        "This is a mock Budget Summary report for the selected period."
      )
    } else if (type === "expense-breakdown") {
      downloadCSV(
        `expense-breakdown-${selectedPeriod}.csv`,
        ["Category", "Allocated", "Spent", "% Utilized"],
        analyticsData.budget.allocation.map(b => [b.category, b.allocated.toString(), b.spent.toString(), b.percentage.toString()])
      )
    } else if (type === "financial-forecast") {
      downloadPDF(
        "Financial Forecast Report",
        `financial-forecast-${selectedPeriod}.pdf`,
        "This is a mock Financial Forecast report for the selected period."
      )
    } else if (type === "budget") {
      downloadPDF(
        "All Financials Report",
        `all-financials-${selectedPeriod}.pdf`,
        "This is a mock All Financials report for the selected period."
      )
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated/gradient background for visual depth */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100/60 via-emerald-100/40 to-purple-100/30 dark:from-gray-900/60 dark:via-blue-950/40 dark:to-emerald-950/30 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Controls */}
        <Card className="admin-glass-strong rounded-2xl p-6 mb-8 animate-slide-in-top shadow-2xl border border-blue-200 dark:border-blue-900/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2 text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent animate-fade-in-up">
                  <BarChart3 className="w-7 h-7 animate-pulse text-blue-500 dark:text-emerald-400" />
                  <span>Reports & Analytics</span>
                </CardTitle>
                <CardDescription className="text-base text-gray-800 dark:text-gray-200 font-medium mt-2">Comprehensive insights into club activities and performance</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-36 glassy-select bg-white/60 dark:bg-gray-900/60 border-0 shadow-md text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="admin-stat-card admin-stat-card-orange animate-scale-in glassy-card" style={{ animationDelay: "0.1s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-white/90" />
                <Badge className="bg-white/20 text-white border-white/30">Events</Badge>
              </div>
              <p className="text-white/80 text-sm font-medium">Total Events</p>
              <p className="text-3xl font-bold text-white">{analyticsData.overview.totalEvents}</p>
              <div className="flex items-center mt-2 text-white/80 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>{analyticsData.overview.trends.events}</span>
              </div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card-blue animate-scale-in glassy-card" style={{ animationDelay: "0.2s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-white/90" />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
              </div>
              <p className="text-white/80 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-white">{analyticsData.overview.totalUsers.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-white/80 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>{analyticsData.overview.trends.users}</span>
              </div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card-purple animate-scale-in glassy-card" style={{ animationDelay: "0.3s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-white/90" />
                <Badge className="bg-white/20 text-white border-white/30">Budget</Badge>
              </div>
              <p className="text-white/80 text-sm font-medium">Budget Utilization</p>
              <p className="text-3xl font-bold text-white">{analyticsData.overview.budgetUtilization}%</p>
              <div className="flex items-center mt-2 text-white/80 text-xs">
                <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                <span>{analyticsData.overview.trends.budget}</span>
              </div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card-yellow animate-scale-in glassy-card" style={{ animationDelay: "0.4s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8 text-white/90" />
                <Badge className="bg-white/20 text-white border-white/30">Satisfaction</Badge>
              </div>
              <p className="text-white/80 text-sm font-medium">Avg Satisfaction</p>
              <p className="text-3xl font-bold text-white">{analyticsData.overview.avgSatisfaction}/5</p>
              <div className="flex items-center mt-2 text-white/80 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>{analyticsData.overview.trends.satisfaction}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Tabs */}
        <Tabs value={selectedReport} onValueChange={setSelectedReport} className="admin-content-spacing">
          <div className="admin-glass rounded-xl p-2 mb-6">
            <TabsList className="admin-tabs-list w-full grid grid-cols-4 gap-1">
              <TabsTrigger value="overview" className="admin-tabs-trigger flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="admin-tabs-trigger flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Events</span>
              </TabsTrigger>
              <TabsTrigger value="clubs" className="admin-tabs-trigger flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Clubs</span>
              </TabsTrigger>
              <TabsTrigger value="budget" className="admin-tabs-trigger flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Budget</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content: Overview */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glassy-card animate-fade-in-up">
                <CardHeader>
                  <CardTitle>Event Categories Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.events.byCategory.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 animate-pulse" />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-800 dark:text-gray-200">{category.count}</span>
                          <Badge variant="secondary">{category.percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glassy-card animate-fade-in-up">
                <CardHeader>
                  <CardTitle>Top Performing Clubs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.clubs.topPerforming.slice(0, 5).map((club, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-500" : "bg-blue-400"} animate-bounce`}>
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{club.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{club.events} events</Badge>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className="text-xs text-gray-800 dark:text-gray-200">{club.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glassy-card animate-fade-in-up">
              <CardHeader>
                <CardTitle>Monthly Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-6 gap-4">
                    {analyticsData.events.byMonth.map((month, index) => (
                      <div key={index} className="text-center">
                        <div className="bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900 dark:to-emerald-900 rounded-lg p-3 mb-2 animate-fade-in-up">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{month.events}</div>
                          <div className="text-xs text-gray-800 dark:text-gray-200">Events</div>
                        </div>
                        <div className="text-sm font-medium">{month.month}</div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">{month.attendance} attendees</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Content: Events */}
          <TabsContent value="events" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glassy-card animate-fade-in-up">
                <CardHeader>
                  <CardTitle>Event Categories</CardTitle>
                  <CardDescription>Distribution of events by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.events.byCategory.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-gray-800 dark:text-gray-200">{category.count} events</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-400 to-emerald-400 h-2 rounded-full animate-pulse" style={{ width: `${category.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glassy-card animate-fade-in-up">
                <CardHeader>
                  <CardTitle>Monthly Event Trends</CardTitle>
                  <CardDescription>Events and attendance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.events.byMonth.map((month, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900 dark:to-emerald-900 animate-fade-in-up"
                      >
                        <div>
                          <p className="font-medium">{month.month}</p>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{month.events} events</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{month.attendance}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">attendees</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glassy-card animate-fade-in-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Event Reports</CardTitle>
                  <Button onClick={() => handleEventReport("event-summary")} className="glass-button">
                    <FileText className="w-4 h-4 mr-2" />
                    Event Summary
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" onClick={() => handleEventReport("attendance")} className="glass-button">
                    <Download className="w-4 h-4 mr-2" />
                    Attendance Report
                  </Button>
                  <Button variant="outline" onClick={() => handleEventReport("feedback")} className="glass-button">
                    <Download className="w-4 h-4 mr-2" />
                    Feedback Analysis
                  </Button>
                  <Button variant="outline" onClick={() => handleEventReport("events")} className="glass-button">
                    <Download className="w-4 h-4 mr-2" />
                    All Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Content: Clubs */}
          <TabsContent value="clubs" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up">
              <CardHeader>
                <CardTitle>Club Performance Leaderboard</CardTitle>
                <CardDescription>Ranked by events, members, and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.clubs.topPerforming.map((club, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900 dark:to-emerald-900 animate-fade-in-up">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-500" : "bg-blue-400"} animate-bounce`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{club.name}</p>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{club.members} members</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">{club.events} events</Badge>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-medium text-gray-800 dark:text-gray-200">{club.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glassy-card animate-fade-in-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Club Reports</CardTitle>
                  <Button onClick={() => handleClubReport("club-performance")} className="glass-button">
                    <FileText className="w-4 h-4 mr-2" />
                    Performance Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" onClick={() => handleClubReport("membership")} className="glass-button">
                    <Download className="w-4 h-4 mr-2" />
                    Membership Analysis
                  </Button>
                  <Button variant="outline" onClick={() => handleClubReport("engagement")} className="glass-button">
                    <Download className="w-4 h-4 mr-2" />
                    Engagement Metrics
                  </Button>
                  <Button variant="outline" onClick={() => handleClubReport("clubs")} className="glass-button">
                    <Download className="w-4 h-4 mr-2" />
                    All Clubs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Content: Budget */}
          <TabsContent value="budget" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up">
              <CardHeader>
                <CardTitle>Budget Allocation & Utilization</CardTitle>
                <CardDescription>Track spending across different categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.budget.allocation.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.category}</span>
                        <div className="text-right">
                          <p className="text-sm">
                            ₹{(item.spent / 1000).toFixed(0)}K / ₹{(item.allocated / 1000).toFixed(0)}K
                          </p>
                          <p className="text-xs text-gray-800 dark:text-gray-200">{item.percentage}% utilized</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            item.percentage > 80 ? "bg-red-500" : item.percentage > 60 ? "bg-yellow-500" : "bg-green-500"
                          } animate-pulse`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glassy-card animate-fade-in-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Financial Reports</CardTitle>
                  <Button onClick={() => handleFinancialReport("budget-summary")} className="glass-button">
                    <FileText className="w-4 h-4 mr-2" />
                    Budget Summary
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" onClick={() => handleFinancialReport("expense-breakdown")} className="glass-button">
                    <Download className="w-4 h-4 mr-2" />
                    Expense Breakdown
                  </Button>
                  <Button variant="outline" onClick={() => handleFinancialReport("financial-forecast")} className="glass-button">
                    <Download className="w-4 h-4 mr-2" />
                    Financial Forecast
                  </Button>
                  <Button variant="outline" onClick={() => handleFinancialReport("budget")} className="glass-button">
                    <Download className="w-4 h-4 mr-2" />
                    All Financials
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
