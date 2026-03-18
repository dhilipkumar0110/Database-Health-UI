
"use client"

import * as React from "react"
import { 
  X,
  Table as TableIcon,
  RefreshCw,
  Zap,
  Archive,
  Database,
  Server as ServerIcon,
  ArrowLeft,
  Search as SearchIcon,
  AlertCircle,
  MoreVertical,
  Activity,
  ShieldAlert
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TableDetailsView } from "./table-details-view"

export type TableData = {
  name: string
  schema: string
  status: string
  statusVariant: "critical" | "warning" | "healthy"
  rowCount: string
  size: string
  fragmentation: number
  lastRead: string
  deadlocks: number
  slowQ: number
}

const ALL_MOCK_TABLES: TableData[] = [
  { name: "Auth_Consult_Notes", schema: "dbo", status: "Healthy", statusVariant: "healthy", rowCount: "609,251", size: "420 MB", fragmentation: 8, lastRead: "1h ago", deadlocks: 0, slowQ: 2 },
  { name: "Claims_inquiry_Response", schema: "dbo", status: "Healthy", statusVariant: "healthy", rowCount: "44,738", size: "85 MB", fragmentation: 12, lastRead: "2h ago", deadlocks: 0, slowQ: 0 },
  { name: "POST_DISMISSALS", schema: "dbo", status: "Warning", statusVariant: "warning", rowCount: "1,586,110", size: "2.1 GB", fragmentation: 24, lastRead: "30m ago", deadlocks: 2, slowQ: 14 },
  { name: "PROV_CONSULT_NOTES", schema: "dbo", status: "Critical", statusVariant: "critical", rowCount: "5,570,747", size: "12.4 GB", fragmentation: 52, lastRead: "15m ago", deadlocks: 8, slowQ: 42 },
  { name: "REQUEST_LOG", schema: "audit", status: "Healthy", statusVariant: "healthy", rowCount: "331,196", size: "180 MB", fragmentation: 5, lastRead: "5m ago", deadlocks: 0, slowQ: 1 },
  { name: "USERS", schema: "auth", status: "Healthy", statusVariant: "healthy", rowCount: "154,494", size: "45 MB", fragmentation: 4, lastRead: "1m ago", deadlocks: 0, slowQ: 1 },
  { name: "WEB_AUDIT_TRAIL", schema: "audit", status: "Critical", statusVariant: "critical", rowCount: "58,548,194", size: "142 GB", fragmentation: 62, lastRead: "Now", deadlocks: 24, slowQ: 182 },
  { name: "WEB_AUTH_DETAILS", schema: "auth", status: "Critical", statusVariant: "critical", rowCount: "22,069,814", size: "32.1 GB", fragmentation: 59, lastRead: "Now", deadlocks: 18, slowQ: 110 },
  { name: "WEB_AUTH_NOTES", schema: "auth", status: "Critical", statusVariant: "critical", rowCount: "31,693,191", size: "88.4 GB", fragmentation: 68, lastRead: "Now", deadlocks: 32, slowQ: 243 },
  { name: "USER_PROVIDERS", schema: "auth", status: "Critical", statusVariant: "critical", rowCount: "9,098,052", size: "8.2 GB", fragmentation: 48, lastRead: "2m ago", deadlocks: 12, slowQ: 55 },
  { name: "WEB_AUTH_DIAGS", schema: "auth", status: "Critical", statusVariant: "critical", rowCount: "31,330,066", size: "12.8 GB", fragmentation: 64, lastRead: "Now", deadlocks: 21, slowQ: 145 },
  { name: "WEB_AUTH_CHANGES", schema: "auth", status: "Critical", statusVariant: "critical", rowCount: "14,886,733", size: "18.4 GB", fragmentation: 55, lastRead: "1m ago", deadlocks: 15, slowQ: 92 },
]

