"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Settings,
  Shield,
  Clock,
  Bell,
  Database,
  Activity,
  CheckCircle,
  Server,
  HardDrive,
  Cpu,
  Wifi,
  Mail,
  Smartphone,
  Sliders,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    general: {
      siteName: "NexusSync",
      timezone: "Asia/Kolkata",
      maintenanceMode: false,
      registrationOpen: true,
      maxClubsPerStudent: 5,
    },
    events: {
      requireApproval: true,
      advanceNotice: 7,
      maxDuration: 8,
      allowConflicts: false,
      autoReminders: true,
    },
    budget: {
      fiscalYearStart: "April",
      defaultBudgetLimit: 50000,
      requireApproval: true,
      approvalThreshold: 10000,
      allowOverspend: false,
    },
    security: {
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireTwoFactor: false,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      digestFrequency: "daily",
    },
    systems: {
      enableBackups: true,
      maintenanceMode: false,
      enableMonitoring: true,
      autoUpdates: true,
    },
  });

  const defaultSettings = {
    general: {
      siteName: "NexusSync",
      timezone: "Asia/Kolkata",
      maintenanceMode: false,
      registrationOpen: true,
      maxClubsPerStudent: 5,
    },
    events: {
      requireApproval: true,
      advanceNotice: 7,
      maxDuration: 8,
      allowConflicts: false,
      autoReminders: true,
    },
    budget: {
      fiscalYearStart: "April",
      defaultBudgetLimit: 50000,
      requireApproval: true,
      approvalThreshold: 10000,
      allowOverspend: false,
    },
    security: {
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireTwoFactor: false,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      digestFrequency: "daily",
    },
    systems: {
      enableBackups: true,
      maintenanceMode: false,
      enableMonitoring: true,
      autoUpdates: true,
    },
  };

  const [systemHealth, setSystemHealth] = useState({
    uptime: "99.9%",
    responseTime: "120ms",
    activeUsers: 1847,
    systemLoad: 45,
    memoryUsage: 68,
    diskUsage: 34,
    networkStatus: "healthy",
  });

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const saveSettings = () => {

    toast({ title: "Settings Saved", description: "All changes have been applied.", variant: "success" });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    toast({ title: "Settings Reset", description: "All settings have been reset to default.", variant: "success" });
  };

  const getHealthColor = (value: number) => {
    if (value < 50) return "text-green-600";
    if (value < 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthBgColor = (value: number) => {
    if (value < 50) return "bg-green-500";
    if (value < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated/gradient background for visual depth */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100/60 via-emerald-100/40 to-purple-100/30 dark:from-gray-900/60 dark:via-blue-950/40 dark:to-emerald-950/30 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Sticky Glassy Header */}
        <div className="sticky top-0 z-20 admin-glass-strong rounded-2xl p-6 mb-8 animate-slide-in-top shadow-2xl border border-blue-200 dark:border-blue-900/40 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  System Administration
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Configure system settings and monitor platform health</p>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="admin-tabs-list w-full grid grid-cols-6 gap-1 mb-4">
            <TabsTrigger value="general" className="admin-tabs-trigger flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="admin-tabs-trigger flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger value="budget" className="admin-tabs-trigger flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Budget</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="admin-tabs-trigger flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="admin-tabs-trigger flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="systems" className="admin-tabs-trigger flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>System</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up border-2 border-blue-200 dark:border-blue-900/40 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent animate-fade-in-up">
                  <Settings className="w-5 h-5 animate-pulse text-blue-500 dark:text-emerald-400" />
                  <span>General Settings</span>
                </CardTitle>
                <CardDescription className="text-base text-gray-800 dark:text-gray-200 font-medium mt-2">Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.general.siteName}
                      onChange={(e) => { updateSetting("general", "siteName", e.target.value); toast({ title: "Site Name Updated", description: `Site name set to '${e.target.value}'` }); }}
                      className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Timezone</Label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) => { updateSetting("general", "timezone", value); toast({ title: "Timezone Updated", description: `Timezone set to '${value}'` }); }}
                    >
                      <SelectTrigger className="glassy-select border-0 shadow-md text-base font-medium text-gray-900 dark:text-gray-100 tracking-wide">
                        <SelectValue className="text-base font-medium text-gray-900 dark:text-gray-100 tracking-wide" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-lg px-4 py-3 shadow-inner hover:shadow-lg transition-all">
                    <div>
                      <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100">Maintenance Mode</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Temporarily disable access to the platform</p>
                    </div>
                    <Switch
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(checked) => { updateSetting("general", "maintenanceMode", checked); toast({ title: checked ? "Maintenance Enabled" : "Maintenance Disabled", description: checked ? "The platform is now in maintenance mode." : "Maintenance mode is off." }); }}
                      className={settings.general.maintenanceMode ? "bg-red-500 border-red-600" : "bg-green-500 border-green-600"}
                    />
                  </div>
                  <div className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-lg px-4 py-3 shadow-inner hover:shadow-lg transition-all">
                    <div>
                      <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100">Registration Open</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Allow new user registrations</p>
                    </div>
                    <Switch
                      checked={settings.general.registrationOpen}
                      onCheckedChange={(checked) => { updateSetting("general", "registrationOpen", checked); toast({ title: checked ? "Registration Opened" : "Registration Closed", description: checked ? "New user registrations are now allowed." : "Registrations are now closed." }); }}
                      className={settings.general.registrationOpen ? "bg-green-500 border-green-600" : "bg-red-500 border-red-600"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxClubs" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Maximum Clubs per Student</Label>
                  <Input
                    id="maxClubs"
                    type="number"
                    value={settings.general.maxClubsPerStudent}
                    onChange={(e) => { updateSetting("general", "maxClubsPerStudent", Number.parseInt(e.target.value)); toast({ title: "Max Clubs Updated", description: `Max clubs per student set to ${e.target.value}` }); }}
                    className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up border-2 border-emerald-200 dark:border-emerald-900/40 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-500 bg-clip-text text-transparent animate-fade-in-up">
                  <Bell className="w-5 h-5 animate-pulse text-emerald-500 dark:text-blue-400" />
                  <span>Event Management Settings</span>
                </CardTitle>
                <CardDescription className="text-base text-gray-800 dark:text-gray-200 font-medium mt-2">Configure event approval and scheduling rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-lg px-4 py-3 shadow-inner hover:shadow-lg transition-all">
                    <div>
                      <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100">Require Event Approval</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">All events must be approved by administrators</p>
                    </div>
                    <Switch
                      checked={settings.events.requireApproval}
                      onCheckedChange={(checked) => { updateSetting("events", "requireApproval", checked); toast({ title: checked ? "Event Approval Required" : "Event Approval Not Required", description: checked ? "All events now require admin approval." : "Events can be created without approval." }); }}
                      className={settings.events.requireApproval ? "bg-emerald-500 border-emerald-600" : "bg-gray-400 border-gray-500"}
                    />
                  </div>
                  <div className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-lg px-4 py-3 shadow-inner hover:shadow-lg transition-all">
                    <div>
                      <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100">Allow Schedule Conflicts</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Permit overlapping events</p>
                    </div>
                    <Switch
                      checked={settings.events.allowConflicts}
                      onCheckedChange={(checked) => { updateSetting("events", "allowConflicts", checked); toast({ title: checked ? "Conflicts Allowed" : "Conflicts Not Allowed", description: checked ? "Overlapping events are now permitted." : "Event conflicts are now prevented." }); }}
                      className={settings.events.allowConflicts ? "bg-yellow-500 border-yellow-600" : "bg-emerald-500 border-emerald-600"}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-lg px-4 py-3 shadow-inner hover:shadow-lg transition-all">
                  <div>
                    <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100">Automatic Reminders</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Send event reminders to participants</p>
                  </div>
                  <Switch
                    checked={settings.events.autoReminders}
                    onCheckedChange={(checked) => { updateSetting("events", "autoReminders", checked); toast({ title: checked ? "Reminders Enabled" : "Reminders Disabled", description: checked ? "Automatic event reminders will be sent." : "Event reminders are now off." }); }}
                    className={settings.events.autoReminders ? "bg-emerald-500 border-emerald-600" : "bg-gray-400 border-gray-500"}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="advanceNotice" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Minimum Advance Notice (days)</Label>
                    <Input
                      id="advanceNotice"
                      type="number"
                      value={settings.events.advanceNotice}
                      onChange={(e) => { updateSetting("events", "advanceNotice", Number.parseInt(e.target.value)); toast({ title: "Advance Notice Updated", description: `Minimum advance notice set to ${e.target.value} days.` }); }}
                      className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDuration" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Maximum Event Duration (hours)</Label>
                    <Input
                      id="maxDuration"
                      type="number"
                      value={settings.events.maxDuration}
                      onChange={(e) => { updateSetting("events", "maxDuration", Number.parseInt(e.target.value)); toast({ title: "Max Duration Updated", description: `Maximum event duration set to ${e.target.value} hours.` }); }}
                      className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up border-2 border-purple-200 dark:border-purple-900/40 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent animate-fade-in-up">
                  <Database className="w-5 h-5 animate-pulse text-purple-500 dark:text-emerald-400" />
                  <span>Budget Management Settings</span>
                </CardTitle>
                <CardDescription className="text-base text-gray-800 dark:text-gray-200 font-medium mt-2">Configure financial controls and approval workflows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fiscalYear" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Fiscal Year Start</Label>
                    <Select
                      value={settings.budget.fiscalYearStart}
                      onValueChange={(value) => { updateSetting("budget", "fiscalYearStart", value); toast({ title: "Fiscal Year Updated", description: `Fiscal year starts in ${value}.` }); }}
                    >
                      <SelectTrigger className="glassy-select border-0 shadow-md text-base font-medium text-gray-900 dark:text-gray-100 tracking-wide">
                        <SelectValue className="text-base font-medium text-gray-900 dark:text-gray-100 tracking-wide" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="January">January</SelectItem>
                        <SelectItem value="April">April</SelectItem>
                        <SelectItem value="July">July</SelectItem>
                        <SelectItem value="October">October</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultBudget" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Default Budget Limit (₹)</Label>
                    <Input
                      id="defaultBudget"
                      type="number"
                      value={settings.budget.defaultBudgetLimit}
                      onChange={(e) => { updateSetting("budget", "defaultBudgetLimit", Number.parseInt(e.target.value)); toast({ title: "Default Budget Limit Updated", description: `Default budget limit set to ₹${e.target.value}.` }); }}
                      className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-lg px-4 py-3 shadow-inner hover:shadow-lg transition-all">
                    <div>
                      <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100">Require Budget Approval</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Budget requests must be approved</p>
                    </div>
                    <Switch
                      checked={settings.budget.requireApproval}
                      onCheckedChange={(checked) => { updateSetting("budget", "requireApproval", checked); toast({ title: checked ? "Budget Approval Required" : "Budget Approval Not Required", description: checked ? "All budget requests now require admin approval." : "Budget requests can be processed without approval." }); }}
                      className={settings.budget.requireApproval ? "bg-emerald-500 border-emerald-600" : "bg-gray-400 border-gray-500"}
                    />
                  </div>
                  <div className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-lg px-4 py-3 shadow-inner hover:shadow-lg transition-all">
                    <div>
                      <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100">Allow Budget Overspend</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Permit spending beyond allocated budget</p>
                    </div>
                    <Switch
                      checked={settings.budget.allowOverspend}
                      onCheckedChange={(checked) => { updateSetting("budget", "allowOverspend", checked); toast({ title: checked ? "Overspend Allowed" : "Overspend Not Allowed", description: checked ? "Clubs can now spend beyond their allocated budget." : "Overspending is now prevented." }); }}
                      className={settings.budget.allowOverspend ? "bg-yellow-500 border-yellow-600" : "bg-emerald-500 border-emerald-600"}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approvalThreshold" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Approval Threshold (₹)</Label>
                  <Input
                    id="approvalThreshold"
                    type="number"
                    value={settings.budget.approvalThreshold}
                    onChange={(e) => { updateSetting("budget", "approvalThreshold", Number.parseInt(e.target.value)); toast({ title: "Approval Threshold Updated", description: `Approval threshold set to ₹${e.target.value}.` }); }}
                    className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expenses above this amount require admin approval</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up border-2 border-emerald-200 dark:border-emerald-900/40 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-500 bg-clip-text text-transparent animate-fade-in-up">
                  <Shield className="w-5 h-5 animate-pulse text-emerald-500 dark:text-blue-400" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription className="text-base text-gray-800 dark:text-gray-200 font-medium mt-2">Manage authentication, password, and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-lg px-4 py-3 shadow-inner hover:shadow-lg transition-all">
                    <div>
                      <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for all admin logins</p>
                    </div>
                    <Switch
                      checked={settings.security.requireTwoFactor}
                      onCheckedChange={(checked) => { updateSetting("security", "requireTwoFactor", checked); toast({ title: checked ? "2FA Enabled" : "2FA Disabled", description: checked ? "Two-factor authentication is now required for all admins." : "2FA is no longer required for admin logins." }); }}
                      className={settings.security.requireTwoFactor ? "bg-emerald-500 border-emerald-600" : "bg-gray-400 border-gray-500"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => { updateSetting("security", "passwordMinLength", Number.parseInt(e.target.value)); toast({ title: "Password Length Updated", description: `Minimum password length set to ${e.target.value} characters.` }); }}
                      className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Set the minimum number of characters for passwords</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => { updateSetting("security", "maxLoginAttempts", Number.parseInt(e.target.value)); toast({ title: "Max Login Attempts Updated", description: `Max login attempts set to ${e.target.value}.` }); }}
                      className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Set the number of failed attempts before lockout</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockoutDuration" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={settings.security.lockoutDuration}
                      onChange={(e) => { updateSetting("security", "lockoutDuration", Number.parseInt(e.target.value)); toast({ title: "Lockout Duration Updated", description: `Lockout duration set to ${e.target.value} minutes.` }); }}
                      className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Set the duration for which account is locked</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100 mb-1">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => { updateSetting("security", "sessionTimeout", Number.parseInt(e.target.value)); toast({ title: "Session Timeout Updated", description: `Session timeout set to ${e.target.value} minutes.` }); }}
                    className="glassy-input border-0 shadow-md text-gray-900 dark:text-gray-100"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Auto-logout after this many minutes of inactivity</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up border-2 border-blue-200 dark:border-blue-900/40 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent animate-fade-in-up">
                  <Bell className="w-5 h-5 animate-pulse text-blue-500 dark:text-emerald-400" />
                  <span>Notification Settings</span>
                </CardTitle>
                <CardDescription className="text-base text-gray-800 dark:text-gray-200 font-medium mt-2">Configure notification preferences and delivery channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
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
                      <Switch checked={settings.notifications.emailEnabled} onCheckedChange={(checked) => { updateSetting("notifications", "emailEnabled", checked); toast({ title: checked ? "Email Notifications Enabled" : "Email Notifications Disabled", description: checked ? "Email notifications are now enabled." : "Email notifications are now disabled." }); }} className={settings.notifications.emailEnabled ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4" />
                        <span>Push Notifications</span>
                      </div>
                      <Switch checked={settings.notifications.pushEnabled} onCheckedChange={(checked) => { updateSetting("notifications", "pushEnabled", checked); toast({ title: checked ? "Push Notifications Enabled" : "Push Notifications Disabled", description: checked ? "Push notifications are now enabled." : "Push notifications are now disabled." }); }} className={settings.notifications.pushEnabled ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <span>SMS Notifications</span>
                      </div>
                      <Switch checked={settings.notifications.smsEnabled} onCheckedChange={(checked) => { updateSetting("notifications", "smsEnabled", checked); toast({ title: checked ? "SMS Notifications Enabled" : "SMS Notifications Disabled", description: checked ? "SMS notifications are now enabled." : "SMS notifications are now disabled." }); }} className={settings.notifications.smsEnabled ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'} />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-2">
                    <Sliders className="w-5 h-5 text-emerald-500" />
                    <span className="font-semibold text-lg tracking-wide">Notification Preferences</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Digest Frequency</span>
                      <Select
                        value={settings.notifications.digestFrequency}
                        onValueChange={(value) => { updateSetting("notifications", "digestFrequency", value); toast({ title: "Digest Frequency Updated", description: `Digest frequency set to ${value}.` }); }}
                      >
                        <SelectTrigger className="glassy-select border-0 shadow-md text-base font-medium text-gray-900 dark:text-gray-100 tracking-wide">
                          <SelectValue className="text-base font-medium text-gray-900 dark:text-gray-100 tracking-wide" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="systems" className="space-y-6 animate-fade-in">
            <Card className="glassy-card animate-fade-in-up border-2 border-emerald-200 dark:border-emerald-900/40 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-500 bg-clip-text text-transparent animate-fade-in-up">
                  <Server className="w-5 h-5 animate-pulse text-emerald-500 dark:text-blue-400" />
                  <span>System Settings</span>
                </CardTitle>
                <CardDescription className="text-base text-gray-800 dark:text-gray-200 font-medium mt-2">Manage system health, backups, and maintenance options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-lg px-4 py-3 shadow-inner hover:shadow-lg transition-all">
                    <div>
                      <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100">Enable Backups</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatic daily system backups</p>
                    </div>
                    <Switch
                      checked={settings.systems.enableBackups}
                      onCheckedChange={(checked) => { updateSetting("systems", "enableBackups", checked); toast({ title: checked ? "Backups Enabled" : "Backups Disabled", description: checked ? "Automatic daily backups are now enabled." : "Backups are now disabled." }); }}
                      className={settings.systems.enableBackups ? "bg-emerald-500 border-emerald-600" : "bg-red-500 border-red-600"}
                    />
                  </div>
                  <div className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-lg px-4 py-3 shadow-inner hover:shadow-lg transition-all">
                    <div>
                      <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100">Enable Maintenance Mode</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Temporarily disable user access for maintenance</p>
                    </div>
                    <Switch
                      checked={settings.systems.maintenanceMode}
                      onCheckedChange={(checked) => { updateSetting("systems", "maintenanceMode", checked); toast({ title: checked ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled", description: checked ? "System is now in maintenance mode." : "System is now live." }); }}
                      className={settings.systems.maintenanceMode ? "bg-yellow-500 border-yellow-600" : "bg-emerald-500 border-emerald-600"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-lg px-4 py-3 shadow-inner hover:shadow-lg transition-all">
                    <div>
                      <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100">Enable System Monitoring</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monitor system health and performance</p>
                    </div>
                    <Switch
                      checked={settings.systems.enableMonitoring}
                      onCheckedChange={(checked) => { updateSetting("systems", "enableMonitoring", checked); toast({ title: checked ? "Monitoring Enabled" : "Monitoring Disabled", description: checked ? "System monitoring is now enabled." : "System monitoring is now disabled." }); }}
                      className={settings.systems.enableMonitoring ? "bg-blue-500 border-blue-600" : "bg-red-500 border-red-600"}
                    />
                  </div>
                  <div className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-lg px-4 py-3 shadow-inner hover:shadow-lg transition-all">
                    <div>
                      <Label className="font-semibold text-base tracking-wide text-gray-800 dark:text-gray-100">Enable Auto Updates</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatically apply system updates</p>
                    </div>
                    <Switch
                      checked={settings.systems.autoUpdates}
                      onCheckedChange={(checked) => { updateSetting("systems", "autoUpdates", checked); toast({ title: checked ? "Auto Updates Enabled" : "Auto Updates Disabled", description: checked ? "Automatic system updates are now enabled." : "Auto updates are now disabled." }); }}
                      className={settings.systems.autoUpdates ? "bg-purple-500 border-purple-600" : "bg-emerald-500 border-emerald-600"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* Sticky Save/Reset Bar */}
        <div className="sticky bottom-4 z-30 w-full max-w-3xl mx-auto">
          <div className="admin-glass-strong rounded-2xl p-4 flex items-center justify-between shadow-2xl border border-blue-200 dark:border-blue-900/40 backdrop-blur-xl animate-fade-in-up">
            <div>
              <h3 className="font-semibold text-lg">Save Configuration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Apply all changes to the system settings</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="glass-button flex items-center gap-2" onClick={resetSettings}>
                <Activity className="w-4 h-4" /> Reset to Defaults
              </Button>
              <Button onClick={saveSettings} className="glass-button bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

