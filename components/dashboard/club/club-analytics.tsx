"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Download,
  FileText,
  Receipt,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react"
import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf"

export function ClubAnalytics() {
  const membershipGrowth = [
    { month: "Jan", members: 32 },
    { month: "Feb", members: 34 },
    { month: "Mar", members: 65 },
    { month: "Apr", members: 79 },
    { month: "May", members: 124 },
    { month: "Jun", members: 140 },
  ]

  const eventMetrics = [
    { name: "TechTatva 2025", attendance: 234, satisfaction: 4.8, budget: 50000 },
    { name: "AI/ML Workshop", attendance: 89, satisfaction: 4.9, budget: 15000 },
    { name: "Flutter Bootcamp", attendance: 67, satisfaction: 4.7, budget: 12000 },
  ]

  const [metrics, setMetrics] = useState({
    members: 0,
    attendance: 0,
    budget: 0,
    satisfaction: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    const targets = { members: 140, attendance: 87, budget: 92, satisfaction: 4.8 }
    const interval = setInterval(() => {
      setMetrics(prev => ({
        members: Math.min(prev.members + 10, targets.members),
        attendance: Math.min(prev.attendance + 2, targets.attendance),
        budget: Math.min(prev.budget + 2, targets.budget),
        satisfaction: Math.min(Number((prev.satisfaction + 0.2).toFixed(1)), targets.satisfaction),
      }))
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const handleExport = (type: "pdf" | "invoice" | "csv") => {
    if (type === "csv") {
      const csv = [
        ["Metric", "Value"],
        ["Total Members", metrics.members],
        ["Event Attendance", metrics.attendance + "%"],
        ["Budget Efficiency", metrics.budget + "%"],
        ["Satisfaction Score", metrics.satisfaction],
      ].map(row => row.join(",")).join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      if (typeof window !== 'undefined') {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "club-analytics.csv"
        a.click()
        window.URL.revokeObjectURL(url)
      }
      toast({ title: "Exported as CSV", description: "Analytics exported as CSV file." })
    } else if (type === "pdf" || type === "invoice") {
      const doc = new jsPDF()
      if (type === "invoice") {
        doc.setFontSize(22)
        doc.text("INVOICE", 20, 20)
        doc.setFontSize(14)
        doc.text(`Total Members: ${metrics.members}`, 20, 40)
        doc.text(`Event Attendance: ${metrics.attendance}%`, 20, 50)
        doc.text(`Budget Efficiency: ${metrics.budget}%`, 20, 60)
        doc.text(`Satisfaction Score: ${metrics.satisfaction}`, 20, 70)
        doc.text("Thank you for your association!", 20, 90)
      } else {
        doc.setFontSize(18)
        doc.text("Club Analytics Report", 20, 20)
        doc.setFontSize(14)
        doc.text(`Total Members: ${metrics.members}`, 20, 40)
        doc.text(`Event Attendance: ${metrics.attendance}%`, 20, 50)
        doc.text(`Budget Efficiency: ${metrics.budget}%`, 20, 60)
        doc.text(`Satisfaction Score: ${metrics.satisfaction}`, 20, 70)
      }
      doc.save(type === "invoice" ? "club-invoice.pdf" : "club-analytics.pdf")
      toast({ title: `Exported as ${type === "invoice" ? "Invoice" : "PDF"}`, description: `Analytics exported as ${type === "invoice" ? "invoice" : "PDF"}.` })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="admin-card admin-glass-strong p-0 animate-fade-in-up relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/40 via-blue-100/30 to-purple-100/20 dark:from-gray-900/60 dark:via-gray-800/50 dark:to-blue-900/30 pointer-events-none z-0" />
        <div className="relative z-10 flex items-center justify-between px-8 pt-8 pb-4">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-600 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg animate-fade-in-up">
            Analytics Dashboard
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="admin-button-secondary flex items-center gap-2">
                <Download className="w-4 h-4 mr-1" />
                Export Report
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("pdf")}> <FileText className="w-4 h-4 mr-2" /> Export as PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("invoice")}> <Receipt className="w-4 h-4 mr-2" /> Export as Invoice</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}> <FileSpreadsheet className="w-4 h-4 mr-2" /> Export as CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up delay-100">
        <div className="admin-stat-card admin-stat-card-blue animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Members</p>
              <p className="text-3xl font-bold">{metrics.members}</p>
            </div>
            <Users className="w-8 h-8 text-white/90" />
          </div>
        </div>
        <div className="admin-stat-card admin-stat-card-green animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Event Attendance</p>
              <p className="text-3xl font-bold">{metrics.attendance}%</p>
            </div>
            <Calendar className="w-8 h-8 text-white/90" />
          </div>
        </div>
        <div className="admin-stat-card admin-stat-card-orange animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Budget Efficiency</p>
              <p className="text-3xl font-bold">{metrics.budget}%</p>
            </div>
            <DollarSign className="w-8 h-8 text-white/90" />
          </div>
        </div>
        <div className="admin-stat-card admin-stat-card-purple animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Satisfaction Score</p>
              <p className="text-3xl font-bold">{metrics.satisfaction}</p>
            </div>
            <Heart className="w-8 h-8 text-white/90" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 animate-fade-in-up delay-200">
        <TabsList className="admin-tabs-list grid w-full grid-cols-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-md rounded-2xl overflow-hidden">
          <TabsTrigger value="overview" className="transition-colors duration-200 hover:bg-green-100/40 dark:hover:bg-green-900/20 club-card-glow">Overview</TabsTrigger>
          <TabsTrigger value="members" className="transition-colors duration-200 hover:bg-blue-100/40 dark:hover:bg-blue-900/20 club-card-glow">Members</TabsTrigger>
          <TabsTrigger value="events" className="transition-colors duration-200 hover:bg-purple-100/40 dark:hover:bg-purple-900/20 club-card-glow">Events</TabsTrigger>
          <TabsTrigger value="engagement" className="transition-colors duration-200 hover:bg-yellow-100/40 dark:hover:bg-yellow-900/20 club-card-glow">Engagement</TabsTrigger>
          <TabsTrigger value="financial" className="transition-colors duration-200 hover:bg-orange-100/40 dark:hover:bg-orange-900/20 club-card-glow">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Membership Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {membershipGrowth.map((data, index) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${(data.members / 500) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{data.members}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Event Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {eventMetrics.map((event) => (
                  <div key={event.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{event.name}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Attendance</p>
                        <p className="font-semibold">{event.attendance}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rating</p>
                        <p className="font-semibold">{event.satisfaction}/5</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Budget</p>
                        <p className="font-semibold">₹{event.budget.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Member Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Computer Science</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Information Technology</span>
                    <span>25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Electronics</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Other</span>
                    <span>10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Year Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">45</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">1st Year (32.1%)</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">35</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">2nd Year (25%)</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">35</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">3rd Year (25%)</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">25</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">4th Year (17.9%)</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Member Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Highly Active</span>
                  <Badge className="bg-green-100 text-green-800">100 members</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Moderately Active</span>
                  <Badge className="bg-yellow-100 text-yellow-800">25 members</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Low Activity</span>
                  <Badge className="bg-red-100 text-red-800">15 members</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Event Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
                  <div className="text-xs text-green-600 mt-1">+3 this quarter</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Attendance</div>
                  <div className="text-xs text-green-600 mt-1">+5% improvement</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
                  <div className="text-xs text-green-600 mt-1">+0.3 improvement</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Social Media Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <span>Total Views</span>
                  </div>
                  <span className="font-semibold">2.4K</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Total Likes</span>
                  </div>
                  <span className="font-semibold">890</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    <span>Comments</span>
                  </div>
                  <span className="font-semibold">348</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Share2 className="w-5 h-5 text-purple-500" />
                    <span>Shares</span>
                  </div>
                  <span className="font-semibold">234</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">8.7%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average Engagement Rate</div>
                  <div className="text-xs text-green-600 mt-1">Above industry average (6.2%)</div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Posts</span>
                      <span>9.2%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Stories</span>
                      <span>7.8%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Events</span>
                      <span>12.1%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Total Allocated</span>
                    <span>₹1,00,000</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Used</span>
                    <span>₹68,000 (68%)</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Remaining</span>
                    <span>₹32,000 (32%)</span>
                  </div>
                  <Progress value={32} className="h-2 bg-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Events</span>
                  <div className="text-right">
                    <div className="font-semibold">₹45,000</div>
                    <div className="text-xs text-gray-500">66%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Marketing</span>
                  <div className="text-right">
                    <div className="font-semibold">₹12,000</div>
                    <div className="text-xs text-gray-500">18%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Equipment</span>
                  <div className="text-right">
                    <div className="font-semibold">₹8,000</div>
                    <div className="text-xs text-gray-500">12%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Miscellaneous</span>
                  <div className="text-right">
                    <div className="font-semibold">₹3,000</div>
                    <div className="text-xs text-gray-500">4%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
