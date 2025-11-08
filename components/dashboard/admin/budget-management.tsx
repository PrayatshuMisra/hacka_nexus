"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DollarSign, TrendingUp, CheckCircle, XCircle, Clock, Eye, Download, PieChart, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { saveAs } from "file-saver"
import { jsPDF } from "jspdf"

function ClubBudgetDetailDialog({ club }: { club: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={club.logo || "/placeholder.svg"} />
              <AvatarFallback>{club.club.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{club.club}</h3>
              <p className="text-sm text-gray-600">{club.events} events this year</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Total Allocated</Label>
              <div className="font-bold text-blue-600">₹{(club.totalAllocated / 1000).toFixed(0)}K</div>
            </div>
            <div>
              <Label>Total Spent</Label>
              <div className="font-bold text-green-600">₹{(club.totalSpent / 1000).toFixed(0)}K</div>
            </div>
            <div>
              <Label>Pending</Label>
              <div className="font-bold text-orange-600">₹{(club.totalPending / 1000).toFixed(0)}K</div>
            </div>
            <div>
              <Label>Remaining</Label>
              <div className="font-bold text-purple-600">₹{(club.remaining / 1000).toFixed(0)}K</div>
            </div>
          </div>
          <div className="pt-2 border-t text-xs text-gray-500">Last activity: {new Date(club.lastActivity).toLocaleDateString()}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function BudgetManagement() {
  const [budgetRequests, setBudgetRequests] = useState([
    {
      id: 1,
      club: "ISTE MIT Manipal",
      clubLogo: "/placeholder.svg?height=40&width=40",
      eventTitle: "TechTatva 2025",
      requestedAmount: 85000,
      approvedAmount: 75000,
      category: "Technical Event",
      status: "approved",
      submittedDate: "2025-06-26",
      purpose: "Annual technical festival with workshops and competitions",
      breakdown: {
        venue: 25000,
        speakers: 30000,
        materials: 15000,
        refreshments: 10000,
        marketing: 5000,
      },
    },
    {
      id: 2,
      club: "Chords n Co. MIT",
      clubLogo: "/placeholder.svg?height=40&width=40",
      eventTitle: "Melodic Nights",
      requestedAmount: 45000,
      approvedAmount: 0,
      category: "Cultural Event",
      status: "pending",
      submittedDate: "2025-06-27",
      purpose: "Annual music concert featuring student performances",
      breakdown: {
        venue: 15000,
        equipment: 20000,
        refreshments: 8000,
        marketing: 2000,
      },
    },
    {
      id: 3,
      club: "Rotaract Club MIT",
      clubLogo: "/placeholder.svg?height=40&width=40",
      eventTitle: "Community Service Drive",
      requestedAmount: 25000,
      approvedAmount: 25000,
      category: "Service",
      status: "approved",
      submittedDate: "2025-06-28",
      purpose: "Beach cleanup and tree plantation drive",
      breakdown: {
        transportation: 10000,
        materials: 8000,
        refreshments: 5000,
        documentation: 2000,
      },
    },
  ])

  const [clubBudgets, setClubBudgets] = useState([
    {
      id: 1,
      club: "ISTE MIT Manipal",
      logo: "/placeholder.svg?height=40&width=40",
      totalAllocated: 200000,
      totalSpent: 135000,
      totalPending: 45000,
      remaining: 20000,
      events: 8,
      lastActivity: "2024-10-20",
    },
    {
      id: 2,
      club: "Chords n Co. MIT",
      logo: "/placeholder.svg?height=40&width=40",
      totalAllocated: 150000,
      totalSpent: 85000,
      totalPending: 45000,
      remaining: 20000,
      events: 5,
      lastActivity: "2025-06-28",
    },
    {
      id: 3,
      club: "Rotaract Club MIT",
      logo: "/placeholder.svg?height=40&width=40",
      totalAllocated: 180000,
      totalSpent: 120000,
      totalPending: 25000,
      remaining: 35000,
      events: 12,
      lastActivity: "2025-06-27",
    },
  ])

  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("requests")
  const [reportType, setReportType] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [format, setFormat] = useState("")

  const handleBudgetApproval = (requestId: number, status: "approved" | "rejected", approvedAmount?: number) => {
    setBudgetRequests((requests) =>
      requests.map((request) =>
        request.id === requestId ? { ...request, status, approvedAmount: approvedAmount || 0 } : request,
      ),
    )

    toast({
      title: status === "approved" ? "Budget Approved" : "Budget Rejected",
      description: `Budget request for ${budgetRequests.find((r) => r.id === requestId)?.eventTitle} has been ${status}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "status-approved"
      case "pending":
        return "status-pending"
      case "rejected":
        return "status-rejected"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalBudgetStats = {
    totalAllocated: clubBudgets.reduce((sum, club) => sum + club.totalAllocated, 0),
    totalSpent: clubBudgets.reduce((sum, club) => sum + club.totalSpent, 0),
    totalPending: clubBudgets.reduce((sum, club) => sum + club.totalPending, 0),
    totalRemaining: clubBudgets.reduce((sum, club) => sum + club.remaining, 0),
  }

  const BudgetDetailDialog = ({ request }: { request: any }) => {
    const [approvedAmountInput, setApprovedAmountInput] = useState(request.requestedAmount)
    const isValidAmount = typeof approvedAmountInput === 'number' && approvedAmountInput > 0
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={request.clubLogo || "/placeholder.svg"} />
                <AvatarFallback>{request.club.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{request.eventTitle}</h3>
                <p className="text-sm text-gray-600">{request.club}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Purpose</Label>
              <p className="text-sm text-gray-600 mt-1">{request.purpose}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Requested Amount</Label>
                <p className="text-2xl font-bold text-blue-600">₹{request.requestedAmount.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Badge className="mt-1">{request.category}</Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Budget Breakdown</Label>
              <div className="space-y-3 mt-2">
                {Object.entries(request.breakdown).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{category}</span>
                    <span className="font-medium">₹{(amount as number).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {request.status === "pending" && (
              <div className="border-t pt-6">
                <Label className="text-sm font-medium">Approved Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter approved amount"
                  className="mt-2"
                  value={approvedAmountInput}
                  onChange={e => setApprovedAmountInput(Number(e.target.value))}
                  min={0}
                />
                {!isValidAmount && (
                  <div className="text-xs text-red-500 mt-1">Please enter a valid amount greater than 0.</div>
                )}
                <div className="flex justify-end space-x-3 mt-4">
                  <Button variant="destructive" onClick={() => handleBudgetApproval(request.id, "rejected")}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="nexus-button-primary"
                    onClick={() => handleBudgetApproval(request.id, "approved", approvedAmountInput)}
                    disabled={!isValidAmount}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  function handleGenerateReport() {
    if (!reportType || !dateRange || !format) {
      toast({
        title: "Missing Selection",
        description: "Please select report type, date range, and format.",
        variant: "destructive",
      })
      return
    }
    let filename = `${reportType}-${dateRange}-report.${format === "pdf" ? "pdf" : format === "excel" ? "xlsx" : "csv"}`
    if (format === "pdf") {
      const doc = new jsPDF()
      doc.setFontSize(16)
      doc.text("NexusSync Financial Report", 10, 15)
      doc.setFontSize(12)
      doc.text(`Report Type: ${reportType}`, 10, 30)
      doc.text(`Date Range: ${dateRange}`, 10, 40)
      doc.text("\nSummary:", 10, 55)
      doc.text("This is a mock PDF report generated for demonstration.", 10, 65)
      doc.save(filename)
      toast({
        title: "Report Generated",
        description: `Your ${reportType} for ${dateRange} (PDF) is ready for download.`,
      })
      return
    }

    let content = `Report Type: ${reportType}\nDate Range: ${dateRange}\nFormat: ${format}\n\nThis is a mock report.`
    let blob
    if (format === "excel") {
      blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    } else {
      blob = new Blob([content], { type: "text/csv" })
    }
    saveAs(blob, filename)
    toast({
      title: "Report Generated",
      description: `Your ${reportType} for ${dateRange} (${format.toUpperCase()}) is ready for download.`,
    })
  }

  function handleDownloadRecentReport(name: string) {
    const ext = format || "pdf"
    let filename = `${name.replace(/\s+/g, "-").toLowerCase()}.${ext === "pdf" ? "pdf" : ext === "excel" ? "xlsx" : "csv"}`
    if (ext === "pdf") {
      const doc = new jsPDF()
      doc.setFontSize(16)
      doc.text("NexusSync Financial Report", 10, 15)
      doc.setFontSize(12)
      doc.text(name, 10, 30)
      doc.text("This is a mock PDF report for demonstration.", 10, 45)
      doc.save(filename)
      toast({
        title: "Download Started",
        description: `${name} (PDF) is downloading.`,
      })
      return
    }
    let content = `This is a mock download for ${name} (${ext.toUpperCase()})`
    let blob
    if (ext === "excel") {
      blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    } else {
      blob = new Blob([content], { type: "text/csv" })
    }
    saveAs(blob, filename)
    toast({
      title: "Download Started",
      description: `${name} (${ext.toUpperCase()}) is downloading.`,
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="admin-card admin-glass-strong bg-gradient-to-br from-blue-100/60 via-green-100/30 to-purple-100/20 dark:from-gray-900/60 dark:via-gray-800/50 dark:to-blue-900/30 p-0 shadow-xl animate-fade-in-up relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-green-100/20 to-purple-100/10 dark:from-gray-900/40 dark:via-gray-800/30 dark:to-blue-900/20 pointer-events-none z-0" />
        <div className="relative z-10 flex items-center justify-between px-8 pt-8 pb-4">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg animate-fade-in-up">
            Budget Management
          </h2>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="admin-button-secondary animate-fade-in-up" onClick={() => setActiveTab("reports")}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="admin-button-secondary animate-fade-in-up" onClick={() => setActiveTab("analytics")}>
              <PieChart className="w-4 h-4 mr-2" />
              Financial Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="admin-stat-card admin-stat-card-blue animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-white/90" />
            <Badge className="bg-white/20 text-white border-white/30">Allocated</Badge>
          </div>
          <p className="text-white/80 text-sm font-medium">Total Allocated</p>
          <p className="text-3xl font-bold text-white">₹{(totalBudgetStats.totalAllocated / 100000).toFixed(1)}L</p>
        </div>
        <div className="admin-stat-card admin-stat-card-green animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-white/90" />
            <Badge className="bg-white/20 text-white border-white/30">Spent</Badge>
          </div>
          <p className="text-white/80 text-sm font-medium">Total Spent</p>
          <p className="text-3xl font-bold text-white">₹{(totalBudgetStats.totalSpent / 100000).toFixed(1)}L</p>
          <div className="flex items-center mt-2 text-white/80 text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>68% utilized</span>
          </div>
        </div>
        <div className="admin-stat-card admin-stat-card-orange animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-white/90" />
            <Badge className="bg-white/20 text-white border-white/30">Pending</Badge>
          </div>
          <p className="text-white/80 text-sm font-medium">Pending Approval</p>
          <p className="text-3xl font-bold text-white">₹{(totalBudgetStats.totalPending / 1000).toFixed(0)}K</p>
        </div>
        <div className="admin-stat-card admin-stat-card-purple animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-white/90" />
            <Badge className="bg-white/20 text-white border-white/30">Remaining</Badge>
          </div>
          <p className="text-white/80 text-sm font-medium">Remaining</p>
          <p className="text-3xl font-bold text-white">₹{(totalBudgetStats.totalRemaining / 1000).toFixed(0)}K</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 animate-fade-in">
        <TabsList>
          <TabsTrigger value="requests">Budget Requests</TabsTrigger>
          <TabsTrigger value="clubs">Club Budgets</TabsTrigger>
          <TabsTrigger value="analytics">Financial Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card className="nexus-card">
            <CardHeader>
              <CardTitle>Pending Budget Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetRequests
                  .filter((r) => r.status === "pending")
                  .map((request) => (
                    <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={request.clubLogo || "/placeholder.svg"} />
                            <AvatarFallback>{request.club.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold">{request.eventTitle}</h4>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{request.purpose}</p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Requested:</span>
                                <span className="font-semibold ml-2">₹{request.requestedAmount.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Category:</span>
                                <span className="ml-2">{request.category}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Submitted:</span>
                                <span className="ml-2">{new Date(request.submittedDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <BudgetDetailDialog request={request} />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleBudgetApproval(request.id, "rejected")}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="nexus-button-primary"
                            onClick={() => handleBudgetApproval(request.id, "approved", request.requestedAmount)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="nexus-card">
            <CardHeader>
              <CardTitle>Recent Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetRequests
                  .filter((r) => r.status === "approved")
                  .map((request) => (
                    <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={request.clubLogo || "/placeholder.svg"} />
                            <AvatarFallback>{request.club.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold">{request.eventTitle}</h4>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Approved:</span>
                                <span className="font-semibold ml-2 text-green-600">
                                  ₹{request.approvedAmount.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Category:</span>
                                <span className="ml-2">{request.category}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Club:</span>
                                <span className="ml-2">{request.club}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <BudgetDetailDialog request={request} />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clubs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {clubBudgets.map((club) => (
              <Card key={club.id} className="nexus-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={club.logo || "/placeholder.svg"} />
                      <AvatarFallback>{club.club.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{club.club}</h3>
                      <p className="text-sm text-gray-500">{club.events} events this year</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Budget Utilization</span>
                        <span>{Math.round((club.totalSpent / club.totalAllocated) * 100)}%</span>
                      </div>
                      <Progress value={(club.totalSpent / club.totalAllocated) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Allocated</p>
                        <p className="font-semibold">₹{(club.totalAllocated / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Spent</p>
                        <p className="font-semibold text-green-600">₹{(club.totalSpent / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Pending</p>
                        <p className="font-semibold text-orange-600">₹{(club.totalPending / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Remaining</p>
                        <p className="font-semibold text-blue-600">₹{(club.remaining / 1000).toFixed(0)}K</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-gray-500">
                        Last activity: {new Date(club.lastActivity).toLocaleDateString()}
                      </span>
                      <ClubBudgetDetailDialog club={club} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="nexus-card">
              <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  📊 Monthly spending chart would go here
                </div>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader>
                <CardTitle>Budget Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  🥧 Category distribution pie chart would go here
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="nexus-card">
            <CardHeader>
              <CardTitle>Budget Efficiency Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Budget Efficiency</div>
                  <div className="text-xs text-green-600 mt-1">Above target</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Days to Approval</div>
                  <div className="text-xs text-blue-600 mt-1">Within SLA</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">₹45K</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Request Size</div>
                  <div className="text-xs text-purple-600 mt-1">Stable</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="nexus-card">
            <CardHeader>
              <CardTitle>Generate Financial Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly Summary</SelectItem>
                      <SelectItem value="quarterly">Quarterly Report</SelectItem>
                      <SelectItem value="annual">Annual Report</SelectItem>
                      <SelectItem value="club-wise">Club-wise Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current-month">Current Month</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="current-quarter">Current Quarter</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="current-year">Current Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="format">Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="nexus-button-primary" onClick={handleGenerateReport}>
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="nexus-card">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium">July 2025 Financial Summary</p>
                    <p className="text-sm text-gray-500">Generated on July 27, 2025</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadRecentReport("July 2025 Financial Summary")}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium">Q2 2025 Budget Analysis</p>
                    <p className="text-sm text-gray-500">Generated on July 30, 2025</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadRecentReport("Q2 2025 Budget Analysis")}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
