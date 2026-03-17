
"use client"

import * as React from "react"
import { 
  Bell, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Settings, 
  Mail, 
  MessageSquare, 
  AlertTriangle,
  Zap,
  Clock,
  Activity,
  CheckCircle2,
  Lock,
  Database,
  ChevronRight,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type AlertRule = {
  id: string
  name: string
  type: 'Fragmentation' | 'Usage' | 'Deadlocks' | 'Slow Query'
  threshold: string
  unit: string
  enabled: boolean
  severity: 'Critical' | 'Warning' | 'Info'
}

const INITIAL_RULES: AlertRule[] = [
  { id: '1', name: 'High Fragmentation', type: 'Fragmentation', threshold: '30', unit: '%', enabled: true, severity: 'Warning' },
  { id: '2', name: 'Critical Resource usage', type: 'Usage', threshold: '90', unit: '%', enabled: true, severity: 'Critical' },
  { id: '3', name: 'Deadlock Spike', type: 'Deadlocks', threshold: '5', unit: 'per hour', enabled: true, severity: 'Critical' },
  { id: '4', name: 'Query Timeout Warning', type: 'Slow Query', threshold: '5', unit: 'sec', enabled: false, severity: 'Warning' },
]

const RECENT_ALERTS = [
  { id: 'a1', rule: 'High Fragmentation', target: 'WEB_AUTH_DETAILS', value: '42.3%', time: '12m ago', severity: 'Warning', status: 'Active' },
  { id: 'a2', rule: 'Critical Resource usage', target: 'Buffer Cache', value: '78%', time: '1h 14m ago', severity: 'Critical', status: 'Active' },
  { id: 'a3', rule: 'Deadlock Spike', target: 'Invoices Table', value: '8 deadlocks', time: '3h 22m ago', severity: 'Critical', status: 'Resolved' },
  { id: 'a4', rule: 'High Fragmentation', target: 'SESSION_LOGS', value: '31.1%', time: 'Yesterday', severity: 'Warning', status: 'Resolved' },
]

export function AlertsManager({ activeDb }: { activeDb: string }) {
  const [rules, setRules] = React.useState<AlertRule[]>(INITIAL_RULES)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
    const rule = rules.find(r => r.id === id)
    toast({
      title: rule?.enabled ? "Rule Disabled" : "Rule Enabled",
      description: `Monitoring for "${rule?.name}" has been updated.`,
    })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Monitoring Sync",
        description: "Alert rules synchronized with system metrics.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="h-7 w-7 text-primary" />
            Alerts & Notification Rules
          </h1>
          <p className="text-sm text-slate-400 font-medium">Configure thresholds and automated triggers for {activeDb}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-10 border-slate-200 bg-white rounded-xl px-4 font-bold text-slate-600 gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Sync Metrics
          </Button>
          <Button className="h-10 bg-primary text-white font-bold rounded-xl px-6 shadow-lg shadow-primary/10">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Rule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Rules List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <Card key={rule.id} className={cn(
                "bg-white border-none shadow-sm rounded-2xl overflow-hidden transition-all",
                !rule.enabled && "opacity-60 grayscale-[0.5]"
              )}>
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          "font-bold text-[8px] uppercase px-1.5 py-0 rounded border-none",
                          rule.severity === 'Critical' ? "bg-rose-50 text-rose-500" :
                          rule.severity === 'Warning' ? "bg-amber-50 text-amber-500" :
                          "bg-blue-50 text-blue-500"
                        )}>
                          {rule.severity}
                        </Badge>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{rule.type}</span>
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900">{rule.name}</CardTitle>
                    </div>
                    <Switch 
                      checked={rule.enabled} 
                      onCheckedChange={() => toggleRule(rule.id)} 
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-2 space-y-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase">Trigger Threshold</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          value={rule.threshold} 
                          className="h-10 pr-12 font-bold text-slate-800 rounded-xl"
                          readOnly
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          {rule.unit}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-slate-600 rounded-xl">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-3 bg-slate-50/50 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Last check: Just now
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Recent Alert Activity</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-tight">System event log for {activeDb}</CardDescription>
                </div>
                <Button variant="link" className="text-primary font-bold text-xs p-0 h-auto">View Full History</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-12 px-8 text-[10px] font-bold uppercase text-slate-400">Rule</TableHead>
                    <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">Target</TableHead>
                    <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">Value</TableHead>
                    <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">Time</TableHead>
                    <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">Status</TableHead>
                    <TableHead className="h-12 px-8 text-right text-[10px] font-bold uppercase text-slate-400">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_ALERTS.map((alert) => (
                    <TableRow key={alert.id} className="hover:bg-slate-50/30">
                      <TableCell className="py-4 px-8">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            alert.severity === 'Critical' ? "bg-rose-500" : "bg-amber-500"
                          )} />
                          <span className="text-xs font-bold text-slate-700">{alert.rule}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-500">{alert.target}</TableCell>
                      <TableCell className="text-xs font-bold text-slate-900">{alert.value}</TableCell>
                      <TableCell className="text-[10px] font-bold text-slate-400 uppercase">{alert.time}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "font-bold text-[8px] uppercase px-1.5 py-0 rounded border-none",
                          alert.status === 'Active' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                        )}>
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-primary hover:bg-primary/5 rounded-lg">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-[#0F172A] border-none shadow-xl rounded-3xl p-8 text-white">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Settings className="h-4 w-4 text-blue-400" />
              Notification Channels
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Email Alerts</div>
                    <div className="text-[10px] text-slate-400 font-medium">alerts@enterprise.com</div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Slack Webhook</div>
                    <div className="text-[10px] text-slate-400 font-medium">#sql-critical-logs</div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">SMS Notifications</div>
                    <div className="text-[10px] text-slate-400 font-medium">+1 (555) 000-0000</div>
                  </div>
                </div>
                <Switch />
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-900/40">
                Test Notifications
              </Button>
            </div>
          </Card>

          <Card className="bg-white border-none shadow-sm rounded-3xl p-8">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Automated Actions</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Auto-Rebuild Index</div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">
                    Automatically trigger index rebuild when fragmentation exceeds 70% during off-peak hours.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-[10px] font-bold text-primary mt-2">Configure Workflow</Button>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <Database className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Auto-Archival</div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">
                    Move tables matching redundancy patterns to archive schema after 90 days of zero access.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-[10px] font-bold text-primary mt-2">Manage Policy</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
