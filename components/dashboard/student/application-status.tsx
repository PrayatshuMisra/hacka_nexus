"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, FileText, Loader2 } from "lucide-react"
import { applicationsAPI } from "@/lib/api"
import type { Application } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export function ApplicationStatus() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user-data')
      if (userData) {
        try {
          const parsed = JSON.parse(userData)
          setUserId(parsed.id)
        } catch {}
      }
    }
  }, [])

  useEffect(() => {
    if (typeof userId === 'number') loadApplications()

  }, [userId])

  const loadApplications = async () => {
    if (typeof userId !== 'number') return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('applications')
        .select('id, club:clubs(name), position, status, applied_date')
        .eq('user_id', userId)
        .order('applied_date', { ascending: false })
      if (error) throw error
      setApplications(
        (data || []).map((app: any) => ({
          id: app.id,
          club: Array.isArray(app.club) ? app.club[0] : app.club,
          position: app.position,
          status: app.status,
          appliedDate: app.applied_date,
          clubId: app.club_id ?? null,
          userId: app.user_id ?? null,
        }))
      )
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3 mr-1" />
      case "shortlisted":
      case "accepted":
        return <CheckCircle className="w-3 h-3 mr-1" />
      case "rejected":
        return <XCircle className="w-3 h-3 mr-1" />
      default:
        return <FileText className="w-3 h-3 mr-1" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "shortlisted":
      case "accepted":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          <p className="text-sm">Loading applications...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Application Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {applications.length === 0 ? (
          <div className="text-center py-4">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">No applications yet</p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{app.club?.name || "Club Name"}</h4>
                <Badge variant={getStatusColor(app.status) as any} className="text-xs">
                  {getStatusIcon(app.status)}
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-1">{app.position}</p>
              <p className="text-xs text-gray-500">Applied: {formatDate(app.appliedDate)}</p>

              {app.status === "shortlisted" && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-700 dark:text-green-300">
                  🎉 Congratulations! You've been shortlisted for the next round.
                </div>
              )}

              {app.status === "accepted" && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
                  🎊 Welcome to the team! Check your email for next steps.
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
