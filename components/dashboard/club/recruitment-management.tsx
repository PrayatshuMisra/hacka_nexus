"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, CheckCircle, XCircle, Eye, MessageSquare, Star, Calendar, FileText, Users, TrendingUp, Clock, Award, Search, Filter, Download, UserPlus, Target, BarChart3, Mail, Phone, GraduationCap, MapPin, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function RecruitmentManagement() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Core Team Recruitment 2025",
      description: "Recruiting talented individuals for our core team positions",
      positions: ["Web Development Lead", "Mobile App Lead", "Design Lead"],
      startDate: "2024-06-26",
      endDate: "2025-07-30",
      status: "active",
      applications: 45,
      shortlisted: 12,
      selected: 3,
    },
  ])

  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Prayatshu Misra",
      email: "prayatshu.mitmpl2024@learner.manipal.edu",
      phone: "+91 79856 38485",
      position: "Web Development Lead",
      status: "pending",
      score: 85,
      appliedDate: "2025-06-26",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Computer Science Engineering",
      yearOfStudy: 2,
      experience: "2 years in React, Node.js",
      portfolio: "https://prayatshumisra.dev",
    },
    {
      id: 2,
      name: "Rohan Mathur",
      email: "rohan2.mitmpl2024@learner.manipal.edu",
      phone: "+91 98180 49557",
      position: "Design Lead",
      status: "shortlisted",
      score: 92,
      appliedDate: "2025-06-26",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Information Technology",
      yearOfStudy: 3,
      experience: "1.5 years in UI/UX Design",
      portfolio: "https://rohanmathur.design",
    },
    {
      id: 3,
      name: "Mehran Dhakray",
      email: "mehran.mitmpl2024@learner.manipal.edu",
      phone: "+91 74286 67645",
      position: "Mobile App Lead",
      status: "accepted",
      score: 88,
      appliedDate: "2025-06-27",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Computer Science Engineering",
      yearOfStudy: 4,
      experience: "2.5 years in Flutter, React Native",
      portfolio: "https://mehran.dev",
    },
  ])

  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    positions: "",
    startDate: "",
    endDate: "",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [positionFilter, setPositionFilter] = useState("all")

  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [messageDialog, setMessageDialog] = useState(false)
  const [messageContent, setMessageContent] = useState("")
  const [interviewDialog, setInterviewDialog] = useState(false)
  const [interviewDetails, setInterviewDetails] = useState({
    date: "",
    time: "",
    location: "",
    type: "online",
    notes: "",
  })

  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "Web Development Assessment",
      domain: "Web Development",
      description: "Test knowledge of HTML, CSS, JavaScript, and React",
      questions: 15,
      duration: 30,
      participants: 12,
      status: "active",
      passingScore: 70,
      createdAt: "2025-06-26",
    },
    {
      id: 2,
      title: "Design Fundamentals Test",
      domain: "UI/UX Design",
      description: "Assess design principles, tools, and user experience",
      questions: 10,
      duration: 20,
      participants: 8,
      status: "draft",
      passingScore: 75,
      createdAt: "2025-06-27",
    },
  ])

  const [interviews, setInterviews] = useState([
    {
      id: 1,
      candidate: "Prayatshu Misra",
      position: "Web Development Lead",
      date: "2025-06-29",
      time: "10:00 AM",
      type: "online",
      status: "scheduled",
      location: "Zoom Meeting",
      notes: "Zoom meeting link will be sent",
    },
    {
      id: 2,
      candidate: "Rohan Mathur",
      position: "Design Lead",
      date: "2025-06-26",
      time: "2:00 PM",
      type: "offline",
      status: "completed",
      location: "Room 101, AB3",
      notes: "Interview completed successfully",
    },
  ])

  const [quizResults, setQuizResults] = useState([
    {
      id: 1,
      quizId: 1,
      candidateName: "Prayatshu Misra",
      candidateEmail: "prayatshu.mitmpl2024@learner.manipal.edu",
      score: 85,
      totalPoints: 100,
      percentage: 85,
      passed: true,
      completedAt: "2025-06-26T14:30:00Z",
    },
    {
      id: 2,
      quizId: 1,
      candidateName: "mehran Dhakray",
      candidateEmail: "mehran.mitmpl2024@learner.manipal.edu",
      score: 72,
      totalPoints: 100,
      percentage: 72,
      passed: true,
      completedAt: "2025-06-27T09:15:00Z",
    },
  ])

  const [openQuizResults, setOpenQuizResults] = useState<{quizId: number|null, open: boolean}>({quizId: null, open: false})
  const [openQuizEdit, setOpenQuizEdit] = useState<{quizId: number|null, open: boolean}>({quizId: null, open: false})

  const { toast } = useToast()

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesPosition = positionFilter === "all" || app.position === positionFilter
    return matchesSearch && matchesStatus && matchesPosition
  })

  const handleCreateCampaign = () => {
    if (!newCampaign.title || !newCampaign.startDate || !newCampaign.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const campaign = {
      id: campaigns.length + 1,
      ...newCampaign,
      positions: newCampaign.positions.split(",").map((p) => p.trim()),
      status: "active",
      applications: 0,
      shortlisted: 0,
      selected: 0,
    }

    setCampaigns([...campaigns, campaign])
    setNewCampaign({
      title: "",
      description: "",
      positions: "",
      startDate: "",
      endDate: "",
    })

    toast({
      title: "Campaign Created",
      description: "Your recruitment campaign is now live",
      variant: "success",
    })
  }

  const updateApplicationStatus = (applicationId: number, newStatus: string) => {
    setApplications(applications.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)))

    toast({
      title: "Status Updated",
      description: `Application status changed to ${newStatus}`,
      variant: "success",
    })
  }

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application)
  }

  const handleViewCampaign = (campaign: any) => {
    setSelectedCampaign(campaign)
  }

  const handleSendMessage = (application: any) => {
    setSelectedApplication(application)
    setMessageDialog(true)
  }

  const sendMessage = () => {
    if (!messageContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedApplication.name}`,
      variant: "success",
    })
    setMessageContent("")
    setMessageDialog(false)
  }

  const scheduleInterview = () => {
    if (!interviewDetails.date || !interviewDetails.time || !interviewDetails.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Interview Scheduled",
      description: `Interview scheduled for ${selectedApplication.name} on ${interviewDetails.date} at ${interviewDetails.time}`,
      variant: "success",
    })
    setInterviewDetails({
      date: "",
      time: "",
      location: "",
      type: "online",
      notes: "",
    })
    setInterviewDialog(false)
  }

  const exportApplications = () => {
    const csvContent = [
      ["Name", "Email", "Position", "Status", "Score", "Applied Date"],
      ...applications.map(app => [
        app.name,
        app.email,
        app.position,
        app.status,
        app.score.toString(),
        app.appliedDate
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "applications.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: "Applications exported to CSV file",
      variant: "success",
    })
  }

  const deleteCampaign = (campaignId: number) => {
    setCampaigns(campaigns.filter(c => c.id !== campaignId))
    toast({
      title: "Campaign Deleted",
      description: "Recruitment campaign has been deleted",
      variant: "success",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "shortlisted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleCreateQuiz = (quizData: any) => {
    const newQuiz = {
      id: quizzes.length + 1,
      ...quizData,
      participants: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setQuizzes([...quizzes, newQuiz])
    toast({
      title: "Quiz Created",
      description: "Your quiz has been created successfully",
      variant: "success",
    })
  }

  const handleEditQuiz = (quizId: number) => {
    setOpenQuizEdit({quizId, open: true})
  }

  const handleDeleteQuiz = (quizId: number) => {
    setQuizzes(quizzes.filter(q => q.id !== quizId))
    toast({
      title: "Quiz Deleted",
      description: "Quiz has been deleted successfully",
      variant: "success",
    })
  }

  const handleViewQuizResults = (quizId: number) => {
    setOpenQuizResults({quizId, open: true})
  }

  const handleCloseQuizResults = () => setOpenQuizResults({quizId: null, open: false})
  const handleCloseQuizEdit = () => setOpenQuizEdit({quizId: null, open: false})

  const handleScheduleInterview = (candidate: any) => {
    setSelectedApplication(candidate)
    setInterviewDialog(true)
  }

  const handleRescheduleInterview = (interviewId: number) => {
    const interview = interviews.find(i => i.id === interviewId)
    if (interview) {
      setInterviewDetails({
        date: interview.date,
        time: interview.time,
        location: (interview as any).location || "",
        type: interview.type,
        notes: interview.notes || "",
      })
      setInterviewDialog(true)
      toast({
        title: "Reschedule Interview",
        description: `Rescheduling interview for ${interview.candidate}`,
        variant: "info",
      })
    }
  }

  const handleCancelInterview = (interviewId: number) => {
    setInterviews(interviews.map(i => 
      i.id === interviewId ? { ...i, status: "cancelled" } : i
    ))
    toast({
      title: "Interview Cancelled",
      description: "Interview has been cancelled successfully",
      variant: "success",
    })
  }

  const handleCompleteInterview = (interviewId: number) => {
    setInterviews(interviews.map(i => 
      i.id === interviewId ? { ...i, status: "completed" } : i
    ))
    toast({
      title: "Interview Completed",
      description: "Interview has been marked as completed",
      variant: "success",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Recruitment Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage recruitment campaigns and candidate applications
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="admin-button-primary bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up delay-100">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl animate-fade-in-up">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Recruitment Campaign
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label htmlFor="campaign-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">Campaign Title *</Label>
                <Input
                  id="campaign-title"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  placeholder="e.g., Core Team Recruitment 2024"
                  className="admin-input mt-2"
                />
              </div>

              <div>
                <Label htmlFor="campaign-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
                <Textarea
                  id="campaign-description"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  placeholder="Describe the recruitment campaign"
                  rows={3}
                  className="admin-input mt-2"
                />
              </div>

              <div>
                <Label htmlFor="positions" className="text-sm font-medium text-gray-700 dark:text-gray-300">Positions (comma-separated) *</Label>
                <Input
                  id="positions"
                  value={newCampaign.positions}
                  onChange={(e) => setNewCampaign({ ...newCampaign, positions: e.target.value })}
                  placeholder="Web Development Lead, Design Lead, Event Coordinator"
                  className="admin-input mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                    className="admin-input mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date *</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                    className="admin-input mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button onClick={handleCreateCampaign} className="admin-button-primary bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                  Launch Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up delay-200">
        <div className="admin-stat-card admin-stat-card-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Active Campaigns</p>
              <p className="text-3xl font-bold">1</p>
            </div>
            <Target className="w-8 h-8 text-white/90" />
          </div>
        </div>
        <div className="admin-stat-card admin-stat-card-purple">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Applications</p>
              <p className="text-3xl font-bold">45</p>
            </div>
            <Users className="w-8 h-8 text-white/90" />
          </div>
        </div>
        <div className="admin-stat-card admin-stat-card-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Shortlisted</p>
              <p className="text-3xl font-bold">12</p>
            </div>
            <Award className="w-8 h-8 text-white/90" />
          </div>
        </div>
        <div className="admin-stat-card admin-stat-card-orange">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Selected</p>
              <p className="text-3xl font-bold">3</p>
            </div>
            <TrendingUp className="w-8 h-8 text-white/90" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6 animate-fade-in-up delay-300">
        <TabsList className="admin-tabs-list grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-md">
          <TabsTrigger value="campaigns" className="admin-tabs-trigger flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="admin-tabs-trigger flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Applications</span>
          </TabsTrigger>
          <TabsTrigger value="interviews" className="admin-tabs-trigger flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Interviews</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="admin-tabs-trigger flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {campaigns.map((campaign, index) => (
            <div key={campaign.id} className="admin-card admin-glass p-0 animate-fade-in-up hover:scale-[1.02] transition-transform duration-200" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                      {campaign.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        {campaign.startDate} - {campaign.endDate}
                      </span>
                      <Badge
                        className={
                          campaign.status === "active" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 animate-pulse" 
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="admin-button-secondary" onClick={() => handleViewCampaign(campaign)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="admin-button-secondary">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="admin-button-secondary text-red-600 hover:text-red-700" onClick={() => deleteCampaign(campaign.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{campaign.applications}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Applications</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl border border-yellow-200 dark:border-yellow-700">
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{campaign.shortlisted}</div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Shortlisted</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl border border-green-200 dark:border-green-700">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">{campaign.selected}</div>
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">Selected</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl border border-purple-200 dark:border-purple-700">
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{campaign.positions.length}</div>
                    <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Positions</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {campaign.positions.map((position, index) => (
                    <Badge key={index} variant="secondary" className="admin-badge-info">
                      {position}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search applications..." 
                  className="pl-10 admin-input w-64" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 admin-input">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-48 admin-input">
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  <SelectItem value="Web Development Lead">Web Development Lead</SelectItem>
                  <SelectItem value="Mobile App Lead">Mobile App Lead</SelectItem>
                  <SelectItem value="Design Lead">Design Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="admin-button-secondary" onClick={exportApplications}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="space-y-4">
            {filteredApplications.map((application, index) => (
              <div key={application.id} className="admin-card admin-glass p-0 animate-fade-in-up hover:scale-[1.02] transition-transform duration-200" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-14 h-14 ring-2 ring-purple-200 dark:ring-purple-800">
                        <AvatarImage src={application.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                          {application.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">{application.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {application.email}
                        </p>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{application.position}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold text-lg">{application.score}</span>
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>

                      <Badge className={getStatusColor(application.status) + " admin-badge-info"}>
                        {application.status}
                      </Badge>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="admin-button-secondary" onClick={() => handleViewApplication(application)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="admin-button-secondary" onClick={() => handleSendMessage(application)}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>

                        {application.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="admin-button-primary bg-green-600 hover:bg-green-700"
                              onClick={() => updateApplicationStatus(application.id, "shortlisted")}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Shortlist
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateApplicationStatus(application.id, "rejected")}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}

                        {application.status === "shortlisted" && (
                          <>
                            <Button
                              size="sm"
                              className="admin-button-primary bg-blue-600 hover:bg-blue-700"
                              onClick={() => updateApplicationStatus(application.id, "accepted")}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              className="admin-button-secondary"
                              onClick={() => {
                                setSelectedApplication(application)
                                handleScheduleInterview(application)
                              }}
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule Interview
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interviews">
          <div className="space-y-6">
            {/* Quiz Management Section */}
            <div className="admin-card admin-glass p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Quiz Management
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Create domain-specific quizzes to assess candidates
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="admin-button-primary bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Quiz
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        Create New Quiz
                      </DialogTitle>
                    </DialogHeader>
                    <CreateQuizForm />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Quiz List */}
              <div className="space-y-4">
                {quizzes.map((quiz, index) => (
                  <QuizCard 
                    key={quiz.id}
                    title={quiz.title}
                    domain={quiz.domain}
                    questions={quiz.questions}
                    duration={quiz.duration}
                    participants={quiz.participants}
                    status={quiz.status}
                    onViewResults={() => handleViewQuizResults(quiz.id)}
                    onEdit={() => handleEditQuiz(quiz.id)}
                    onDelete={() => handleDeleteQuiz(quiz.id)}
                  />
                ))}
              </div>

              {/* Quiz Results Dialog */}
              <Dialog open={openQuizResults.open} onOpenChange={handleCloseQuizResults}>
                <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Quiz Results
                    </DialogTitle>
                  </DialogHeader>
                  {openQuizResults.quizId && (
                    <div className="space-y-4">
                      <div className="font-semibold mb-2">Results for: {quizzes.find(q => q.id === openQuizResults.quizId)?.title}</div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                              <th className="px-3 py-2 text-left">Candidate</th>
                              <th className="px-3 py-2 text-left">Email</th>
                              <th className="px-3 py-2 text-center">Score</th>
                              <th className="px-3 py-2 text-center">Result</th>
                              <th className="px-3 py-2 text-center">Completed At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quizResults.filter(r => r.quizId === openQuizResults.quizId).length === 0 ? (
                              <tr><td colSpan={5} className="text-center py-4 text-gray-500">No results yet.</td></tr>
                            ) : quizResults.filter(r => r.quizId === openQuizResults.quizId).map(result => (
                              <tr key={result.id} className="border-b border-gray-200 dark:border-gray-700">
                                <td className="px-3 py-2">{result.candidateName}</td>
                                <td className="px-3 py-2">{result.candidateEmail}</td>
                                <td className="px-3 py-2 text-center">{result.score}/{result.totalPoints} ({result.percentage}%)</td>
                                <td className="px-3 py-2 text-center">
                                  <span className={result.passed ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{result.passed ? "Passed" : "Failed"}</span>
                                </td>
                                <td className="px-3 py-2 text-center">{new Date(result.completedAt).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Quiz Edit Dialog */}
              <Dialog open={openQuizEdit.open} onOpenChange={handleCloseQuizEdit}>
                <DialogContent className="max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-pink-600 bg-clip-text text-transparent">
                      Edit Quiz
                    </DialogTitle>
                  </DialogHeader>
                  {openQuizEdit.quizId && (() => {
                    const quiz = quizzes.find(q => q.id === openQuizEdit.quizId)
                    if (!quiz) return <div>Quiz not found.</div>
                    return (
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <input type="text" className="admin-input w-full" value={quiz.title} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Domain</label>
                          <input type="text" className="admin-input w-full" value={quiz.domain} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea className="admin-input w-full" value={quiz.description || ""} readOnly />
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" onClick={handleCloseQuizEdit}>Close</Button>
                        </div>
                      </form>
                    )
                  })()}
                </DialogContent>
              </Dialog>
            </div>

            {/* Interview Scheduling Section */}
            <div className="admin-card admin-glass p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Interview Scheduling
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Schedule interviews with shortlisted candidates
                  </p>
                </div>
                <Button className="admin-button-primary" onClick={() => handleScheduleInterview(selectedApplication)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
              </div>

              {/* Interview List */}
              <div className="space-y-4">
                {interviews.map((interview, index) => (
                  <InterviewCard 
                    key={interview.id}
                    candidate={interview.candidate}
                    position={interview.position}
                    date={interview.date}
                    time={interview.time}
                    type={interview.type}
                    status={interview.status}
                    onReschedule={() => handleRescheduleInterview(interview.id)}
                    onCancel={() => handleCancelInterview(interview.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="admin-card admin-glass p-0 animate-fade-in-up">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Application Funnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Applications Received</span>
                    <span className="font-bold text-blue-600">45</span>
                  </div>
                  <Progress value={100} className="admin-progress h-3" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Shortlisted</span>
                    <span className="font-bold text-yellow-600">12 (27%)</span>
                  </div>
                  <Progress value={27} className="admin-progress h-3" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Selected</span>
                    <span className="font-bold text-green-600">3 (7%)</span>
                  </div>
                  <Progress value={7} className="admin-progress h-3" />
                </div>
              </CardContent>
            </div>

            <div className="admin-card admin-glass p-0 animate-fade-in-up delay-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Position Popularity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="font-medium">Web Development Lead</span>
                  <Badge className="admin-badge-info">20 applications</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="font-medium">Design Lead</span>
                  <Badge className="admin-badge-info">15 applications</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="font-medium">Mobile App Lead</span>
                  <Badge className="admin-badge-info">10 applications</Badge>
                </div>
              </CardContent>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Application Details
            </DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16 ring-2 ring-purple-200 dark:ring-purple-800">
                  <AvatarImage src={selectedApplication.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg">
                    {selectedApplication.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedApplication.name}</h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">{selectedApplication.position}</p>
                  <Badge className={getStatusColor(selectedApplication.status) + " mt-2"}>
                    {selectedApplication.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{selectedApplication.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{selectedApplication.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{selectedApplication.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Year {selectedApplication.yearOfStudy}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Score: {selectedApplication.score}/100</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Applied: {selectedApplication.appliedDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{selectedApplication.experience}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-2">Portfolio</h4>
                <a href={selectedApplication.portfolio} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">
                  {selectedApplication.portfolio}
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
        <DialogContent className="max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Send Message
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">To: {selectedApplication?.name}</Label>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</Label>
              <Textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Enter your message..."
                rows={4}
                className="admin-input mt-2"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" className="admin-button-secondary" onClick={() => setMessageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={sendMessage} className="admin-button-primary">
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interview Scheduling Dialog */}
      <Dialog open={interviewDialog} onOpenChange={setInterviewDialog}>
        <DialogContent className="max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Schedule Interview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Candidate: {selectedApplication?.name}</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</Label>
                <Input
                  type="date"
                  value={interviewDetails.date}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, date: e.target.value })}
                  className="admin-input mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</Label>
                <Input
                  type="time"
                  value={interviewDetails.time}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, time: e.target.value })}
                  className="admin-input mt-2"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location/Platform</Label>
              <Input
                value={interviewDetails.location}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, location: e.target.value })}
                placeholder="Room 101 or Zoom link"
                className="admin-input mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Interview Type</Label>
              <Select value={interviewDetails.type} onValueChange={(value) => setInterviewDetails({ ...interviewDetails, type: value })}>
                <SelectTrigger className="admin-input mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</Label>
              <Textarea
                value={interviewDetails.notes}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, notes: e.target.value })}
                placeholder="Additional notes for the interview..."
                rows={3}
                className="admin-input mt-2"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" className="admin-button-secondary" onClick={() => setInterviewDialog(false)}>
                Cancel
              </Button>
              <Button onClick={scheduleInterview} className="admin-button-primary">
                Schedule Interview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Campaign Details Dialog */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Campaign Details
            </DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedCampaign.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedCampaign.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</Label>
                  <p className="text-gray-900 dark:text-white">{selectedCampaign.startDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</Label>
                  <p className="text-gray-900 dark:text-white">{selectedCampaign.endDate}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Positions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCampaign.positions.map((position: string, index: number) => (
                    <Badge key={index} variant="secondary" className="admin-badge-info">
                      {position}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedCampaign.applications}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Applications</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{selectedCampaign.shortlisted}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Shortlisted</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedCampaign.selected}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Selected</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateQuizForm() {
  const [quizData, setQuizData] = useState({
    title: "",
    domain: "",
    description: "",
    duration: 30,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "",
        type: "multiple_choice",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1,
      }
    ]
  })

  const [currentStep, setCurrentStep] = useState(1)
  const { toast } = useToast()

  const addQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: prev.questions.length + 1,
          question: "",
          type: "multiple_choice",
          options: ["", "", "", ""],
          correctAnswer: 0,
          points: 1,
        }
      ]
    }))
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

  const removeQuestion = (index: number) => {
    if (quizData.questions.length > 1) {
      setQuizData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }))
    } else {
      toast({
        title: "Error",
        description: "Quiz must have at least one question",
        variant: "destructive",
      })
    }
  }

  const validateQuiz = () => {
    if (!quizData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz title",
        variant: "destructive",
      })
      return false
    }
    if (!quizData.domain) {
      toast({
        title: "Error",
        description: "Please select a domain",
        variant: "destructive",
      })
      return false
    }
    if (quizData.duration < 5) {
      toast({
        title: "Error",
        description: "Duration must be at least 5 minutes",
        variant: "destructive",
      })
      return false
    }
    if (quizData.passingScore < 0 || quizData.passingScore > 100) {
      toast({
        title: "Error",
        description: "Passing score must be between 0 and 100",
        variant: "destructive",
      })
      return false
    }

    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i]
      if (!question.question.trim()) {
        toast({
          title: "Error",
          description: `Please enter question ${i + 1}`,
          variant: "destructive",
        })
        return false
      }
      if (question.options.some(opt => !opt.trim())) {
        toast({
          title: "Error",
          description: `Please fill all options for question ${i + 1}`,
          variant: "destructive",
        })
        return false
      }
    }
    return true
  }

  const handleSubmit = () => {
    if (!validateQuiz()) return

    const newQuiz = {
      title: quizData.title,
      domain: quizData.domain,
      description: quizData.description,
      duration: quizData.duration,
      passingScore: quizData.passingScore,
      questions: quizData.questions.length,
    }

    setQuizData({
      title: "",
      domain: "",
      description: "",
      duration: 30,
      passingScore: 70,
      questions: [
        {
          id: 1,
          question: "",
          type: "multiple_choice",
          options: ["", "", "", ""],
          correctAnswer: 0,
          points: 1,
        }
      ]
    })
    setCurrentStep(1)

    toast({
      title: "Quiz Created",
      description: "Your quiz has been created successfully",
      variant: "success",
    })

    const closeButton = document.querySelector('[data-radix-dialog-close]') as HTMLElement
    if (closeButton) {
      closeButton.click()
    }
  }

  const handleSaveDraft = () => {
    if (!quizData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz title to save as draft",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Draft Saved",
      description: "Quiz has been saved as draft",
      variant: "success",
    })

    const closeButton = document.querySelector('[data-radix-dialog-close]') as HTMLElement
    if (closeButton) {
      closeButton.click()
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="text-sm font-medium">Basic Info</span>
        </div>
        <div className="w-8 h-1 bg-gray-200 rounded"></div>
        <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="text-sm font-medium">Questions</span>
        </div>
        <div className="w-8 h-1 bg-gray-200 rounded"></div>
        <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <span className="text-sm font-medium">Review</span>
        </div>
      </div>

      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quiz Title *</Label>
            <Input
              value={quizData.title}
              onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
              placeholder="e.g., Web Development Assessment"
              className="admin-input mt-2"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Domain *</Label>
            <Select value={quizData.domain} onValueChange={(value) => setQuizData({ ...quizData, domain: value })}>
              <SelectTrigger className="admin-input mt-2">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web_development">Web Development</SelectItem>
                <SelectItem value="mobile_development">Mobile Development</SelectItem>
                <SelectItem value="ui_ux_design">UI/UX Design</SelectItem>
                <SelectItem value="data_science">Data Science</SelectItem>
                <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
            <Textarea
              value={quizData.description}
              onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
              placeholder="Describe what this quiz will assess..."
              rows={3}
              className="admin-input mt-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration (minutes)</Label>
              <Input
                type="number"
                value={quizData.duration}
                onChange={(e) => setQuizData({ ...quizData, duration: parseInt(e.target.value) })}
                className="admin-input mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Passing Score (%)</Label>
              <Input
                type="number"
                value={quizData.passingScore}
                onChange={(e) => setQuizData({ ...quizData, passingScore: parseInt(e.target.value) })}
                className="admin-input mt-2"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setCurrentStep(2)} className="admin-button-primary">
              Next: Add Questions
            </Button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Questions ({quizData.questions.length})</h4>
            <Button onClick={addQuestion} className="admin-button-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
          
          {quizData.questions.map((question, index) => (
            <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-medium">Question {index + 1}</h5>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeQuestion(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Question</Label>
                <Textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(index, "question", e.target.value)}
                  placeholder="Enter your question..."
                  rows={2}
                  className="admin-input mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Options</Label>
                <div className="space-y-2 mt-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() => updateQuestion(index, "correctAnswer", optionIndex)}
                        className="text-blue-600"
                      />
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options]
                          newOptions[optionIndex] = e.target.value
                          updateQuestion(index, "options", newOptions)
                        }}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="admin-input"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Points</Label>
                <Input
                  type="number"
                  value={question.points}
                  onChange={(e) => updateQuestion(index, "points", parseInt(e.target.value))}
                  className="admin-input mt-2 w-20"
                />
              </div>
            </div>
          ))}
          
          <div className="flex justify-between">
            <Button onClick={() => setCurrentStep(1)} className="admin-button-secondary">
              Previous
            </Button>
            <Button onClick={() => setCurrentStep(3)} className="admin-button-primary">
              Next: Review
            </Button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quiz Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Title:</span>
                <span className="ml-2 font-medium">{quizData.title}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Domain:</span>
                <span className="ml-2 font-medium">{quizData.domain}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="ml-2 font-medium">{quizData.duration} minutes</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Passing Score:</span>
                <span className="ml-2 font-medium">{quizData.passingScore}%</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                <span className="ml-2 font-medium">{quizData.questions.length}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total Points:</span>
                <span className="ml-2 font-medium">{quizData.questions.reduce((sum, q) => sum + q.points, 0)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button onClick={() => setCurrentStep(2)} className="admin-button-secondary">
              Previous
            </Button>
            <Button onClick={handleSubmit} className="admin-button-primary">
              Create Quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function QuizCard({ title, domain, questions, duration, participants, status, onViewResults, onEdit, onDelete }: {
  title: string
  domain: string
  questions: number
  duration: number
  participants: number
  status: string
  onViewResults: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="admin-card admin-glass p-4 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h4>
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{domain}</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Questions:</span>
              <span className="ml-1 font-medium">{questions}</span>
            </div>
            <div>
              <span className="text-gray-500">Duration:</span>
              <span className="ml-1 font-medium">{duration} min</span>
            </div>
            <div>
              <span className="text-gray-500">Participants:</span>
              <span className="ml-1 font-medium">{participants}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="admin-button-secondary" onClick={onViewResults}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Results
          </Button>
          <Button variant="outline" size="sm" className="admin-button-secondary" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="admin-button-secondary text-red-600 hover:text-red-700" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

function InterviewCard({ candidate, position, date, time, type, status, onReschedule, onCancel }: {
  candidate: string
  position: string
  date: string
  time: string
  type: string
  status: string
  onReschedule: () => void
  onCancel: () => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "online":
        return <Users className="w-4 h-4" />
      case "offline":
        return <MapPin className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <div className="admin-card admin-glass p-4 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{candidate}</h4>
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{position}</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">{date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">{time}</span>
            </div>
            <div className="flex items-center space-x-1">
              {getTypeIcon(type)}
              <span className="text-gray-600 dark:text-gray-400 capitalize">{type}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {status === "scheduled" && (
            <>
              <Button variant="outline" size="sm" className="admin-button-secondary" onClick={onReschedule}>
                <Edit className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
              <Button variant="outline" size="sm" className="admin-button-secondary text-red-600 hover:text-red-700" onClick={onCancel}>
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
