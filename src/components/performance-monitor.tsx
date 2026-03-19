
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
  MoreVertical,
  History,
  FileCode,
  Lock
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

const ALL_FRAGMENTATION = [
  { table: "WEB_AUTH_NOTES", index: "IX_notes_created", frag: 68, severity: "Critical" },
  { table: "WEB_AUDIT_TRAIL", index: "IX_audit_ts", frag: 62, severity: "Critical" },
  { table: "WEB_AUTH_DETAILS", index: "IX_auth_user", frag: 59, severity: "Critical" },
  { table: "PROV_CONSULT_NOTES", index: "IX_consult_date", frag: 52, severity: "Critical" },
  { table: "USER_PROVIDERS", index: "IX_prov_id", frag: 48, severity: "Warning" },
  { table: "POST_DISMISSALS", index: "IX_dismissal_type", frag: 24, severity: "Warning" },
  { table: "REQUEST_LOG", index: "IX_req_log_id", frag: 5, severity: "Healthy" },
  { table: "Auth_Consult_Notes", index: "IX_auth_consult", frag: 8, severity: "Healthy" },
]

const ALL_SLOW_QUERIES = [
  { query: "DELETE FROM WEB_AUTH_NOTES WHERE...", table: "WEB_AUTH_NOTES", avgTime: "12.5s", executions: "88", lastRun: "2m ago", fix: "Missing index" },
  { query: "SELECT * FROM WEB_AUDIT_TRAIL WHERE...", table: "WEB_AUDIT_TRAIL", avgTime: "8.2s", executions: "412", lastRun: "5m ago", fix: "Missing index" },
  { query: "UPDATE PROV_CONSULT_NOTES SET...", table: "PROV_CONSULT_NOTES", avgTime: "6.1s", executions: "203", lastRun: "12m ago", fix: "Rebuild index" },
  { query: "SELECT * FROM USERS JOIN WEB_AUTH_DETAILS...", table: "USERS", avgTime: "4.4s", executions: "670", lastRun: "18m ago", fix: "Missing index" },
  { query: "INSERT INTO REQUEST_LOG VALUES...", table: "REQUEST_LOG", avgTime: "3.2s", executions: "1,840", lastRun: "1m ago", fix: "Fragmentation" },
  { query: "SELECT * FROM POST_DISMISSALS WHERE...", table: "POST_DISMISSALS", avgTime: "2.8s", executions: "920", lastRun: "3m ago", fix: "Missing index" },
  { query: "UPDATE Auth_Consult_Notes SET...", table: "Auth_Consult_Notes", avgTime: "1.9s", executions: "445", lastRun: "8m ago", fix: "Fragmentation" },
]

const ALL_MISSING_INDEXES = [
  { table: "WEB_AUDIT_TRAIL", columns: "[user_id, event_ts]", impact: "Very high" },
  { table: "WEB_AUTH_DETAILS", columns: "[auth_id]", impact: "Very high" },
  { table: "PROV_CONSULT_NOTES", columns: "[patient_id, consult_date]", impact: "High" },
  { table: "REQUEST_LOG", columns: "[request_id]", impact: "Medium" },
]

const ALL_DEADLOCKS = [
  { block: "USERS ↹ WEB_AUTH_DETAILS", info: "SPID 58 vs 61 · 14 min ago", time: "2.3s", tables: ["USERS", "WEB_AUTH_DETAILS"] },
  { block: "WEB_AUDIT_TRAIL ↹ PROV_CONSULT_NOTES", info: "SPID 42 vs 77 · 1h 12m ago", time: "4.1s", tables: ["WEB_AUDIT_TRAIL", "PROV_CONSULT_NOTES"] },
  { block: "Auth_Consult_Notes ↹ REQUEST_LOG", info: "SPID 12 vs 19 · 2h 45m ago", time: "1.8s", tables: ["Auth_Consult_Notes", "REQUEST_LOG"] },
]

