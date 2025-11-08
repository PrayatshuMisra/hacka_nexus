"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { MessageSquare, Send, Users, Bell, Mail, Smartphone, Eye, Clock, Plus, Settings, Trash2, Repeat, Eye as EyeIcon, Megaphone, User, Bell as BellIcon, FileText, Edit2, PlusCircle, Sliders, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: number
  title: string
  content: string
  type: "announcement" | "direct" | "notification"
  priority: "low" | "medium" | "high"
  audience: string
  status: "draft" | "sent" | "scheduled"
  sentAt?: string
  scheduledFor?: string
  readCount: number
  totalRecipients: number
  channels: string[]
}

interface Template {
  id: number
  name: string
  subject: string
  content: string
  category: string
  usageCount: number
}

export function CommunicationTools() {
  const [messages, setMessages] = useState<Message[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [newMessage, setNewMessage] = useState({
    title: "",
    content: "",
    type: "announcement" as const,
    priority: "medium" as const,
    audience: "all",
    channels: [] as string[],
    scheduledFor: "",
  })
  const [drafts, setDrafts] = useState<Message[]>([])
  const [viewMessage, setViewMessage] = useState<Message | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const { toast } = useToast()
  const [editTemplate, setEditTemplate] = useState<Template | null>(null)
  const [deleteTemplateId, setDeleteTemplateId] = useState<number | null>(null)
  const [newTemplateDialog, setNewTemplateDialog] = useState(false)
  const [newTemplate, setNewTemplate] = useState<{ name: string; subject: string; content: string; category: string }>({ name: '', subject: '', content: '', category: 'Events' })
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sms: false,
    readReceipts: true,
    scheduling: true,
    autoRetry: true,
    maxEmails: 1000,
    maxSms: 500,
  })

  useEffect(() => {

    const mockMessages: Message[] = [
      {
        id: 1,
        title: "System Maintenance Notice",
        content:
          "The NexusSync platform will undergo scheduled maintenance on July 20th from 2:00 AM to 4:00 AM IST. During this time, the system will be temporarily unavailable.",
        type: "announcement",
        priority: "high",
        audience: "All Users",
        status: "sent",
        sentAt: "2025-06-27T10:00:00Z",
        readCount: 457,
        totalRecipients: 484,
        channels: ["email", "push", "sms"],
      },
      {
        id: 2,
        title: "New Club Registration Open",
        content:
          "Registration for new student clubs is now open for the semester. Submit your applications by August 31st.",
        type: "announcement",
        priority: "medium",
        audience: "Students",
        status: "sent",
        sentAt: "2025-06-28T14:30:00Z",
        readCount: 402,
        totalRecipients: 430,
        channels: ["email", "push"],
      },
      {
        id: 3,
        title: "Budget Submission Reminder",
        content: "Club budget proposals for Q2 are due by July 25th. Please ensure all documentation is complete.",
        type: "direct",
        priority: "high",
        audience: "Club Admins",
        status: "scheduled",
        scheduledFor: "2025-06-27T09:00:00Z",
        readCount: 0,
        totalRecipients: 45,
        channels: ["email"],
      },
    ]

    const mockTemplates: Template[] = [
      {
        id: 1,
        name: "Event Approval",
        subject: "Event Proposal Status Update",
        content: "Your event proposal '{EVENT_NAME}' has been {STATUS}. {ADDITIONAL_NOTES}",
        category: "Events",
        usageCount: 15,
      },
      {
        id: 2,
        name: "Budget Notification",
        subject: "Budget Request Update",
        content: "Your budget request of ₹{AMOUNT} for {PURPOSE} has been {STATUS}. {COMMENTS}",
        category: "Finance",
        usageCount: 8,
      },
      {
        id: 3,
        name: "System Maintenance",
        subject: "Scheduled System Maintenance",
        content: "NexusSync will undergo maintenance on {DATE} from {START_TIME} to {END_TIME}. {DETAILS}",
        category: "System",
        usageCount: 12,
      },
      {
        id: 4,
        name: "Welcome Message",
        subject: "Welcome to NexusSync!",
        content: "Welcome to MIT Manipal's club management platform. {GETTING_STARTED_INFO}",
        category: "Onboarding",
        usageCount: 484,
      },
    ]

    setMessages(mockMessages)
    setTemplates(mockTemplates)
  }, [])

  const sendMessage = () => {
    const message: Message = {
      id: messages.length + drafts.length + 1,
      title: newMessage.title,
      content: newMessage.content,
      type: newMessage.type,
      priority: newMessage.priority,
      audience: newMessage.audience,
      status: newMessage.scheduledFor ? "scheduled" : "sent",
      sentAt: newMessage.scheduledFor ? undefined : new Date().toISOString(),
      scheduledFor: newMessage.scheduledFor || undefined,
      readCount: 0,
      totalRecipients: getRecipientCount(newMessage.audience),
      channels: newMessage.channels,
    }
    setMessages((prev) => [message, ...prev])
    setNewMessage({
      title: "",
      content: "",
      type: "announcement",
      priority: "medium",
      audience: "all",
      channels: [],
      scheduledFor: "",
    })
    toast({ title: newMessage.scheduledFor ? "Message Scheduled" : "Message Sent", description: `Your message has been ${newMessage.scheduledFor ? "scheduled" : "sent"}.` })
  }

  const saveDraft = () => {
    const draft: Message = {
      id: messages.length + drafts.length + 1,
      title: newMessage.title,
      content: newMessage.content,
      type: newMessage.type,
      priority: newMessage.priority,
      audience: newMessage.audience,
      status: "draft",
      sentAt: undefined,
      scheduledFor: newMessage.scheduledFor || undefined,
      readCount: 0,
      totalRecipients: getRecipientCount(newMessage.audience),
      channels: newMessage.channels,
    }
    setDrafts((prev) => [draft, ...prev])
    setNewMessage({
      title: "",
      content: "",
      type: "announcement",
      priority: "medium",
      audience: "all",
      channels: [],
      scheduledFor: "",
    })
    toast({ title: "Draft Saved", description: "Your message has been saved as a draft." })
  }

  const getRecipientCount = (audience: string) => {
    switch (audience) {
      case "all":
        return 484
      case "students":
        return 430
      case "club_admins":
        return 45
      case "admins":
        return 9
      default:
        return 0
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const useTemplate = (template: Template) => {
    setNewMessage((prev) => ({
      ...prev,
      title: template.subject,
      content: template.content,
    }))
    setSelectedTemplate(null)
  }

  const resendMessage = (msg: Message) => {
    const newMsg = { ...msg, id: messages.length + drafts.length + 1, sentAt: new Date().toISOString(), status: 'sent' as const } as Message
    setMessages((prev: Message[]) => [newMsg, ...prev])
    toast({ title: "Message Resent", description: `Message '${msg.title}' has been resent.` })
  }

  const deleteMessage = (id: number) => {
    setMessages((prev: Message[]) => prev.filter(m => m.id !== id))
    toast({ title: "Message Deleted", description: "The message has been deleted." })
    setDeleteId(null)
  }

  const handleNewTemplate = () => {

  }

  const handleEditTemplate = (template: Template) => {
 
  }

  const handleDeleteTemplate = (id: number) => {

  }

  const getCategoryIcon = (category: string) => {
 
  }

  const handleSettingsChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    toast({ title: "Settings Saved", description: "Your communication settings have been updated." })
  }

  const handleResetSettings = () => {
    setSettings({
      email: true,
      push: true,
      sms: false,
      readReceipts: true,
      scheduling: true,
      autoRetry: true,
      maxEmails: 1000,
      maxSms: 500,
    })
    toast({ title: "Settings Reset", description: "Settings have been reset to default." })
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated/gradient background for visual depth */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100/60 via-emerald-100/40 to-purple-100/30 dark:from-gray-900/60 dark:via-blue-950/40 dark:to-emerald-950/30 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="admin-stat-card admin-stat-card-blue animate-scale-in glassy-card" style={{ animationDelay: "0.1s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="w-8 h-8 text-white/90" />
                <Badge className="bg-white/20 text-white border-white/30">Total</Badge>
              </div>
              <p className="text-white/80 text-sm font-medium">Total Messages</p>
              <p className="text-3xl font-bold text-white">{messages.length}</p>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-card-green animate-scale-in glassy-card" style={{ animationDelay: "0.2s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Send className="w-8 h-8 text-white/90" />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
              </div>
              <p className="text-white/80 text-sm font-medium">Sent Today</p>
              <p className="text-3xl font-bold text-white">{messages.filter((m) => m.status === "sent").length}</p>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-card-orange animate-scale-in glassy-card" style={{ animationDelay: "0.3s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-white/90" />
                <Badge className="bg-white/20 text-white border-white/30">Scheduled</Badge>
              </div>
              <p className="text-white/80 text-sm font-medium">Scheduled</p>
              <p className="text-3xl font-bold text-white">{messages.filter((m) => m.status === "scheduled").length}</p>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-card-purple animate-scale-in glassy-card" style={{ animationDelay: "0.4s" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-8 h-8 text-white/90" />
                <Badge className="bg-white/20 text-white border-white/30">Read Rate</Badge>
              </div>
              <p className="text-white/80 text-sm font-medium">Avg Read Rate</p>
              <p className="text-3xl font-bold text-white">78%</p>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Tabs */}
        <Tabs defaultValue="compose" className="admin-content-spacing">
          <div className="admin-glass rounded-xl p-2 mb-6">
            <TabsList className="admin-tabs-list w-full grid grid-cols-5 gap-1">
              <TabsTrigger value="compose" className="admin-tabs-trigger flex items-center space-x-2">
                <Plus className="w-4 h-4 animate-bounce" />
                <span>Compose</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="admin-tabs-trigger flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 animate-fade-in" />
                <span>Messages</span>
              </TabsTrigger>
              <TabsTrigger value="drafts" className="admin-tabs-trigger flex items-center space-x-2">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>Drafts</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="admin-tabs-trigger flex items-center space-x-2">
                <Mail className="w-4 h-4 animate-fade-in" />
                <span>Templates</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="admin-tabs-trigger flex items-center space-x-2">
                <Settings className="w-4 h-4 animate-spin-slow" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Compose Tab */}
          <TabsContent value="compose" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up border-2 border-blue-200 dark:border-blue-900/40 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent animate-fade-in-up">
                  <Plus className="w-5 h-5 animate-bounce text-blue-500 dark:text-emerald-400" />
                  <span>Compose Message</span>
                </CardTitle>
                <CardDescription className="text-base text-gray-800 dark:text-gray-200 font-medium mt-2">Send announcements, notifications, or direct messages to users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Message Type */}
                  <div className="space-y-2">
                    <Label htmlFor="message-type" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Message Type</Label>
                    <Select
                      value={newMessage.type}
                      onValueChange={(value: any) => setNewMessage((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="glassy-select border-0 shadow-md text-base font-medium text-gray-900 dark:text-gray-100 tracking-wide">
                        <SelectValue className="text-base font-medium text-gray-900 dark:text-gray-100 tracking-wide" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="direct">Direct Message</SelectItem>
                        <SelectItem value="notification">Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Priority</Label>
                    <Select
                      value={newMessage.priority}
                      onValueChange={(value: any) => setNewMessage((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="glassy-select border-0 shadow-md text-base font-medium text-gray-900 dark:text-gray-100 tracking-wide">
                        <SelectValue className="text-base font-medium text-gray-900 dark:text-gray-100 tracking-wide" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Audience */}
                  <div className="space-y-2">
                    <Label htmlFor="audience" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Audience</Label>
                    <Select
                      value={newMessage.audience}
                      onValueChange={(value) => setNewMessage((prev) => ({ ...prev, audience: value }))}
                    >
                      <SelectTrigger className="glassy-select border-0 shadow-md text-base font-medium text-gray-900 dark:text-gray-100 tracking-wide">
                        <SelectValue className="text-base font-medium text-gray-900 dark:text-gray-100 tracking-wide" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users ({getRecipientCount("all")})</SelectItem>
                        <SelectItem value="students">Students ({getRecipientCount("students")})</SelectItem>
                        <SelectItem value="club_admins">Club Admins ({getRecipientCount("club_admins")})</SelectItem>
                        <SelectItem value="admins">Admins ({getRecipientCount("admins")})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Delivery Channels */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Delivery Channels</Label>
                    <div className="flex items-center space-x-6">
                      {/* Email */}
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="email"
                          checked={newMessage.channels.includes("email")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewMessage((prev) => ({ ...prev, channels: [...prev.channels, "email"] }))
                            } else {
                              setNewMessage((prev) => ({ ...prev, channels: prev.channels.filter((c) => c !== "email") }))
                            }
                          }}
                          className={newMessage.channels.includes("email") ? "bg-green-500 border-green-600" : "bg-red-500 border-red-600"}
                        />
                        <Label htmlFor="email" className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </Label>
                      </div>
                      {/* Push */}
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="push"
                          checked={newMessage.channels.includes("push")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewMessage((prev) => ({ ...prev, channels: [...prev.channels, "push"] }))
                            } else {
                              setNewMessage((prev) => ({ ...prev, channels: prev.channels.filter((c) => c !== "push") }))
                            }
                          }}
                          className={newMessage.channels.includes("push") ? "bg-green-500 border-green-600" : "bg-red-500 border-red-600"}
                        />
                        <Label htmlFor="push" className="flex items-center space-x-1">
                          <Bell className="w-4 h-4" />
                          <span>Push</span>
                        </Label>
                      </div>
                      {/* SMS */}
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="sms"
                          checked={newMessage.channels.includes("sms")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewMessage((prev) => ({ ...prev, channels: [...prev.channels, "sms"] }))
                            } else {
                              setNewMessage((prev) => ({ ...prev, channels: prev.channels.filter((c) => c !== "sms") }))
                            }
                          }}
                          className={newMessage.channels.includes("sms") ? "bg-green-500 border-green-600" : "bg-red-500 border-red-600"}
                        />
                        <Label htmlFor="sms" className="flex items-center space-x-1">
                          <Smartphone className="w-4 h-4" />
                          <span>SMS</span>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Title & Template */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Message Title</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="glass-button animate-fade-in-up">
                          Use Template
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl glassy-card animate-fade-in-up">
                        <DialogHeader>
                          <DialogTitle>Choose Template</DialogTitle>
                          <DialogDescription>Select a pre-built template to get started quickly</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                          {templates.map((template) => (
                            <Card
                              key={template.id}
                              className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 border-2 border-transparent hover:border-blue-400 dark:hover:border-emerald-400 transition-all duration-200 animate-fade-in-up"
                              onClick={() => { useTemplate(template); document.body.click(); }}
                            >
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-blue-700 dark:text-emerald-300">{template.name}</h4>
                                    <Badge variant="secondary">{template.category}</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{template.subject}</p>
                                  <p className="text-xs text-gray-500">Used {template.usageCount} times</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Input
                    id="title"
                    placeholder="Enter message title..."
                    value={newMessage.title}
                    onChange={(e) => setNewMessage((prev) => ({ ...prev, title: e.target.value }))}
                    className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                  />
                </div>
                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Message Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your message content..."
                    rows={6}
                    value={newMessage.content}
                    onChange={(e) => setNewMessage((prev) => ({ ...prev, content: e.target.value }))}
                    className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                  />
                </div>
                {/* Schedule */}
                <div className="space-y-2">
                  <Label htmlFor="schedule" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Schedule (Optional)</Label>
                  <Input
                    id="schedule"
                    type="datetime-local"
                    value={newMessage.scheduledFor}
                    onChange={(e) => setNewMessage((prev) => ({ ...prev, scheduledFor: e.target.value }))}
                    className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                  />
                </div>
                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4">
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.title || !newMessage.content || newMessage.channels.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 glass-button animate-fade-in-up"
                  >
                    <Send className="w-4 h-4 mr-2 animate-pulse" />
                    {newMessage.scheduledFor ? "Schedule Message" : "Send Message"}
                  </Button>
                  <Button variant="outline" onClick={saveDraft} className="glass-button animate-fade-in-up">
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up">
              <CardHeader>
                <CardTitle>Message History</CardTitle>
                <CardDescription>View and manage all sent and scheduled messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{message.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{message.content}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(message.priority)}>{message.priority.toUpperCase()}</Badge>
                          <Badge className={getStatusColor(message.status)}>{message.status.toUpperCase()}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {message.audience}
                          </span>
                          <span className="flex items-center">
                            {message.channels.map((channel, index) => (
                              <span key={index} className="flex items-center mr-2">
                                {channel === "email" && <Mail className="w-4 h-4" />}
                                {channel === "push" && <Bell className="w-4 h-4" />}
                                {channel === "sms" && <Smartphone className="w-4 h-4" />}
                              </span>
                            ))}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          {message.status === "sent" && (
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {message.readCount}/{message.totalRecipients} read
                            </span>
                          )}
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {message.sentAt
                              ? formatDateTime(message.sentAt)
                              : message.scheduledFor
                                ? `Scheduled for ${formatDateTime(message.scheduledFor)}`
                                : "Draft"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drafts Tab */}
          <TabsContent value="drafts" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up">
              <CardHeader>
                <CardTitle>Draft Messages</CardTitle>
                <CardDescription>View and manage your saved drafts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drafts.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400 text-center py-8">No drafts saved.</div>
                  ) : (
                    drafts.map((draft) => (
                      <div key={draft.id} className="border rounded-lg p-4 space-y-3 bg-yellow-50 dark:bg-yellow-900/20 animate-fade-in-up">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">{draft.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{draft.content}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(draft.priority)}>{draft.priority.toUpperCase()}</Badge>
                            <Badge className={getStatusColor(draft.status)}>{draft.status.toUpperCase()}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {draft.audience}
                            </span>
                            <span className="flex items-center">
                              {draft.channels.map((channel, index) => (
                                <span key={index} className="flex items-center mr-2">
                                  {channel === "email" && <Mail className="w-4 h-4" />}
                                  {channel === "push" && <Bell className="w-4 h-4" />}
                                  {channel === "sms" && <Smartphone className="w-4 h-4" />}
                                </span>
                              ))}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {draft.scheduledFor ? `Scheduled for ${formatDateTime(draft.scheduledFor)}` : "Draft"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent animate-fade-in-up">
                      <FileText className="w-5 h-5 animate-pulse text-blue-500 dark:text-emerald-400" />
                      <span>Message Templates</span>
                    </CardTitle>
                    <CardDescription className="text-base text-gray-800 dark:text-gray-200 font-medium mt-2">Manage reusable message templates</CardDescription>
                  </div>
                  <Dialog open={newTemplateDialog} onOpenChange={setNewTemplateDialog}>
                    <DialogTrigger asChild>
                      <Button className="glass-button" onClick={() => setNewTemplateDialog(true)}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl glassy-card animate-fade-in-up">
                      <DialogHeader>
                        <DialogTitle>Create New Template</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input placeholder="Name" value={newTemplate.name} onChange={e => setNewTemplate(t => ({ ...t, name: e.target.value }))} />
                        <Input placeholder="Subject" value={newTemplate.subject} onChange={e => setNewTemplate(t => ({ ...t, subject: e.target.value }))} />
                        <Textarea placeholder="Content" rows={4} value={newTemplate.content} onChange={e => setNewTemplate(t => ({ ...t, content: e.target.value }))} />
                        <Select value={newTemplate.category || 'Events'} onValueChange={v => setNewTemplate(t => ({ ...t, category: v }))}>
                          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Events">Events</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="System">System</SelectItem>
                            <SelectItem value="Onboarding">Onboarding</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button className="w-full" onClick={handleNewTemplate}>Create Template</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {templates.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400 text-center py-8 col-span-2">No templates found.</div>
                  ) : (
                    templates.map((template, idx) => (
                      <div key={template.id} className="border rounded-xl p-6 bg-white/70 dark:bg-gray-900/60 shadow-lg hover:shadow-2xl hover:scale-[1.015] transition-all duration-300 flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {getCategoryIcon(template.category) ?? null}
                            <div>
                              <h4 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                {template.name}
                                <Badge variant="outline">{template.category}</Badge>
                              </h4>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{template.subject}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{template.content}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="glass-button" onClick={() => { useTemplate(template); toast({ title: 'Template Used', description: `Template '${template.name}' loaded into compose.` }) }}>
                              <Repeat className="w-4 h-4 mr-1" /> Use
                            </Button>
                            <Button variant="outline" size="sm" className="glass-button" onClick={() => setEditTemplate(template)}>
                              <Edit2 className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="glass-button bg-red-600 hover:bg-red-700 text-white border-none shadow-md"
                              onClick={() => setDeleteTemplateId(template.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <span>Used {template.usageCount} times</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* Edit Template Dialog */}
                <Dialog open={!!editTemplate} onOpenChange={open => setEditTemplate(open ? editTemplate : null)}>
                  <DialogContent className="max-w-xl glassy-card animate-fade-in-up">
                    <DialogHeader>
                      <DialogTitle>Edit Template</DialogTitle>
                    </DialogHeader>
                    {editTemplate && (
                      <div className="space-y-4">
                        <Input placeholder="Name" value={editTemplate.name} onChange={e => setEditTemplate(t => t ? { ...t, name: e.target.value } : t)} />
                        <Input placeholder="Subject" value={editTemplate.subject} onChange={e => setEditTemplate(t => t ? { ...t, subject: e.target.value } : t)} />
                        <Textarea placeholder="Content" rows={4} value={editTemplate.content} onChange={e => setEditTemplate(t => t ? { ...t, content: e.target.value } : t)} />
                        <Select value={editTemplate.category} onValueChange={v => setEditTemplate(t => t ? { ...t, category: v } : t)}>
                          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Events">Events</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="System">System</SelectItem>
                            <SelectItem value="Onboarding">Onboarding</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button className="w-full" onClick={() => editTemplate && handleEditTemplate(editTemplate)}>Save Changes</Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                {/* Delete Template Dialog */}
                <Dialog open={!!deleteTemplateId} onOpenChange={open => setDeleteTemplateId(open ? deleteTemplateId : null)}>
                  <DialogContent className="max-w-md glassy-card animate-fade-in-up">
                    <DialogHeader>
                      <DialogTitle>Delete Template?</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">Are you sure you want to delete this template? This action cannot be undone.</div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setDeleteTemplateId(null)}>Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteTemplate(deleteTemplateId!)}
                        className="bg-red-600 hover:bg-red-700 text-white border-none shadow-md"
                      >Delete</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent animate-fade-in-up">
                  <Sliders className="w-5 h-5 animate-pulse text-blue-500 dark:text-emerald-400" />
                  <span>Communication Settings</span>
                </CardTitle>
                <CardDescription className="text-base text-gray-800 dark:text-gray-200 font-medium mt-2">Configure notification preferences and delivery settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Notification Channels */}
                <div className="space-y-4 animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <Bell className="w-5 h-5 text-yellow-500" />
                    <Smartphone className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-lg tracking-wide">Default Notification Channels</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email Notifications</span>
                      </div>
                      <Switch checked={settings.email} onCheckedChange={v => handleSettingsChange('email', v)} className={settings.email ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4" />
                        <span>Push Notifications</span>
                      </div>
                      <Switch checked={settings.push} onCheckedChange={v => handleSettingsChange('push', v)} className={settings.push ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <span>SMS Notifications</span>
                      </div>
                      <Switch checked={settings.sms} onCheckedChange={v => handleSettingsChange('sms', v)} className={settings.sms ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'} />
                    </div>
                  </div>
                </div>
                {/* Message Delivery */}
                <div className="space-y-4 animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-2">
                    <Send className="w-5 h-5 text-emerald-500" />
                    <span className="font-semibold text-lg tracking-wide">Message Delivery</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Require read receipts</span>
                      <Switch checked={settings.readReceipts} onCheckedChange={v => handleSettingsChange('readReceipts', v)} className={settings.readReceipts ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Allow message scheduling</span>
                      <Switch checked={settings.scheduling} onCheckedChange={v => handleSettingsChange('scheduling', v)} className={settings.scheduling ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auto-retry failed deliveries</span>
                      <Switch checked={settings.autoRetry} onCheckedChange={v => handleSettingsChange('autoRetry', v)} className={settings.autoRetry ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'} />
                    </div>
                  </div>
                </div>
                {/* Rate Limiting */}
                <div className="space-y-4 animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <span className="font-semibold text-lg tracking-wide">Rate Limiting</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-semibold">Max emails per hour</Label>
                      <Input type="number" value={settings.maxEmails} onChange={e => handleSettingsChange('maxEmails', Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Max SMS per day</Label>
                      <Input type="number" value={settings.maxSms} onChange={e => handleSettingsChange('maxSms', Number(e.target.value))} />
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 animate-fade-in-up">
                  <Button variant="outline" onClick={handleResetSettings} className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Reset
                  </Button>
                  <Button onClick={handleSaveSettings} className="glass-button bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2">
                    <Sliders className="w-4 h-4" /> Save Settings
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