export function TableManager({ 
  activeDb, 
  serverName, 
  monitoredTables,
  onCreateTask 
}: { 
  activeDb: string, 
  serverName: string,
  monitoredTables: string[],
  onCreateTask: (task: any) => void 
}) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [selectedTables, setSelectedTables] = React.useState<string[]>([])
  const [viewMode, setViewMode] = React.useState<'list' | 'details'>('list')
  const [selectedTableForDetails, setSelectedTableForDetails] = React.useState<TableData | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false)
  const [currentTaskType, setCurrentTaskType] = React.useState<any>(null)
  const [taskName, setTaskName] = React.useState("")

  const activeTables = React.useMemo(() => {
    return ALL_MOCK_TABLES.filter(t => monitoredTables.includes(t.name))
  }, [monitoredTables])

  const filteredTables = React.useMemo(() => {
    return activeTables.filter(table => {
      const matchesSearch = table.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || table.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [activeTables, search, statusFilter])

  const isAllSelected = filteredTables.length > 0 && selectedTables.length === filteredTables.length

  const handleToggleAll = () => {
    if (isAllSelected) setSelectedTables([])
    else setSelectedTables(filteredTables.map(t => t.name))
  }

  const handleToggleOne = (name: string) => {
    setSelectedTables(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  const openTaskCreation = (type: 'Archiving' | 'Index Rebuild' | 'Update Stats' | 'Scanning') => {
    setCurrentTaskType(type)
    setTaskName(`${type} - ${new Date().toLocaleDateString()}`)
    setIsTaskModalOpen(true)
  }

  const handleFinalizeTask = () => {
    onCreateTask({
      name: taskName,
      type: currentTaskType,
      server: serverName,
      database: activeDb,
      tables: [...selectedTables]
    })
    setIsTaskModalOpen(false)
    setSelectedTables([])
    toast({
      title: `${currentTaskType} Task Created`,
      description: `Task "${taskName}" has been added to the Task Manager.`,
    })
  }

  if (viewMode === 'details' && selectedTableForDetails) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{selectedTableForDetails.name}</h1>
              <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-400 text-[9px] font-bold uppercase tracking-tight py-0 h-5">
                Last Scan: today 08:42 AM
              </Badge>
            </div>
            <p className="text-sm text-slate-400 font-medium">Detailed Analytics & Health Insights</p>
          </div>
        </div>
        <TableDetailsView table={selectedTableForDetails} />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Summary Header */}
      <div className="space-y-6">
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-amber-900"><strong className="font-extrabold text-amber-950">3 tables</strong> fragmentation {'>'}30%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-amber-900"><strong className="font-extrabold text-amber-950">2 tables</strong> no access in 60+ days</span>
            </div>
            <div className="flex items-center gap-2 border-l border-amber-200 pl-6">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-tight">Pattern detection:</span>
              <span className="text-xs font-medium text-amber-900 italic">Matches for _2011, _2014 archive patterns</span>
            </div>
          </div>
          <X className="h-4 w-4 text-amber-400 cursor-pointer hover:text-amber-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-white border-none shadow-sm rounded-2xl p-6">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tables</div>
            <div className="text-3xl font-bold text-slate-900">{monitoredTables.length}</div>
          </Card>
          <Card className="bg-white border-none shadow-sm rounded-2xl p-6">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">DB Size</div>
            <div className="text-3xl font-bold text-slate-900">120 GB</div>
          </Card>
          <Card className="bg-white border-none shadow-sm rounded-2xl p-6">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Avg Fragmentation</div>
            <div className="text-3xl font-bold text-amber-500">18%</div>
          </Card>
          <Card className="bg-white border-none shadow-sm rounded-2xl p-6">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cache Hit Ratio</div>
            <div className="text-3xl font-bold text-emerald-500">96%</div>
          </Card>
          <Card className="bg-white border-none shadow-sm rounded-2xl p-6">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Deadlocks (24h)</div>
            <div className="text-3xl font-bold text-slate-900">2</div>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-900">Active monitored tables</h2>
            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px]">{filteredTables.length} result(s)</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input 
                placeholder="Search monitored tables..." 
                className="h-8 text-xs pl-8 w-48 bg-white border-slate-200 rounded-lg shadow-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs w-28 bg-white border-slate-200 rounded-lg shadow-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedTables.length > 0 && (
          <div className="flex items-center gap-3 p-2 px-4 bg-[#E8F0FE] border border-[#D2E3FC] rounded-xl animate-in slide-in-from-top-2">
            <span className="text-sm font-semibold text-[#1967D2] mr-2 whitespace-nowrap">
              {selectedTables.length} selected
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <Button onClick={() => openTaskCreation('Index Rebuild')} variant="outline" size="sm" className="h-8 text-xs rounded-full bg-white border-white text-[#1967D2] hover:bg-white hover:text-[#185ABC] shadow-sm font-semibold px-4 whitespace-nowrap">
                <Zap className="h-3 w-3 mr-1" /> Rebuild Indexes
              </Button>
              <Button onClick={() => openTaskCreation('Update Stats')} variant="outline" size="sm" className="h-8 text-xs rounded-full bg-white border-white text-[#1967D2] hover:bg-white hover:text-[#185ABC] shadow-sm font-semibold px-4 whitespace-nowrap">
                <RefreshCw className="h-3 w-3 mr-1" /> Update Stats
              </Button>
              <Button onClick={() => openTaskCreation('Archiving')} variant="outline" size="sm" className="h-8 text-xs rounded-full bg-white border-white text-[#1967D2] hover:bg-white hover:text-[#185ABC] shadow-sm font-semibold px-4 whitespace-nowrap">
                <Archive className="h-3 w-3 mr-1" /> Flag Archive
              </Button>
              <Button onClick={() => openTaskCreation('Scanning')} variant="outline" size="sm" className="h-8 text-xs border-[#1967D2] rounded-full px-6 bg-white text-[#1967D2] hover:bg-[#E8F0FE] font-bold shadow-sm">
                <SearchIcon className="h-3 w-3 mr-1.5" /> Run Scan
              </Button>
            </div>
          </div>
        )}

        {filteredTables.length === 0 ? (
          <Card className="border-dashed border-2 bg-slate-50/50 py-20">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                <TableIcon className="h-8 w-8 text-slate-200" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-700">No tables monitored</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Use the "Configure Tables" screen on the dashboard to select tables for monitoring in {activeDb}.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12 text-center">
                    <Checkbox checked={isAllSelected} onCheckedChange={handleToggleAll} className="h-4 w-4" />
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-slate-400">Table name</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-slate-400">Status</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-slate-400">Row count</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-slate-400">Size</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-slate-400">Fragmentation</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-slate-400">Deadlocks</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-slate-400">Slow Qs</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-slate-400">Last read</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase text-slate-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTables.map((table, i) => (
                  <TableRow key={i} className={cn("group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0", selectedTables.includes(table.name) && "bg-slate-50/80")}>
                    <TableCell className="text-center">
                      <Checkbox checked={selectedTables.includes(table.name)} onCheckedChange={() => handleToggleOne(table.name)} className="h-4 w-4" />
                    </TableCell>
                    <TableCell><span className="text-sm font-bold text-slate-800">{table.name}</span></TableCell>
                    <TableCell>
                      <Badge className={cn("font-bold text-[9px] px-2 py-0.5 rounded border-none shadow-none", table.statusVariant === "critical" ? "bg-rose-50 text-rose-500" : table.statusVariant === "warning" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600")}>
                        {table.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-600">{table.rowCount}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-600">{table.size}</TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", table.fragmentation > 50 ? "bg-rose-500" : table.fragmentation > 20 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${table.fragmentation}%` }} />
                        </div>
                        <span className={cn("text-[10px] font-bold w-7 text-right", table.fragmentation > 50 ? "text-rose-500" : table.fragmentation > 20 ? "text-amber-500" : "text-emerald-500")}>
                          {table.fragmentation}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-700">
                        <Activity className="h-3 w-3 text-slate-300" />
                        {table.deadlocks}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500">
                        <Zap className="h-3 w-3 text-orange-300" />
                        {table.slowQ}
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold text-slate-500">{table.lastRead}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedTableForDetails(table); setViewMode('details'); }} className="h-7 text-[10px] font-bold rounded-lg border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentTaskType === 'Archiving' && <Archive className="h-5 w-5 text-amber-500" />}
              {currentTaskType === 'Index Rebuild' && <Zap className="h-5 w-5 text-blue-500" />}
              {currentTaskType === 'Update Stats' && <RefreshCw className="h-5 w-5 text-emerald-500" />}
              {currentTaskType === 'Scanning' && <SearchIcon className="h-5 w-5 text-purple-500" />}
              Create {currentTaskType} Task
            </DialogTitle>
            <DialogDescription>Set up a {currentTaskType?.toLowerCase()} operation for the selected tables.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-name" className="text-sm font-semibold">Task Name</Label>
              <Input id="task-name" value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="e.g., Weekly Audit Scan" className="h-11 border-slate-200" />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Affected Tables Preview ({selectedTables.length})</Label>
              <div className="border rounded-xl bg-slate-50 p-1">
                <ScrollArea className="h-[180px]">
                  <div className="p-3 space-y-2">
                    {selectedTables.map(t => (
                      <div key={t} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                        <TableIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs font-medium text-slate-700">{t}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-[#F8FAFC] flex gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Context</div>
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5"><ServerIcon className="h-3 w-3 text-slate-400" /><span className="text-xs font-bold text-slate-700">{serverName}</span></div>
                  <div className="flex items-center gap-1.5"><Database className="h-3 w-3 text-slate-400" /><span className="text-xs font-bold text-slate-700">{activeDb}</span></div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
            <Button onClick={handleFinalizeTask} disabled={!taskName} className="bg-primary hover:bg-primary/90 text-white font-bold">Finalize Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
