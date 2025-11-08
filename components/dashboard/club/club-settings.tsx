"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Settings, Users, Bell, Shield, Palette, Upload, Edit, Trash2, Crown, UserPlus, CheckCircle, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function ClubSettings() {
  const [clubInfo, setClubInfo] = useState({
    name: "Indian Society For Technical Education",
    description: "Building the next generation of developers through hands-on workshops, hackathons, and tech talks.",
    email: "iste@manipal.edu",
    website: "https://istemanipal.com",
    socialLinks: {
      instagram: "@iste_mit",
      linkedin: "iste-mit-manipal",
      twitter: "@iste_mit",
    },
  })

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Souvik Goswami",
      email: "souvik.mitmpl@learner.manipal.edu",
      role: "President",
      permissions: ["all"],
      joinDate: "2025-06-26",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Nikhilesh Shashikumar",
      email: "nikhilesh.mitmpl@learner.manipal.edu",
      role: "Vice President",
      permissions: ["manage_events", "manage_members"],
      joinDate: "2025-06-26",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Roopanshi Juneja",
      email: "rropanshi.mitmpl@learner.manipal.edu",
      role: "Secretary",
      permissions: ["manage_events"],
      joinDate: "2025-06-26",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    memberUpdates: false,
    budgetAlerts: true,
  })

  const { toast } = useToast()
  const [addMemberDialog, setAddMemberDialog] = useState(false)
  const [editMemberDialog, setEditMemberDialog] = useState<{open: boolean, member: any|null}>({open: false, member: null})
  const [removeMemberDialog, setRemoveMemberDialog] = useState<{open: boolean, member: any|null}>({open: false, member: null})
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    role: "Member",
    joinDate: "",
    avatar: "",
    avatarFile: null as File | null,
  })
  const [memberFormError, setMemberFormError] = useState("")
  const memberAvatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (addMemberDialog) {
      setMemberForm({ name: "", email: "", role: "Member", joinDate: "", avatar: "", avatarFile: null })
      setMemberFormError("")
    }
  }, [addMemberDialog])
  useEffect(() => {
    if (editMemberDialog.open && editMemberDialog.member) {
      setMemberForm({
        name: editMemberDialog.member.name,
        email: editMemberDialog.member.email,
        role: editMemberDialog.member.role,
        joinDate: editMemberDialog.member.joinDate,
        avatar: editMemberDialog.member.avatar,
        avatarFile: null,
      })
      setMemberFormError("")
    }
  }, [editMemberDialog.open, editMemberDialog.member])

  const handleMemberAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => setMemberForm(f => ({ ...f, avatar: ev.target?.result as string, avatarFile: file }))
      reader.readAsDataURL(file)
    }
  }

  const submitAddMember = () => {
    if (!memberForm.name.trim() || !memberForm.email.trim() || !memberForm.role.trim()) {
      setMemberFormError("Name, Email, and Role are required.")
      return
    }
    handleAddMember({
      name: memberForm.name,
      email: memberForm.email,
      role: memberForm.role,
      joinDate: memberForm.joinDate || new Date().toISOString().split("T")[0],
      avatar: memberForm.avatar,
      permissions: memberForm.role === "President" ? ["all"] : memberForm.role === "Vice President" ? ["manage_events", "manage_members"] : memberForm.role === "Secretary" ? ["manage_events"] : [],
    })
  }
  const submitEditMember = () => {
    if (!memberForm.name.trim() || !memberForm.email.trim() || !memberForm.role.trim()) {
      setMemberFormError("Name, Email, and Role are required.")
      return
    }
    handleEditMember({
      ...editMemberDialog.member,
      name: memberForm.name,
      email: memberForm.email,
      role: memberForm.role,
      joinDate: memberForm.joinDate,
      avatar: memberForm.avatar,
    })
  }

  const handleSaveClubInfo = () => {
    toast({
      title: "Settings Saved",
      description: "Club information has been updated successfully",
    })
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "president":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "vice president":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "secretary":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "treasurer":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => setLogoPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
      toast({ title: "Logo Updated", description: "Preview updated. Save to apply." })
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => setBannerPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
      toast({ title: "Banner Updated", description: "Preview updated. Save to apply." })
    }
  }

  const handleAddMember = (member: any) => {
    setMembers(prev => [...prev, { ...member, id: Date.now() }])
    setAddMemberDialog(false)
    toast({ title: "Member Added", description: `${member.name} added to the club.` })
  }
  const handleEditMember = (member: any) => {
    setMembers(prev => prev.map(m => m.id === member.id ? member : m))
    setEditMemberDialog({open: false, member: null})
    toast({ title: "Member Updated", description: `${member.name}'s details updated.` })
  }
  const handleRemoveMember = (member: any) => {
    setMembers(prev => prev.filter(m => m.id !== member.id))
    setRemoveMemberDialog({open: false, member: null})
    toast({ title: "Member Removed", description: `${member.name} removed from the club.` })
  }

  const [themeColor, setThemeColor] = useState("blue")
  const handleThemeColor = (color: string) => {
    setThemeColor(color)
    toast({ title: "Theme Color Changed", description: `Theme color set to ${color}.` })
  }

  return (
    <div className="space-y-8">
      <div className="admin-card admin-glass-strong p-0 animate-fade-in-up relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200/40 via-blue-100/30 to-green-100/20 dark:from-gray-900/60 dark:via-gray-800/50 dark:to-blue-900/30 pointer-events-none z-0" />
        <div className="relative z-10 flex items-center justify-between px-8 pt-8 pb-4">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent drop-shadow-lg animate-fade-in-up">
            Club Settings
          </h2>
          <Button onClick={handleSaveClubInfo} className="admin-button-primary bg-gradient-to-r from-purple-500 to-green-600 hover:from-purple-600 hover:to-green-700 shadow-lg animate-fade-in-up">
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4 animate-fade-in-up delay-100">
        <TabsList className="admin-tabs-list grid w-full grid-cols-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-md rounded-2xl overflow-hidden">
          <TabsTrigger value="general" className="transition-colors duration-200 hover:bg-purple-100/40 dark:hover:bg-purple-900/20 club-card-glow">General</TabsTrigger>
          <TabsTrigger value="members" className="transition-colors duration-200 hover:bg-blue-100/40 dark:hover:bg-blue-900/20 club-card-glow">Members</TabsTrigger>
          <TabsTrigger value="notifications" className="transition-colors duration-200 hover:bg-green-100/40 dark:hover:bg-green-900/20 club-card-glow">Notifications</TabsTrigger>
          <TabsTrigger value="permissions" className="transition-colors duration-200 hover:bg-yellow-100/40 dark:hover:bg-yellow-900/20 club-card-glow">Permissions</TabsTrigger>
          <TabsTrigger value="appearance" className="transition-colors duration-200 hover:bg-orange-100/40 dark:hover:bg-orange-900/20 club-card-glow">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="admin-card admin-glass p-0 shadow-lg animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20 ring-4 ring-purple-300 dark:ring-purple-700 animate-fade-in">
                  <AvatarImage src={logoPreview || "/placeholder.svg?height=80&width=80"} />
                  <AvatarFallback>GD</AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                  <Button variant="outline" size="sm" className="admin-button-secondary" onClick={() => logoInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Change Logo
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">Recommended: 200x200px, PNG or JPG</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="club-name">Club Name</Label>
                  <Input
                    id="club-name"
                    value={clubInfo.name}
                    onChange={(e) => setClubInfo({ ...clubInfo, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="club-email">Official Email</Label>
                  <Input
                    id="club-email"
                    type="email"
                    value={clubInfo.email}
                    onChange={(e) => setClubInfo({ ...clubInfo, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="club-description">Description</Label>
                <Textarea
                  id="club-description"
                  value={clubInfo.description}
                  onChange={(e) => setClubInfo({ ...clubInfo, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="club-website">Website</Label>
                <Input
                  id="club-website"
                  value={clubInfo.website}
                  onChange={(e) => setClubInfo({ ...clubInfo, website: e.target.value })}
                  placeholder="https://your-club-website.com"
                />
              </div>

              <div>
                <Label>Social Media Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="instagram" className="text-sm">
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={clubInfo.socialLinks.instagram}
                      onChange={(e) =>
                        setClubInfo({
                          ...clubInfo,
                          socialLinks: { ...clubInfo.socialLinks, instagram: e.target.value },
                        })
                      }
                      placeholder="@your_handle"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin" className="text-sm">
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={clubInfo.socialLinks.linkedin}
                      onChange={(e) =>
                        setClubInfo({
                          ...clubInfo,
                          socialLinks: { ...clubInfo.socialLinks, linkedin: e.target.value },
                        })
                      }
                      placeholder="company-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter" className="text-sm">
                      Twitter
                    </Label>
                    <Input
                      id="twitter"
                      value={clubInfo.socialLinks.twitter}
                      onChange={(e) =>
                        setClubInfo({
                          ...clubInfo,
                          socialLinks: { ...clubInfo.socialLinks, twitter: e.target.value },
                        })
                      }
                      placeholder="@your_handle"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card className="admin-card admin-glass p-0 shadow-lg animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Member Management
                </div>
                <Button size="sm" className="admin-button-primary bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 animate-fade-in" onClick={() => setAddMemberDialog(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-white/60 to-purple-50/60 dark:from-gray-900/40 dark:to-purple-900/30 shadow-sm hover:scale-[1.02] transition-transform duration-200 animate-fade-in"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12 ring-2 ring-blue-400 animate-fade-in">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{member.name}</h4>
                          {member.role === "President" && <Crown className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                          <span className="text-xs text-gray-500">
                            Joined {new Date(member.joinDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" className="admin-button-secondary" onClick={() => setEditMemberDialog({open: true, member})}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Member</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" className="admin-button-secondary" onClick={() => setRemoveMemberDialog({open: true, member})}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove Member</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="admin-card admin-glass p-0 shadow-lg animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                </div>
                <Switch
                  className="club-switch-notification"
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications in browser</p>
                </div>
                <Switch
                  className="club-switch-notification"
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Event Reminders</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get reminded about upcoming events</p>
                </div>
                <Switch
                  className="club-switch-notification"
                  checked={notifications.eventReminders}
                  onCheckedChange={(checked) => handleNotificationChange("eventReminders", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Member Updates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Notifications about new members and updates
                  </p>
                </div>
                <Switch
                  className="club-switch-notification"
                  checked={notifications.memberUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("memberUpdates", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Budget Alerts</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Alerts about budget approvals and spending</p>
                </div>
                <Switch
                  className="club-switch-notification"
                  checked={notifications.budgetAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("budgetAlerts", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* President */}
            <Card className="admin-card admin-glass bg-gradient-to-br from-purple-100/60 to-blue-100/40 dark:from-purple-900/30 dark:to-blue-900/20 p-0 shadow-xl animate-fade-in-up">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Crown className="w-7 h-7 text-yellow-500 animate-bounce" />
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent">President</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 animate-scale-in">All Permissions</Badge>
                </div>
              </CardContent>
            </Card>
            {/* Vice President */}
            <Card className="admin-card admin-glass bg-gradient-to-br from-blue-100/60 to-green-100/40 dark:from-blue-900/30 dark:to-green-900/20 p-0 shadow-xl animate-fade-in-up delay-100">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Shield className="w-7 h-7 text-blue-500 animate-pulse" />
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Vice President</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="animate-scale-in">Manage Events</Badge>
                  <Badge variant="secondary" className="animate-scale-in delay-75">Manage Members</Badge>
                  <Badge variant="secondary" className="animate-scale-in delay-150">View Analytics</Badge>
                  <Badge variant="secondary" className="animate-scale-in delay-200">Manage Content</Badge>
                </div>
              </CardContent>
            </Card>
            {/* Secretary */}
            <Card className="admin-card admin-glass bg-gradient-to-br from-green-100/60 to-yellow-100/40 dark:from-green-900/30 dark:to-yellow-900/20 p-0 shadow-xl animate-fade-in-up delay-200">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Users className="w-7 h-7 text-green-500 animate-pulse" />
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">Secretary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="animate-scale-in">Manage Events</Badge>
                  <Badge variant="secondary" className="animate-scale-in delay-75">View Analytics</Badge>
                  <Badge variant="secondary" className="animate-scale-in delay-150">Manage Content</Badge>
                </div>
              </CardContent>
            </Card>
            {/* Member */}
            <Card className="admin-card admin-glass bg-gradient-to-br from-gray-100/60 to-orange-100/40 dark:from-gray-900/30 dark:to-orange-900/20 p-0 shadow-xl animate-fade-in-up delay-300">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <UserPlus className="w-7 h-7 text-orange-500 animate-pulse" />
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-gray-500 bg-clip-text text-transparent">Member</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="animate-scale-in">View Events</Badge>
                  <Badge variant="outline" className="animate-scale-in delay-75">View Content</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="admin-card admin-glass bg-gradient-to-br from-orange-100/60 via-blue-100/30 to-green-100/20 dark:from-gray-900/60 dark:via-gray-800/50 dark:to-blue-900/30 p-0 shadow-xl animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Club Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Theme Color Selection */}
              <div>
                <Label className="text-base font-semibold mb-2">Club Theme Color</Label>
                <div className="flex items-center space-x-4 mt-4">
                  {["blue","purple","green","orange","red"].map(color => (
                    <div
                      key={color}
                      className={`w-12 h-12 rounded-xl border-4 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-md bg-${color}-500 ${themeColor===color?`border-${color}-600 scale-110 ring-2 ring-${color}-300`:'border-transparent'} hover:scale-105`}
                      onClick={() => handleThemeColor(color)}
                      style={{ boxShadow: themeColor===color ? '0 0 0 4px rgba(0,0,0,0.08)' : undefined }}
                    >
                      {themeColor===color && <CheckCircle className="w-6 h-6 text-white drop-shadow" />}
                    </div>
                  ))}
                </div>
              </div>
              {/* Banner Upload */}
              <div>
                <Label htmlFor="banner-upload" className="text-base font-semibold mb-2">Club Banner</Label>
                <div className="mt-4 border-2 border-dashed border-gradient-to-r from-blue-400 via-green-400 to-orange-400 dark:from-blue-700 dark:via-green-700 dark:to-orange-700 rounded-2xl p-8 text-center relative shadow-inner group transition-all duration-200 bg-transparent">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleBannerChange}
                    style={{ zIndex: 2 }}
                  />
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner Preview" className="mx-auto mb-4 rounded-xl max-h-40 object-cover shadow-lg transition-all duration-200" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-200 animate-bounce" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Click or drag to upload</p>
                      <p className="text-xs text-gray-500 mt-1">Recommended: 1200x400px, PNG or JPG</p>
                    </>
                  )}
                </div>
              </div>
              {/* Display Options */}
              <div>
                <Label className="text-base font-semibold mb-2">Display Options</Label>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50/60 to-green-50/40 dark:from-blue-900/20 dark:to-green-900/10 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-400" />
                      <div>
                        <h4 className="font-medium">Show Member Count</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Display member count on club profile</p>
                      </div>
                    </div>
                    <Switch defaultChecked className="club-switch-notification" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50/60 to-orange-50/40 dark:from-purple-900/20 dark:to-orange-900/10 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <div>
                        <h4 className="font-medium">Show Event History</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Display past events on club profile</p>
                      </div>
                    </div>
                    <Switch defaultChecked className="club-switch-notification" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50/60 to-blue-50/40 dark:from-green-900/20 dark:to-blue-900/10 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-green-400" />
                      <div>
                        <h4 className="font-medium">Show Social Links</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Display social media links</p>
                      </div>
                    </div>
                    <Switch defaultChecked className="club-switch-notification" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={addMemberDialog} onOpenChange={setAddMemberDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Member</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {memberFormError && <div className="text-red-600 text-sm font-medium">{memberFormError}</div>}
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 ring-2 ring-blue-400">
                <AvatarImage src={memberForm.avatar || "/placeholder.svg?height=40&width=40"} />
                <AvatarFallback>{memberForm.name.slice(0,2) || "MM"}</AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                ref={memberAvatarInputRef}
                className="hidden"
                onChange={handleMemberAvatarChange}
              />
              <Button variant="outline" size="sm" onClick={() => memberAvatarInputRef.current?.click()}>Upload Avatar</Button>
            </div>
            <div>
              <Label>Name *</Label>
              <Input value={memberForm.name} onChange={e => setMemberForm(f => ({...f, name: e.target.value}))} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input value={memberForm.email} onChange={e => setMemberForm(f => ({...f, email: e.target.value}))} />
            </div>
            <div>
              <Label>Role *</Label>
              <select className="admin-input w-full" value={memberForm.role} onChange={e => setMemberForm(f => ({...f, role: e.target.value}))}>
                <option>President</option>
                <option>Vice President</option>
                <option>Secretary</option>
                <option>Treasurer</option>
                <option>Member</option>
              </select>
            </div>
            <div>
              <Label>Join Date</Label>
              <Input type="date" value={memberForm.joinDate} onChange={e => setMemberForm(f => ({...f, joinDate: e.target.value}))} />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setAddMemberDialog(false)}>Cancel</Button>
              <Button onClick={submitAddMember} className="admin-button-primary">Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={editMemberDialog.open} onOpenChange={open => setEditMemberDialog({open, member: editMemberDialog.member})}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Member</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {memberFormError && <div className="text-red-600 text-sm font-medium">{memberFormError}</div>}
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 ring-2 ring-blue-400">
                <AvatarImage src={memberForm.avatar || "/placeholder.svg?height=40&width=40"} />
                <AvatarFallback>{memberForm.name.slice(0,2) || "MM"}</AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                ref={memberAvatarInputRef}
                className="hidden"
                onChange={handleMemberAvatarChange}
              />
              <Button variant="outline" size="sm" onClick={() => memberAvatarInputRef.current?.click()}>Upload Avatar</Button>
            </div>
            <div>
              <Label>Name *</Label>
              <Input value={memberForm.name} onChange={e => setMemberForm(f => ({...f, name: e.target.value}))} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input value={memberForm.email} onChange={e => setMemberForm(f => ({...f, email: e.target.value}))} />
            </div>
            <div>
              <Label>Role *</Label>
              <select className="admin-input w-full" value={memberForm.role} onChange={e => setMemberForm(f => ({...f, role: e.target.value}))}>
                <option>President</option>
                <option>Vice President</option>
                <option>Secretary</option>
                <option>Treasurer</option>
                <option>Member</option>
              </select>
            </div>
            <div>
              <Label>Join Date</Label>
              <Input type="date" value={memberForm.joinDate} onChange={e => setMemberForm(f => ({...f, joinDate: e.target.value}))} />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setEditMemberDialog({open: false, member: null})}>Cancel</Button>
              <Button onClick={submitEditMember} className="admin-button-primary">Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={removeMemberDialog.open} onOpenChange={open => setRemoveMemberDialog({open, member: removeMemberDialog.member})}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove Member</DialogTitle></DialogHeader>
          <div>Are you sure you want to remove {removeMemberDialog.member?.name}?</div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setRemoveMemberDialog({open: false, member: null})}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleRemoveMember(removeMemberDialog.member)}>Remove</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
