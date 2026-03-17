"use client"

import * as React from "react"
import { 
  FileText, 
  Download, 
  Calendar, 
  ChevronRight, 
  Search,
  Filter,
  BarChart3, 
  PieChart, 
  LineChart,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  TrendingUp,
  Database,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const REPORT_TYPES = [
  { 
    id: 'health-summary', 
    title: 'Database Health Summary', 
    description: 'Overview of fragmentation, capacity, and performance across all instances.',
    icon: BarChart3,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  },
  { 
    id: 'query-perf', 
    title: 'Query Performance Audit', 
    description: 'Detailed analysis of slow queries, execution counts, and IO impact.',
    icon: PieChart,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  { 
    id: 'maint-log', 
    title: 'Maintenance Execution Log', 
    description: 'History of scheduled tasks, success rates, and duration metrics.',
    icon: LineChart,
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  }
]

const MOCK_MAINTENANCE_LOG = [
  { id: 'log-1', task: 'Q4 Data Cleanup', date: '2024-03-12 02:00 AM', duration: '45m 12s', status: 'Success', tables: 2 },
  { id: 'log-2', task: 'Daily Stats Refresh', date: '2024-03-12 01:00 AM', duration: '12m 04s', status: 'Success', tables: 18 },
  { id: 'log-3', task: 'Monthly Index Tuning', date: '2024-03-11 03:00 AM', duration: '2h 15m', status: 'Warning', tables: 34 },
  { id: 'log-4', task: 'Daily Stats Refresh', date: '2024-03-11 01:00 AM', duration: '11m 58s', status: 'Success', tables: 18 },
  { id: 'log-5', task: 'Audit Log Archival', date: '2024-03-10 11:30 PM', duration: '1h 05m', status: 'Success', tables: 5 },
]

const MOCK_QUERY_STATS = [
  { query: "SELECT * FROM WEB_AUTH_NOTES WHERE...", impact: "High", cpu: 82, io: 65, avgTime: "4.8s" },
  { query: "UPDATE transactions SET status = 'C'...", impact: "Medium", cpu: 45, io: 78, avgTime: "2.1s" },
  { query: "DELETE FROM session_history WHERE...", impact: "Critical", cpu: 91, io: 95, avgTime: "12.4s" },
  { query: "INSERT INTO audit_logs (id, ts)...", impact: "Low", cpu: 12, io: 34, avgTime: "0.4s" },
]

export function ReportsManager({ activeDb }: { activeDb: string }) {
  const [selectedReport, setSelectedReport] = React.useState(REPORT_TYPES[0].id)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const { toast } = useToast()

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Report Refreshed",
        description: `Fresh metrics for ${activeDb} have been aggregated into the ${REPORT_TYPES.find(r => r.id === selectedReport)?.title}.`,
      })
    }, 2000)
  }

  const handleDownload = (format: string) => {
    const reportTitle = REPORT_TYPES.find(r => r.id === selectedReport)?.title
    toast({
      title: "Export Initiated",
      description: `Generating ${format} file for "${reportTitle}"...`,
    })
    
    // Simulate a download delay
    setTimeout(() => {
      toast({
        title: "Download Ready",
        description: `Your ${format} document for "${reportTitle}" is ready.`,
      })
    }, 1500)
  }

  const renderHealthSummary = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-emerald-50 border-emerald-100 shadow-none">
          <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Overall Health Score</div>
          <div className="text-2xl font-bold text-emerald-700">84/100</div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
            <TrendingUp className="h-3 w-3" /> +4% from last week
          </div>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-100 shadow-none">
          <div className="text-[10px] font-bold text-amber-600 uppercase mb-1">Fragmentation Risks</div>
          <div className="text-2xl font-bold text-amber-700">12 Tables</div>
          <div className="text-[10px] font-bold text-amber-600 mt-1 uppercase tracking-tight">Average 34.2% across fleet</div>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-100 shadow-none">
          <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">Storage Utilization</div>
          <div className="text-2xl font-bold text-blue-700">842.1 GB</div>
          <div className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-tight">82% of allocated disk</div>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Key Performance Indicators</h4>
        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Buffer Cache Hit Ratio</span>
              <span>91.4%</span>
            </div>
            <Progress value={91.4} className="h-2 bg-slate-100" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Index Maintenance Efficiency</span>
              <span>76.8%</span>
            </div>
            <Progress value={76.8} className="h-2 bg-slate-100" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Query Execution Success Rate</span>
              <span>99.9%</span>
            </div>
            <Progress value={99.9} className="h-2 bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderQueryPerformance = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-rose-600 uppercase mb-1">Top Resource Consumer</div>
            <div className="text-lg font-bold text-rose-700 truncate max-w-[200px]">session_history</div>
          </div>
          <AlertTriangle className="h-6 w-6 text-rose-500" />
        </div>
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">Total Slow Queries</div>
            <div className="text-lg font-bold text-blue-700">243 Unique</div>
          </div>
          <Zap className="h-6 w-6 text-blue-500" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="h-10 text-[10px] font-bold uppercase text-slate-400">Query Pattern</TableHead>
              <TableHead className="h-10 text-[10px] font-bold uppercase text-slate-400">CPU %</TableHead>
              <TableHead className="h-10 text-[10px] font-bold uppercase text-slate-400">IO %</TableHead>
              <TableHead className="h-10 text-[10px] font-bold uppercase text-slate-400">Avg Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_QUERY_STATS.map((stat, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell className="py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-mono font-bold text-slate-700 truncate max-w-[250px]">{stat.query}</span>
                    <Badge variant="outline" className={cn(
                      "w-fit text-[8px] h-4 uppercase font-bold",
                      stat.impact === 'Critical' ? "text-rose-600 border-rose-200 bg-rose-50" :
                      stat.impact === 'High' ? "text-amber-600 border-amber-200 bg-amber-50" :
                      "text-slate-500 border-slate-200 bg-slate-50"
                    )}>
                      {stat.impact} Impact
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                    <Progress value={stat.cpu} className="h-1.5 w-12 bg-slate-100" />
                    <span className="text-[10px] font-bold text-slate-600">{stat.cpu}%</span>
                   </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={stat.io} className="h-1.5 w-12 bg-slate-100" />
                    <span className="text-[10px] font-bold text-slate-600">{stat.io}%</span>
                   </div>
                </TableCell>
                <TableCell className="text-xs font-bold text-rose-500">{stat.avgTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  const renderMaintenanceLog = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-emerald-700">98.2%</div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
          <div className="text-[10px] font-bold text-amber-600 uppercase mb-1">Warnings</div>
          <div className="text-2xl font-bold text-amber-700">3</div>
        </div>
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
          <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">Avg Duration</div>
          <div className="text-2xl font-bold text-blue-700">24m</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="h-10 text-[10px] font-bold uppercase text-slate-400">Task Name</TableHead>
              <TableHead className="h-10 text-[10px] font-bold uppercase text-slate-400">Timestamp</TableHead>
              <TableHead className="h-10 text-[10px] font-bold uppercase text-slate-400">Duration</TableHead>
              <TableHead className="h-10 text-[10px] font-bold uppercase text-slate-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_MAINTENANCE_LOG.map((log) => (
              <TableRow key={log.id} className="hover:bg-transparent">
                <TableCell className="py-4">
                  <span className="text-sm font-bold text-slate-700">{log.task}</span>
                  <div className="text-[10px] text-slate-400">{log.tables} tables affected</div>
                </TableCell>
                <TableCell className="text-xs font-medium text-slate-500">{log.date}</TableCell>
                <TableCell className="text-xs font-bold text-slate-600">{log.duration}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "font-bold text-[9px] px-2 py-0.5 rounded border-none uppercase",
                    log.status === 'Success' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="h-7 w-7 text-primary" />
            Reporting Center
          </h1>
          <p className="text-sm text-slate-400 font-medium">Generate professional database health audits and operational logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleGenerate} disabled={isGenerating} className="h-10 bg-primary text-white font-bold rounded-xl px-8 shadow-lg shadow-primary/10 transition-all active:scale-95">
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Aggregating...
              </>
            ) : "Generate New Report"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Selection */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white border-none shadow-sm rounded-3xl p-6">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-2">Report Types</div>
            <div className="space-y-3">
              {REPORT_TYPES.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl transition-all border-2 group",
                    selectedReport === report.id 
                      ? "bg-slate-50 border-primary" 
                      : "bg-white border-transparent hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", 
                      selectedReport === report.id ? "bg-primary text-white" : cn(report.bg, report.color)
                    )}>
                      <report.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-800">{report.title}</div>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{report.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-white border-none shadow-sm rounded-3xl p-6">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-2">Config Parameters</div>
            <div className="space-y-4">
              <div className="space-y-1.5 px-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Scope</label>
                <Select defaultValue={activeDb}>
                  <SelectTrigger className="h-10 rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={activeDb}>{activeDb}</SelectItem>
                    <SelectItem value="all">All Databases</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 px-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Time Range</label>
                <Select defaultValue="7d">
                  <SelectTrigger className="h-10 rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden min-h-[600px] flex flex-col relative">
            {isGenerating && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-300">
                <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                  <RefreshCw className="h-10 w-10 text-emerald-500 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Synthesizing Report</h3>
                <p className="text-sm text-slate-400 max-w-sm mt-2 font-medium">
                  Scanning system catalog and transaction logs for {activeDb}...
                </p>
              </div>
            )}
            
            <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  {REPORT_TYPES.find(r => r.id === selectedReport)?.title}
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 mt-1">
                  Generated for {activeDb} • {new Date().toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownload('PDF')} 
                  className="h-9 px-4 rounded-xl font-bold bg-white text-slate-600 gap-2 border-slate-200 shadow-none"
                >
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownload('CSV')} 
                  className="h-9 px-4 rounded-xl font-bold bg-white text-slate-600 gap-2 border-slate-200 shadow-none"
                >
                  <TableIcon className="h-3.5 w-3.5" />
                  CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-10 flex-1">
              {selectedReport === 'health-summary' && renderHealthSummary()}
              {selectedReport === 'query-perf' && renderQueryPerformance()}
              {selectedReport === 'maint-log' && renderMaintenanceLog()}
            </CardContent>
            <CardFooter className="p-10 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Clock className="h-3 w-3" />
                Last generated: Just now
              </div>
              <div className="text-[10px] font-bold text-slate-300 uppercase italic">
                Authorized Platform Audit Document
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
