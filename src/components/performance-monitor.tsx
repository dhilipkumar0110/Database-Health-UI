
"use client"

import * as React from "react"
import { 
  Activity, 
  Zap, 
  Clock, 
  History,
  ShieldAlert,
  Code,
  Lock,
  ArrowDown,
  RefreshCw,
  CheckCircle2
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
  { id: 'deadlocks', label: "Deadlocks (24h)", value: "7", subtext: "+3 vs yesterday", color: "text-rose-600" },
  { id: 'lock-wait', label: "Lock wait time", value: "1.2s", subtext: "Avg per request", color: "text-amber-600" },
  { id: 'cache', label: "Buffer Cache Hit Ratio", value: "91.4%", subtext: "Target >95%", color: "text-emerald-600" },
  { id: 'frag', label: "Index Fragmentation", value: "24.3%", subtext: "6 tables >30%", color: "text-rose-600" },
  { id: 'slow-q', label: "Slow queries", value: "243", subtext: "Threshold >1.0s", color: "text-amber-600" },
  { id: 'missing-idx', label: "Missing indexes", value: "11", subtext: "Across 7 tables", color: "text-amber-600" },
]

const ALL_FRAGMENTATION = [
  { table: "REQUEST_LOG", index: "IX_req_log_id", frag: 5, severity: "Healthy" },
  { table: "Auth_Consult_Notes", index: "IX_auth_consult", frag: 8, severity: "Healthy" },
  { table: "WEB_AUTH_NOTES", index: "IX_notes_created", frag: 68, severity: "Critical" },
  { table: "WEB_AUDIT_TRAIL", index: "IX_audit_ts", frag: 62, severity: "Critical" },
]

const ALL_SLOW_QUERIES = [
  { query: "SELECT * FROM WEB_AUTH_NOTES WHERE...", duration: "4.2s", reads: "1.2M", context: "sp_GetAuthDetails" },
  { query: "UPDATE USERS SET last_login = ...", duration: "2.8s", reads: "450K", context: "sp_UserLoginUpdate" },
  { query: "SELECT COUNT(*) FROM WEB_AUDIT_TRAIL...", duration: "8.5s", reads: "12M", context: "sp_GenerateAuditReport" },
  { query: "DELETE FROM SESSION_LOGS WHERE...", duration: "3.1s", reads: "800K", context: "sp_CleanupExpiredSessions" },
]

