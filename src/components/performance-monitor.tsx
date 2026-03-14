"use client"

import * as React from "react"
import { 
  BarChart, 
  Activity, 
  Zap, 
  Search, 
  Clock, 
  RefreshCw, 
  AlertTriangle,
  ChevronRight,
  Info,
  MoreVertical
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const METRICS = [
  { label: "Cache hit ratio", value: "91.4%", subtext: "Target >95%", color: "text-slate-800" },
  { label: "Avg fragmentation", value: "24.3%", subtext: "6 tables >30%", color: "text-rose-600" },
  { label: "Deadlocks (24h)", value: "7", subtext: "+3 vs yesterday", color: "text-rose-600" },
  { label: "Slow queries", value: "243", subtext: "Avg 3.8s exec time", color: "text-rose-600" },
  { label: "Missing indexes", value: "11", subtext: "Across 7 tables", color: "text-amber-600" },
  { label: "Lock wait time", value: "1.2s", subtext: "Avg per request", color: "text-amber-600" },
]

const FRAGMENTATION_DATA = [
  { table: "invoices", index: "IX_invoice_date", frag: 68, severity: "Critical" },
  { table: "session_history", index: "IX_session_user", frag: 61, severity: "Critical" },
  { table: "orders", index: "IX_orders_cust", frag: 54, severity: "Critical" },
  { table: "payments", index: "IX_pay_date", frag: 47, severity: "Critical" },
  { table: "portal_sessions", index: "IX_portal_user", frag: 33, severity: "Critical" },
  { table: "transactions", index: "IX_trans_date", frag: 31, severity: "Critical" },
  { table: "customers", index: "IX_cust_email", frag: 28, severity: "Warning" },
  { table: "leads", index: "IX_leads_date", frag: 24, severity: "Warning" },
  { table: "audit_logs", index: "IX_audit_date", frag: 22, severity: "Warning" },
  { table: "user_profiles", index: "IX_user_email", frag: 19, severity: "Warning" },
  { table: "shipping", index: "IX_ship_order", frag: 11, severity: "Low" },
]

export function PerformanceMonitor({ activeDb }: { activeDb: string }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Performance Monitor</h1>
          <Badge className="bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#E6F4EA] border-none font-medium px-2 py-0.5 text-[10px]">
            {activeDb}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Last scan: today 08:42 AM</span>
          <Select defaultValue="24h">
            <SelectTrigger className="h-9 text-xs w-40 bg-white border-slate-200 rounded-lg shadow-none">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-9 bg-[#1E8E3E] hover:bg-[#1A7F37] text-white text-xs font-bold rounded-lg px-6 shadow-sm">
            Run Full Scan
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {METRICS.map((metric, i) => (
          <Card key={i} className="bg-white border-none shadow-sm rounded-xl">
            <CardContent className="p-4 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{metric.label}</span>
              <div className={cn("text-xl font-bold", metric.color)}>{metric.value}</div>
              <div className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{metric.subtext}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Index Fragmentation */}
        <Card className="lg:col-span-7 bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 pb-2 border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Index fragmentation</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Tables above 10% threshold</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold text-slate-600 border-slate-200 rounded-lg">
              Rebuild all {'>'}30%
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 px-6">Table</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Index</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Fragmentation</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 text-center">Severity</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 text-right px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {FRAGMENTATION_DATA.map((item, i) => (
                  <TableRow key={i} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                    <TableCell className="py-2.5 px-6">
                      <span className="text-xs font-bold text-slate-800">{item.table}</span>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="text-[10px] font-mono text-slate-400">{item.index}</span>
                    </TableCell>
                    <TableCell className="py-2.5 min-w-[140px]">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              item.frag > 50 ? "bg-rose-500" : item.frag > 20 ? "bg-amber-500" : "bg-emerald-500"
                            )}
                            style={{ width: `${item.frag}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold w-7 text-right",
                          item.frag > 50 ? "text-rose-500" : item.frag > 20 ? "text-amber-500" : "text-emerald-500"
                        )}>
                          {item.frag}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 text-center">
                      <Badge 
                        className={cn(
                          "font-bold text-[8px] px-1.5 py-0 rounded border-none shadow-none uppercase tracking-tighter",
                          item.severity === "Critical" && "bg-rose-50 text-rose-500",
                          item.severity === "Warning" && "bg-amber-50 text-amber-500",
                          item.severity === "Low" && "bg-emerald-50 text-emerald-500"
                        )}
                      >
                        {item.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2.5 text-right px-6">
                      <Button variant="outline" size="sm" className="h-6 text-[9px] font-bold text-slate-500 border-slate-200 rounded px-3 hover:bg-white hover:border-slate-300">
                        Rebuild
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Column: Cache Hit Ratio */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden h-full">
            <CardHeader className="p-6 pb-2 border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-900">Cache hit ratio</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Buffer pool efficiency — sys.dm_os_performance_counters</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-8">
              {/* Gauge */}
              <div className="relative w-64 h-32 overflow-hidden mt-4">
                <svg className="w-full h-full" viewBox="0 0 200 100">
                  <path 
                    d="M20,100 A80,80 0 0,1 180,100" 
                    fill="none" 
                    stroke="#F1F3ED" 
                    strokeWidth="12" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M20,100 A80,80 0 0,1 180,100" 
                    fill="none" 
                    stroke="#1E8E3E" 
                    strokeWidth="12" 
                    strokeLinecap="round"
                    strokeDasharray="251.3"
                    strokeDashoffset={251.3 * (1 - 0.914)}
                  />
                  <text x="100" y="75" textAnchor="middle" className="text-4xl font-bold fill-slate-800">91.4%</text>
                  <text x="100" y="95" textAnchor="middle" className="text-[8px] font-bold fill-slate-400 uppercase tracking-widest">Buffer cache hit ratio</text>
                  <text x="20" y="115" className="text-[6px] fill-slate-300">0%</text>
                  <text x="170" y="115" className="text-[6px] fill-slate-300">100%</text>
                </svg>
              </div>

              {/* Stats Table */}
              <div className="w-full space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-xs text-slate-500 font-medium">Reads from buffer pool</span>
                  <span className="text-xs font-bold text-slate-900">2,841,220</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-xs text-slate-500 font-medium">Physical disk reads</span>
                  <span className="text-xs font-bold text-rose-500">244,108</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-xs text-slate-500 font-medium">Target ratio</span>
                  <span className="text-xs font-bold text-emerald-600 tracking-tight">{">"} 95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Status</span>
                  <Badge className="bg-amber-50 text-amber-600 font-bold border-none text-[8px] px-2 py-0.5 rounded uppercase tracking-tighter">Below target</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
