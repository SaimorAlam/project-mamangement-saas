import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Users, TrendingUp, AlertTriangle, HardDrive, User,
  FolderOpen, Database, Zap, Building2, Mail, Phone,
  MapPin, Pause, Ticket
} from "lucide-react"

export function SingleClient() {
  const [customers, setCustomers] = useState<any[]>([])
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    fetch("/customerData.json")
      .then(res => res.json())
      .then(data => setCustomers(data))
  }, [])

  const userData = customers.find(c => c.id === Number(id))
  if (!userData) return <p>Client not found</p>

  // Fix: actual data is inside userData.user
  const client = userData.user.client
  const metrics = userData.user.metrics
  const planSummary = userData.user.planSummary

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200 h-44">
            <CardContent className="">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total User</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.totalUsers.current}/{metrics.totalUsers.total}
                  </p>
                </div>
              </div>
              <div className="mt-8 bg-green-50 rounded-lg p-3">
                <p className="text-sm text-green-700">{metrics.totalUsers.percentage}% of capacity used</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Active Program</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.activePrograms.current}</p>
                </div>
              </div>
              <div className="mt-4 bg-green-50 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  {metrics.activePrograms.newThisMonth} new Program in this month
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.criticalAlerts.current}</p>
                </div>
              </div>
              <div className="mt-4 bg-green-50 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  {metrics.criticalAlerts.newIn24Hours} new alerts in the last 24 hours
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <HardDrive className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Storage Usage</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.storageUsage.current}/{metrics.storageUsage.total}
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-red-50 rounded-lg p-3">
                <p className="text-sm text-red-700">{metrics.storageUsage.percentage}% of storage used</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="program">Program</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6">Plan Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">Users</span>
                    </div>
                    <span className="font-medium">
                      {planSummary.users.current}/{planSummary.users.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">Projects</span>
                    </div>
                    <span className="font-medium">
                      {planSummary.projects.current}/{planSummary.projects.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">Storage</span>
                    </div>
                    <span className="font-medium">
                      {planSummary.storage.current}/{planSummary.storage.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">API Calls</span>
                    </div>
                    <span className="font-medium">
                      {planSummary.apiCalls.current}/{planSummary.apiCalls.total}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="program" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Active Programs</h3>
                <p className="text-gray-600">
                  You have {metrics.activePrograms.current} active programs running.
                  {metrics.activePrograms.newThisMonth} new programs were added this month.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium">Data Analytics Pipeline</h4>
                    <p className="text-sm text-gray-600 mt-1">Processing customer behavior data</p>
                    <Badge className="mt-2" variant="secondary">
                      Running
                    </Badge>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium">ML Model Training</h4>
                    <p className="text-sm text-gray-600 mt-1">Training recommendation engine</p>
                    <Badge className="mt-2" variant="secondary">
                      Running
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Client Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Company</p>
                  <p className="font-medium">{client.company}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Primary Contact</p>
                  <p className="font-medium">{client.primaryContact}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-blue-600">{client.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{client.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Plan Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Current Plan:</p>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 mt-1">
                  {client.plan.current}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Billing Cycle:</p>
                <p className="font-medium">{client.plan.billingCycle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Renewal:</p>
                <p className="font-medium">{client.plan.nextRenewal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status:</p>
                <Badge className="bg-green-100 text-green-800 mt-1">{client.plan.status}</Badge>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Action</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                <Pause className="w-4 h-4" />
                Suspend Client
              </Button>
              <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                <Ticket className="w-4 h-4" />
                View Support Tickets
                <Badge variant="secondary" className="ml-auto">3</Badge>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