export function PerformanceMonitor({ activeDb, monitoredTables }: { activeDb: string, monitoredTables: string[] }) {
  const fragData = React.useMemo(() => 
    ALL_FRAGMENTATION.filter(f => monitoredTables.includes(f.table)),
    [monitoredTables]
  )

  const slowQueries = React.useMemo(() => 
    ALL_SLOW_QUERIES.filter(q => monitoredTables.includes(q.table)),
    [monitoredTables]
  )

  const missingIndexes = React.useMemo(() => 
    ALL_MISSING_INDEXES.filter(i => monitoredTables.includes(i.table)),
    [monitoredTables]
  )

  const deadlocks = React.useMemo(() => 
    ALL_DEADLOCKS.filter(d => d.tables.some(t => monitoredTables.includes(t))),
    [monitoredTables]
  )

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
                {fragData.length > 0 ? fragData.map((item, i) => (
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
                          item.severity === "Warning" && "bg-amber-50 text-amber-500"
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
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                      No fragmentation issues detected for monitored tables.
                    </TableCell>
                  </TableRow>
                )}
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
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Status</span>
                  <Badge className="bg-amber-50 text-amber-600 font-bold border-none text-[8px] px-2 py-0.5 rounded uppercase tracking-tighter">Below target</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Slow Queries Dashboard */}
      <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">Slow queries</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Queries exceeding 1s — monitored tables only</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-lg p-0.5 mr-2">
              <Button variant="ghost" className="h-7 text-[10px] font-bold bg-white shadow-sm px-3 rounded-md">All</Button>
              <Button variant="ghost" className="h-7 text-[10px] font-bold text-slate-400 px-3">Critical ({'>'}5s)</Button>
              <Button variant="ghost" className="h-7 text-[10px] font-bold text-slate-400 px-3">Missing index</Button>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold text-slate-600 border-slate-200 rounded-lg bg-white">
              View full log
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 px-6">Query</TableHead>
                <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Table</TableHead>
                <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Avg time</TableHead>
                <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Executions</TableHead>
                <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Last run</TableHead>
                <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Fix available</TableHead>
                <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 text-right px-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slowQueries.length > 0 ? slowQueries.map((q, i) => (
                <TableRow key={i} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                  <TableCell className="py-3 px-6">
                    <span className="text-[10px] font-mono text-slate-400 block max-w-[300px] truncate">{q.query}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs font-bold text-slate-800">{q.table}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs font-bold text-rose-500">{q.avgTime}</span>
                  </TableCell>
                  <TableCell className="py-3 text-xs font-medium text-slate-500">{q.executions}</TableCell>
                  <TableCell className="py-3 text-xs font-medium text-slate-400">{q.lastRun}</TableCell>
                  <TableCell className="py-3">
                    <Badge 
                      className={cn(
                        "font-bold text-[8px] px-2 py-0.5 rounded border-none shadow-none uppercase tracking-tighter",
                        q.fix === "Missing index" && "bg-rose-50 text-rose-500",
                        q.fix === "Fragmentation" && "bg-amber-50 text-amber-600",
                        q.fix === "Rebuild index" && "bg-orange-50 text-orange-500"
                      )}
                    >
                      {q.fix}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right px-6">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold text-slate-500 border-slate-200 rounded-lg px-4 hover:bg-white">
                      Fix
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No slow queries detected for monitored tables.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing index recommendations */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Missing index recommendations</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Monitored tables insights</CardDescription>
            </div>
            <Button className="h-8 bg-[#1E8E3E] hover:bg-[#1A7F37] text-white text-[10px] font-bold rounded-full px-4">
              Generate scripts
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 px-6">Table</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Columns</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Est. impact</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 text-right px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {missingIndexes.length > 0 ? missingIndexes.map((idx, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                    <TableCell className="py-3 px-6">
                      <span className="text-xs font-bold text-slate-800">{idx.table}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-[10px] font-mono text-slate-400">{idx.columns}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge className="bg-rose-50 text-rose-500 border-none font-bold text-[8px] uppercase">{idx.impact}</Badge>
                    </TableCell>
                    <TableCell className="py-3 text-right px-6">
                      <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold text-slate-500 border-slate-200 rounded-lg px-4 hover:bg-white">
                        Script
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                      No index recommendations for current monitored scope.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Lock waits & deadlocks */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Lock waits & deadlocks</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Recent conflict events</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-4 space-y-4">
            {deadlocks.length > 0 ? deadlocks.map((dl, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800">{dl.block}</div>
                  <div className="text-[10px] font-medium text-slate-400">{dl.info}</div>
                </div>
                <div className="text-xs font-bold text-rose-500">{dl.time}</div>
              </div>
            )) : (
              <div className="py-10 text-center text-slate-400 font-medium text-sm">
                No recent deadlocks involving monitored tables.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
