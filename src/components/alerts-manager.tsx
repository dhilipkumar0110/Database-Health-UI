
"use client"

import * as React from "react"
import { 
  Bell, 
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

const RECENT_ALERTS = [
  { id: 'a1', rule: 'High Fragmentation', target: 'WEB_AUTH_DETAILS', value: '42.3%', time: '12m ago', severity: 'Warning', status: 'Active' },
  { id: 'a2', rule: 'Critical Resource usage', target: 'Buffer Cache', value: '78%', time: '1h 14m ago', severity: 'Critical', status: 'Active' },
  { id: 'a3', rule: 'Deadlock Spike', target: 'Invoices Table', value: '8 deadlocks', time: '3h 22m ago', severity: 'Critical', status: 'Resolved' },
  { id: 'a4', rule: 'High Fragmentation', target: 'SESSION_LOGS', value: '31.1%', time: 'Yesterday', severity: 'Warning', status: 'Resolved' },
]

export function AlertsManager({ activeDb }: { activeDb: string }) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Monitoring Sync",
        description: "Alert history synchronized with system metrics.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="h-7 w-7 text-primary" />
            Alerts & Notifications
          </h1>
          <p className="text-sm text-slate-400 font-medium">Monitoring events and automated triggers for {activeDb}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-10 border-slate-200 bg-white rounded-xl px-4 font-bold text-slate-600 gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Sync History
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Activity Table */}
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
    </div>
  )
}
