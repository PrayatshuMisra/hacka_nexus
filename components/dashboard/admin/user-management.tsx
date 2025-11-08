"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  UserPlus,
  GraduationCap,
  Building,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  name: string
  email: string
  role: "student" | "club_admin" | "admin"
  status: "active" | "inactive" | "suspended"
  registrationNumber?: string
  department?: string
  yearOfStudy?: number
  clubMemberships?: string[]
  joinDate: string
  lastActive: string
  avatar?: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { toast } = useToast()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<Partial<User>>({ role: "student", status: "active" })

  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: "Prayatshu Misra",
        email: "prayatshu.mitmpl2024@learner.manipal.edu",
        role: "student",
        status: "active",
        registrationNumber: "240962386",
        department: "Computer Science Engineering",
        yearOfStudy: 1,
        clubMemberships: ["ISTE MIT Manipal", "IECSE Club"],
        joinDate: "2025-06-26",
        lastActive: "2025-06-28T10:30:00Z",
      },
      {
        id: 2,
        name: "Rohan Mathur",
        email: "rohan2.mitmpl@learner.manipal.edu",
        role: "student",
        status: "active",
        registrationNumber: "240911196",
        department: "Information Technology",
        yearOfStudy: 2,
        clubMemberships: ["Chords n Co. MIT", "Literary Club"],
        joinDate: "2025-06-27",
        lastActive: "2025-06-28T16:45:00Z",
      },
      {
        id: 3,
        name: "Dr. Poornima Kundapur",
        email: "swo@manipal.edu",
        role: "admin",
        status: "active",
        department: "Student Affairs",
        joinDate: "2025-06-26",
        lastActive: "2025-06-26T09:15:00Z",
      },
      {
        id: 4,
        name: "ISTE President",
        email: "iste@manipal.edu",
        role: "club_admin",
        status: "active",
        clubMemberships: ["ISTE MIT Manipal"],
        joinDate: "2025-06-26",
        lastActive: "2025-06-28T11:20:00Z",
      },
      {
        id: 5,
        name: "mehran Dhakray",
        email: "mehran@learner.manipal.edu",
        role: "student",
        status: "inactive",
        registrationNumber: "240962344",
        department: "Computer Sciemce and Engineering",
        yearOfStudy: 2,
        clubMemberships: ["Robotics Club"],
        joinDate: "2025-06-26",
        lastActive: "2025-06-28T14:30:00Z",
      },
    ]

    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
  }, [])

  useEffect(() => {
    let filtered = users

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => user.status === filterStatus)
    }

    setFilteredUsers(filtered)
  }, [users, searchQuery, filterRole, filterStatus])

  const toggleUserStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  const deleteUser = (userId: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "club_admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "student":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const students = users.filter((u) => u.role === "student").length
  const clubAdmins = users.filter((u) => u.role === "club_admin").length
  const admins = users.filter((u) => u.role === "admin").length

  const handleExport = () => {
    const headers = ["Name", "Email", "Role", "Status", "Registration", "Department", "Year", "Clubs", "Joined", "Last Active"]
    const rows = filteredUsers.map(u => [
      u.name,
      u.email,
      u.role,
      u.status,
      u.registrationNumber || "",
      u.department || "",
      u.yearOfStudy || "",
      u.clubMemberships ? u.clubMemberships.join(";") : "",
      u.joinDate,
      u.lastActive
    ])
    const csv = [headers, ...rows].map(row => row.map(String).map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Exported", description: "User list exported as CSV." })
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({ title: "Missing Fields", description: "Name and Email are required.", variant: "destructive" })
      return
    }
    setUsers(prev => [
      ...prev,
      {
        ...newUser,
        id: Date.now(),
        clubMemberships: newUser.clubMemberships ? newUser.clubMemberships : [],
        joinDate: newUser.joinDate || new Date().toISOString().slice(0, 10),
        lastActive: new Date().toISOString(),
        avatar: newUser.avatar || undefined,
      } as User
    ])
    setAddDialogOpen(false)
    setNewUser({ role: "student", status: "active" })
    toast({ title: "User Added", description: "New user has been added." })
  }

  const handleEditUser = () => {
    if (!editUser?.name || !editUser?.email) {
      toast({ title: "Missing Fields", description: "Name and Email are required.", variant: "destructive" })
      return
    }
    setUsers(prev => prev.map(u => u.id === editUser.id ? { ...editUser } as User : u))
    setEditDialogOpen(false)
    setEditUser(null)
    toast({ title: "User Updated", description: "User details updated." })
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="glassy-card animate-scale-in bg-gradient-to-br from-blue-100/80 to-indigo-100/60 dark:from-blue-900/40 dark:to-indigo-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glassy-card animate-scale-in bg-gradient-to-br from-green-100/80 to-emerald-100/60 dark:from-green-900/40 dark:to-emerald-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glassy-card animate-scale-in bg-gradient-to-br from-blue-100/80 to-cyan-100/60 dark:from-blue-900/40 dark:to-cyan-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">Students</p>
                <p className="text-2xl font-bold text-blue-600">{students}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glassy-card animate-scale-in bg-gradient-to-br from-purple-100/80 to-pink-100/60 dark:from-purple-900/40 dark:to-pink-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">Club Admins</p>
                <p className="text-2xl font-bold text-purple-600">{clubAdmins}</p>
              </div>
              <Building className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glassy-card animate-scale-in bg-gradient-to-br from-red-100/80 to-orange-100/60 dark:from-red-900/40 dark:to-orange-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">Admins</p>
                <p className="text-2xl font-bold text-red-600">{admins}</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <Card className="admin-glass-strong rounded-xl p-4 mb-6 animate-fade-in-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>User Management</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl glassy-card animate-fade-in-up">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Name" value={newUser.name || ""} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                    <Input placeholder="Email" value={newUser.email || ""} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                    <Select value={newUser.role || "student"} onValueChange={v => setNewUser({ ...newUser, role: v as User["role"] })}>
                      <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="club_admin">Club Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={newUser.status || "active"} onValueChange={v => setNewUser({ ...newUser, status: v as User["status"] })}>
                      <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Registration Number" value={newUser.registrationNumber || ""} onChange={e => setNewUser({ ...newUser, registrationNumber: e.target.value })} />
                    <Input placeholder="Department" value={newUser.department || ""} onChange={e => setNewUser({ ...newUser, department: e.target.value })} />
                    <Input placeholder="Year of Study" type="number" value={newUser.yearOfStudy || ""} onChange={e => setNewUser({ ...newUser, yearOfStudy: Number(e.target.value) })} />
                    <Input placeholder="Club Memberships (comma separated)" value={newUser.clubMemberships ? newUser.clubMemberships.join(", ") : ""} onChange={e => setNewUser({ ...newUser, clubMemberships: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
                    <Input placeholder="Joined Date" type="date" value={newUser.joinDate || ""} onChange={e => setNewUser({ ...newUser, joinDate: e.target.value })} />
                    <Button className="w-full" onClick={handleAddUser}>Add User</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center bg-white/60 dark:bg-gray-900/60 rounded-lg px-3 relative">
              <Search className="w-4 h-4 text-blue-500 mr-2 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nexus-input border-0 bg-transparent shadow-none pl-10"
              />
            </div>
            <div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="nexus-input w-full glassy-select">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="club_admin">Club Admins</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="nexus-input w-full glassy-select">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glassy-card animate-fade-in-up">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={cn(
                      "hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200",
                      user.status === "active" ? "border-l-4 border-l-green-400" : "border-l-4 border-l-gray-300 dark:border-l-gray-700"
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 shadow-md">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            {user.name}
                            {user.status === "active" && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          {user.registrationNumber && (
                            <div className="text-xs text-gray-400">{user.registrationNumber}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRoleColor(user.role) + " flex items-center gap-1"}>
                        {user.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                        {user.role === "club_admin" && <Building className="w-3 h-3 mr-1" />}
                        {user.role === "student" && <GraduationCap className="w-3 h-3 mr-1" />}
                        {user.role.replace("_", " ").toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(user.status) + " flex items-center gap-1"}>
                        {user.status === "active" && <UserCheck className="w-3 h-3 mr-1" />}
                        {user.status === "inactive" && <UserX className="w-3 h-3 mr-1" />}
                        {user.status === "suspended" && <X className="w-3 h-3 mr-1" />}
                        {user.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.department || "-"}
                      {user.yearOfStudy && <div className="text-xs text-gray-500">Year {user.yearOfStudy}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatLastActive(user.lastActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl glassy-card animate-fade-in-up">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>Detailed information about {selectedUser?.name}</DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-16 w-16 shadow-lg">
                                    <AvatarImage
                                      src={selectedUser.avatar || "/placeholder.svg"}
                                      alt={selectedUser.name}
                                    />
                                    <AvatarFallback className="text-lg">
                                      {selectedUser.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                      {selectedUser.name}
                                      {selectedUser.status === "active" && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <Badge className={getRoleColor(selectedUser.role) + " flex items-center gap-1"}>
                                        {selectedUser.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                                        {selectedUser.role === "club_admin" && <Building className="w-3 h-3 mr-1" />}
                                        {selectedUser.role === "student" && <GraduationCap className="w-3 h-3 mr-1" />}
                                        {selectedUser.role.replace("_", " ").toUpperCase()}
                                      </Badge>
                                      <Badge className={getStatusColor(selectedUser.status) + " flex items-center gap-1"}>
                                        {selectedUser.status === "active" && <UserCheck className="w-3 h-3 mr-1" />}
                                        {selectedUser.status === "inactive" && <UserX className="w-3 h-3 mr-1" />}
                                        {selectedUser.status === "suspended" && <X className="w-3 h-3 mr-1" />}
                                        {selectedUser.status.toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="glassy-card p-4 rounded-xl">
                                    <h4 className="font-semibold mb-2">Basic Information</h4>
                                    <div className="space-y-2 text-sm">
                                      {selectedUser.registrationNumber && (
                                        <p>
                                          <span className="font-medium">Registration:</span>{" "}
                                          {selectedUser.registrationNumber}
                                        </p>
                                      )}
                                      {selectedUser.department && (
                                        <p>
                                          <span className="font-medium">Department:</span> {selectedUser.department}
                                        </p>
                                      )}
                                      {selectedUser.yearOfStudy && (
                                        <p>
                                          <span className="font-medium">Year:</span> {selectedUser.yearOfStudy}
                                        </p>
                                      )}
                                      <p>
                                        <span className="font-medium">Joined:</span>{" "}
                                        {new Date(selectedUser.joinDate).toLocaleDateString()}
                                      </p>
                                      <p>
                                        <span className="font-medium">Last Active:</span>{" "}
                                        {formatLastActive(selectedUser.lastActive)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="glassy-card p-4 rounded-xl">
                                    <h4 className="font-semibold mb-2">Club Memberships</h4>
                                    <div className="space-y-1">
                                      {selectedUser.clubMemberships && selectedUser.clubMemberships.length > 0 ? (
                                        selectedUser.clubMemberships.map((club, index) => (
                                          <Badge key={index} variant="outline" className="mr-1 mb-1">
                                            {club}
                                          </Badge>
                                        ))
                                      ) : (
                                        <p className="text-sm text-gray-500">No club memberships</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button variant="ghost" size="sm" onClick={() => toggleUserStatus(user.id)}>
                          {user.status === "active" ? (
                            <UserX className="w-4 h-4 text-red-500" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-green-500" />
                          )}
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => { setEditUser(user); setEditDialogOpen(true); }}>
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => deleteUser(user.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-xl glassy-card animate-fade-in-up">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <Input placeholder="Name" value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} />
              <Input placeholder="Email" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
              <Select value={editUser.role} onValueChange={v => setEditUser({ ...editUser, role: v as User["role"] })}>
                <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="club_admin">Club Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={editUser.status} onValueChange={v => setEditUser({ ...editUser, status: v as User["status"] })}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Registration Number" value={editUser.registrationNumber || ""} onChange={e => setEditUser({ ...editUser, registrationNumber: e.target.value })} />
              <Input placeholder="Department" value={editUser.department || ""} onChange={e => setEditUser({ ...editUser, department: e.target.value })} />
              <Input placeholder="Year of Study" type="number" value={editUser.yearOfStudy || ""} onChange={e => setEditUser({ ...editUser, yearOfStudy: Number(e.target.value) })} />
              <Input placeholder="Club Memberships (comma separated)" value={editUser.clubMemberships ? editUser.clubMemberships.join(", ") : ""} onChange={e => setEditUser({ ...editUser, clubMemberships: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
              <Input placeholder="Joined Date" type="date" value={editUser.joinDate || ""} onChange={e => setEditUser({ ...editUser, joinDate: e.target.value })} />
              <Button className="w-full" onClick={handleEditUser}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
