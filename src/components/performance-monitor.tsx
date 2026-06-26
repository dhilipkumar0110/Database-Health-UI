
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
  Lock,
  ExternalLink
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
  { label: "Lock wait time", value: "1.2s", subtext: "Avg per request", color: "text-amber-600" },
  { label: "Slow queries", value: "243", subtext: "Avg 3.8s exec time", color: "text-rose-600" },
  { label: "Missing indexes", value: "11", subtext: "Across 7 tables", color: "text-amber-600" },
]

const ALL_FRAGMENTATION = [
  { table: "WEB_AUTH_NOTES", index: "IX_notes_created", frag: 68, severity: "Critical" },
  { table: "WEB_AUDIT_TRAIL", index: "IX_audit_ts", frag: 62, severity: "Critical" },
  { table: "WEB_AUTH_DETAILS", index: "IX_auth_user", frag: 59, severity: "Critical" },
  { table: "PROV_CONSULT_NOTES", index: "IX_consult_date", frag: 52, severity: "Critical" },
  { table: "USER_PROVIDERS", index: "IX_prov_id", frag: 48, severity: "Warning" },
]

const ALL_SLOW_QUERIES = [
  { query: "DELETE FROM WEB_AUTH_NOTES WHERE...", table: "WEB_AUTH_NOTES", avgTime: "12.5s", executions: "88", lastRun: "2m ago", fix: "Missing index", sp: "sp_CleanupExpiredSessions" },
  { query: "SELECT * FROM WEB_AUDIT_TRAIL WHERE...", table: "WEB_AUDIT_TRAIL", avgTime: "8.2s", executions: "412", lastRun: "5m ago", fix: "Missing index", sp: "sp_GenerateComplianceReport" },
  { query: "UPDATE PROV_CONSULT_NOTES SET...", table: "PROV_CONSULT_NOTES", avgTime: "6.1s", executions: "203", lastRun: "12m ago", fix: "Rebuild index", sp: "sp_UpdatePatientNotes" },
  { query: "SELECT * FROM USERS JOIN WEB_AUTH_DETAILS...", table: "USERS", avgTime: "4.4s", executions: "670", lastRun: "18m ago", fix: "Missing index", sp: "sp_AuthUserLogin" },
]

const ALL_MISSING_INDEXES = [
  { table: "WEB_AUDIT_TRAIL", columns: "[user_id, event_ts]", impact: "Very high", sp: "sp_GetAuditHistory" },
  { table: "WEB_AUTH_DETAILS", columns: "[auth_id]", impact: "Very high", sp: "sp_ValidateAuthToken" },
  { table: "PROV_CONSULT_NOTES", columns: "[patient_id, consult_date]", impact: "High", sp: "sp_FetchClinicalRecords" },
  { table: "REQUEST_LOG", columns: "[request_id]", impact: "Medium", sp: "sp_AuditLogRequest" },
]