const CONFLICT_EVENTS = [
  { id: 'c1', time: '08:42 AM', type: 'Deadlock', victim: 'process_821', source: 'sp_AuthUserLogin', status: 'Rolled Back' },
  { id: 'c2', time: '08:15 AM', type: 'Lock Wait', victim: 'process_1044', source: 'sp_UpdateInventory', duration: '4.2s', status: 'Resolved' },
  { id: 'c3', time: '07:30 AM', type: 'Deadlock', victim: 'process_902', source: 'sp_BatchProcessing', status: 'Rolled Back' },
  { id: 'c4', time: '06:12 AM', type: 'Lock Wait', victim: 'process_755', source: 'sp_FetchReports', duration: '12.8s', status: 'Timed Out' },
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
    ALL_FRAGMENTATION.filter(f => monitoredTables.includes(f.table) || f.severity === "Healthy"),
    [monitoredTables]
  )

  const missingIndexes = React.useMemo(() => 
    ALL_MISSING_INDEXES.filter(i => monitoredTables.includes(i.table)),
    [monitoredTables]
  )

  const scrollToSlowQueries = () => {
    slowQueriesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
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
        {METRICS.map((metric) => (
          <Card 
            key={metric.id} 
            onClick={metric.id === 'slow-q' ? scrollToSlowQueries : undefined}
            className={cn(
              "bg-white border-none shadow-sm rounded-xl transition-all cursor-pointer hover:ring-1 hover:ring-primary/20",
              metric.id === 'slow-q' && "hover:bg-amber-50/50"
            )}
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
        <Card className="lg:col-span-8 bg-white border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between border-b border-slate-50">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Index fragmentation</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">TABLES ABOVE 10% THRESHOLD</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="bg-slate-50 border-slate-200 text-slate-600 font-bold text-[10px] rounded-xl px-4 h-10 hover:bg-slate-100">
              Rebuild all {'>'}30%
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="h-12 px-8 text-[10px] font-bold uppercase text-slate-400">TABLE</TableHead>
                  <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">INDEX</TableHead>
                  <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">FRAGMENTATION</TableHead>
                  <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">SEVERITY</TableHead>
                  <TableHead className="h-12 px-8 text-right text-[10px] font-bold uppercase text-slate-400">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fragData.map((item, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors">
                    <TableCell className="py-4 px-8">
                      <span className="text-sm font-bold text-slate-900">{item.table}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] font-mono text-slate-400">{item.index}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[120px]">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all", 
                              item.frag > 30 ? "bg-rose-500" : "bg-emerald-500"
                            )} 
                            style={{ width: `${item.frag}%` }} 
                          />
                        </div>
                        <span className={cn("text-xs font-bold w-10", item.frag > 30 ? "text-rose-500" : "text-emerald-500")}>
                          {item.frag}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-bold text-[9px] uppercase border-none px-2 py-0.5 rounded",
                        item.severity === "Critical" ? "bg-rose-50 text-rose-600" : "bg-[#1E8E3E] text-white"
                      )}>
                        {item.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold text-slate-500 border-slate-200 rounded-lg px-4 bg-white hover:bg-slate-50">
                        Rebuild
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-white border-none shadow-sm rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-bold text-slate-900">Cache hit ratio</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tight">BUFFER POOL EFFICIENCY — SYS.DM_OS_PERFORMANCE_COUNTERS</CardDescription>
          </CardHeader>
          <CardContent className="p-8 flex-1 flex flex-col">
            <div className="relative flex flex-col items-center justify-center py-10">
              <svg className="w-48 h-24" viewBox="0 0 100 50">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#1E8E3E"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 * (1 - 0.914)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">91.4%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">BUFFER CACHE HIT RATIO</span>
              </div>
            </div>

            <div className="mt-auto space-y-4 pt-8">
              <div className="flex items-center justify-between group">
                <span className="text-xs font-medium text-slate-500">Reads from buffer pool</span>
                <span className="text-sm font-bold text-slate-900">2,841,220</span>
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-xs font-medium text-slate-500">Physical disk reads</span>
                <span className="text-sm font-bold text-rose-500">244,108</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xs font-medium text-slate-500">Status</span>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded">BELOW TARGET</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 pb-2 border-b border-slate-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
                Recent Conflict Events
              </CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-tight">Lock waits & Deadlocks tracked in {activeDb}</CardDescription>
            </div>
            <History className="h-4 w-4 text-slate-300" />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 px-6">Event Time</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Type</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Victim ID</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Source (SP)</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 text-right px-6">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CONFLICT_EVENTS.map((event) => (
                  <TableRow key={event.id} className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0">
                    <TableCell className="py-3 px-6 text-xs font-bold text-slate-500">{event.time}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[9px] font-bold uppercase border-none",
                        event.type === 'Deadlock' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                      )}>{event.type}</Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-mono font-bold text-slate-700">{event.victim}</TableCell>
                    <TableCell>
                      <span className="text-[10px] font-bold text-slate-400 italic">({event.source})</span>
                    </TableCell>
                    <TableCell className="py-3 px-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className={cn(
                          "text-[10px] font-bold uppercase",
                          event.status === 'Rolled Back' || event.status === 'Timed Out' ? "text-rose-500" : "text-emerald-600"
                        )}>{event.status}</span>
                        {event.duration && <span className="text-[9px] text-slate-400">{event.duration} wait</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 pb-2 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-slate-900">Missing Index Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 px-6">Table & Recommended Columns</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Impact</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 text-right px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {missingIndexes.slice(0, 4).map((idx, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0">
                    <TableCell className="py-3 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{idx.table}</span>
                        <span className="text-[10px] font-mono text-slate-400">{idx.columns}</span>
                        <span className="text-[9px] font-bold text-slate-300 italic">({idx.sp})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-rose-50 text-rose-500 border-none font-bold text-[8px] uppercase">{idx.impact}</Badge>
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

      <div ref={slowQueriesRef}>
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 pb-2 border-b border-slate-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Slow Queries Analysis</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Top queries exceeding 1.0s execution time</CardDescription>
            </div>
            <Code className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 px-6">Query Definition</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Duration</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Logical Reads</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Context (SP)</TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 text-right px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ALL_SLOW_QUERIES.map((q, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0">
                    <TableCell className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-600 truncate max-w-[300px]">{q.query}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-amber-600">{q.duration}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-slate-700">{q.reads}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-bold text-slate-400 italic">({q.context})</span>
                    </TableCell>
                    <TableCell className="py-4 text-right px-6">
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-primary hover:bg-emerald-50 px-4">
                        Analyze
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
