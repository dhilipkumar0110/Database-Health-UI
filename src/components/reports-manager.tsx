"use client"

import * as React from "react"
import { 
  FileText, 
  Download, 
  Mail, 
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
  AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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

export function ReportsManager({ activeDb }: { activeDb: string }) {
  const [selectedReport, setSelectedReport] = React.useState(REPORT_TYPES[0].id)
  const [isGenerating, setIsGenerating] = React.useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Report Generated",
        description: `The ${REPORT_TYPES.find(r => r.id === selectedReport)?.title} is ready for review.`,
      })
    }, 1500)
  }

  const handleDownload = (format: string) => {
    toast({
      title: "Download Started",
      description: `Your report is being prepared in ${format} format.`,
    })
  }

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
          <Button variant="outline" className="h-10 rounded-xl gap-2 text-slate-600 bg-white">
            <Mail className="h-4 w-4" />
            Schedule Delivery
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating} className="h-10 bg-primary text-white font-bold rounded-xl px-6 shadow-lg shadow-primary/10">
            {isGenerating ? "Processing..." : "Generate New Report"}
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
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", report.bg, report.color)}>
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
          <Card className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden min-h-[600px] flex flex-col">
            <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  {REPORT_TYPES.find(r => r.id === selectedReport)?.title} Preview
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 mt-1">
                  Draft generated for {activeDb} • {new Date().toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload('PDF')} className="h-9 px-4 rounded-xl font-bold bg-white text-slate-600 gap-2">
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload('CSV')} className="h-9 px-4 rounded-xl font-bold bg-white text-slate-600 gap-2">
                  <TableIcon className="h-3.5 w-3.5" />
                  CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-10 flex-1">
              {selectedReport === 'maint-log' ? (
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
              ) : selectedReport === 'health-summary' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 text-center py-20">
                  <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="h-10 w-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Preview Data Loading</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Aggregating fragmentation metrics and storage capacity trends from {activeDb}.
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-0" />
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-150" />
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-300" />
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 text-center py-20">
                  <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                    <PieChart className="h-10 w-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Query Performance Trace</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Analyzing sys.dm_exec_query_stats for top CPU and IO consuming queries.
                  </p>
                  <Button variant="outline" className="mt-6 rounded-xl border-slate-200">
                    Refresh Source Data
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-10 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Clock className="h-3 w-3" />
                Next scheduled generation: Monday at 08:00 AM
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