export function PerformanceMonitor({ activeDb, monitoredTables }: { activeDb: string, monitoredTables: string[] }) {
  const slowQueriesRef = React.useRef<HTMLDivElement>(null)

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

  const handleScrollToSlowQueries = () => {
    slowQueriesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Performance Monitor</h1>
          <Badge className="bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#E6F4EA] border-none font-medium px-2 py-0.5 text-[10px]">
            {activeDb}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="24h">
            <SelectTrigger className="h-9 text-xs w-40 bg-white border-slate-200 rounded-lg shadow-none">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-9 bg-[#1E8E3E] hover:bg-[#1A7F37] text-white text-xs font-bold rounded-lg px-6 shadow-sm">
            Run Full Scan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {METRICS.map((metric, i) => (
          <Card 
            key={i} 
            className={cn(
              "bg-white border-none shadow-sm rounded-xl transition-all cursor-pointer hover:ring-1 hover:ring-primary/20",
              metric.label === "Slow queries" && "hover:bg-rose-50/30"
            )}
            onClick={metric.label === "Slow queries" ? handleScrollToSlowQueries : undefined}
          >
            <CardContent className="p-4 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{metric.label}</span>
              <div className={cn("text-xl font-bold", metric.color)}>{metric.value}</div>
              <div className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{metric.subtext}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 pb-2 border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Index fragmentation</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Critical tables above 30%</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 px-6">Table</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Fragmentation</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 text-center">Severity</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 text-right px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fragData.map((item, i) => (
                  <TableRow key={i} className="group hover:bg-slate-50/50 border-b border-slate-50 last:border-0">
                    <TableCell className="py-2.5 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{item.table}</span>
                        <span className="text-[9px] font-mono text-slate-400">{item.index}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 min-w-[140px]">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", item.frag > 50 ? "bg-rose-500" : "bg-amber-500")} style={{ width: `${item.frag}%` }} />
                        </div>
                        <span className={cn("text-[10px] font-bold w-7 text-right", item.frag > 50 ? "text-rose-500" : "text-amber-500")}>
                          {item.frag}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 text-center">
                      <Badge className={cn("font-bold text-[8px] px-1.5 py-0 rounded border-none uppercase", item.severity === "Critical" ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500")}>
                        {item.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2.5 text-right px-6">
                      <Button variant="outline" size="sm" className="h-6 text-[9px] font-bold text-slate-500 border-slate-200 rounded px-3 hover:bg-white">
                        Rebuild
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="lg:col-span-5">
          <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden h-full">
            <CardHeader className="p-6 pb-2 border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-900">Resource Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">Buffer Cache Hit Ratio</span>
                  <span className="text-emerald-600">91.4%</span>
                </div>
                <Progress value={91.4} className="h-2 bg-slate-100" />
              </div>
              
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Avg Lock Wait Time</span>
                  <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3 text-amber-500" />
                    <span className="text-xs font-bold text-amber-600">1.2s</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Page Splits / sec</span>
                  <span className="text-xs font-bold text-slate-900">42.8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Deadlocks Detected</span>
                  <Badge className="bg-rose-50 text-rose-500 border-none text-[8px] font-bold uppercase">Critical Spike</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div ref={slowQueriesRef} className="space-y-6">
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Slow Queries Log</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Deep inspection of sys.dm_exec_query_stats</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold text-slate-600 border-slate-200">
              Export Analysis
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 px-6">Query Context & Source</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Avg Time</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Executions</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Last Execution</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Recommendation</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 text-right px-6">Inspect</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slowQueries.map((q, i) => (
                  <TableRow key={i} className="group hover:bg-slate-50/50 border-b border-slate-50 last:border-0">
                    <TableCell className="py-3 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-slate-400 truncate max-w-[240px]">{q.query}</span>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[8px] font-bold border-primary/20 text-primary uppercase">Used in: {q.sp}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 font-bold text-xs text-rose-500">{q.avgTime}</TableCell>
                    <TableCell className="py-3 text-xs text-slate-500">{q.executions}</TableCell>
                    <TableCell className="py-3 text-[10px] text-slate-400">{q.lastRun}</TableCell>
                    <TableCell className="py-3">
                      <Badge className="bg-amber-50 text-amber-600 border-none font-bold text-[8px] uppercase">{q.fix}</Badge>
                    </TableCell>
                    <TableCell className="py-3 text-right px-6">
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-primary">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 pb-2 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-slate-900">Missing Index Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 px-6">Table & Recommended Columns</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Impact</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Context Source</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 text-right px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {missingIndexes.map((idx, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0">
                    <TableCell className="py-3 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{idx.table}</span>
                        <span className="text-[10px] font-mono text-slate-400">{idx.columns}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-rose-50 text-rose-500 border-none font-bold text-[8px] uppercase">{idx.impact}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-bold text-slate-400 italic">This script is used in: {idx.sp}</span>
                    </TableCell>
                    <TableCell className="py-3 text-right px-6">
                      <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold text-slate-500 border-slate-200 px-4">
                        Script
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
