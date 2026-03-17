"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Download, 
  Filter, 
  X,
  AlertCircle,
  Table as TableIcon,
  Layers,
  CheckCircle2,
  RefreshCw,
  Zap,
  Play,
  Archive
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
import { Progress } from "@/components/ui/progress"
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

type TableData = {
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

const WEBPORTAL_TABLES: TableData[] = [
  { name: "Auth_Consult_Notes", schema: "dbo", status: "Healthy", statusVariant: "healthy", rowCount: "609,251", size: "420 MB", fragmentation: 8, lastRead: "1h ago", deadlocks: 0, slowQ: 2 },
  { name: "Claims_inquiry_Response", schema: "dbo", status: "Healthy", statusVariant: "healthy", rowCount: "44,738", size: "85 MB", fragmentation: 12, lastRead: "2h ago", deadlocks: 0, slowQ: 0 },
  { name: "POST_DISMISSALS", schema: "dbo", status: "Warning", statusVariant: "warning", rowCount: "1,586,110", size: "2.1 GB", fragmentation: 24, lastRead: "30m ago", deadlocks: 2, slowQ: 14 },
  { name: "PROV_CONSULT_NOTES", schema: "dbo", status: "Critical", statusVariant: "critical", rowCount: "5,570,747", size: "12.4 GB", fragmentation: 52, lastRead: "15m ago", deadlocks: 8, slowQ: 42 },
  { name: "REQUEST_LOG", schema: "audit", status: "Healthy", statusVariant: "healthy", rowCount: "331,196", size: "180 MB", fragmentation: 5, lastRead: "5m ago", deadlocks: 0, slowQ: 1 },
  { name: "REQUEST_LOG_FIELD", schema: "audit", status: "Warning", statusVariant: "warning", rowCount: "1,220,790", size: "840 MB", fragmentation: 31, lastRead: "10m ago", deadlocks: 1, slowQ: 8 },
  { name: "USER_ATTESTATIONS", schema: "auth", status: "Healthy", statusVariant: "healthy", rowCount: "1,220,790", size: "520 MB", fragmentation: 14, lastRead: "4h ago", deadlocks: 0, slowQ: 3 },
  { name: "USER_DBS", schema: "auth", status: "Healthy", statusVariant: "healthy", rowCount: "1,220,790", size: "310 MB", fragmentation: 18, lastRead: "6h ago", deadlocks: 0, slowQ: 0 },
  { name: "USER_DEMO_ACCOUNTS", schema: "auth", status: "Healthy", statusVariant: "healthy", rowCount: "15", size: "64 KB", fragmentation: 0, lastRead: "12h ago", deadlocks: 0, slowQ: 0 },
  { name: "USER_OTHER_ENTITIES", schema: "auth", status: "Healthy", statusVariant: "healthy", rowCount: "351,305", size: "115 MB", fragmentation: 9, lastRead: "1h ago", deadlocks: 0, slowQ: 2 },
  { name: "USER_PROVIDERS", schema: "auth", status: "Critical", statusVariant: "critical", rowCount: "9,098,052", size: "8.2 GB", fragmentation: 48, lastRead: "2m ago", deadlocks: 12, slowQ: 55 },
  { name: "USER_PROVIDERS_REQUESTED_2014", schema: "archive", status: "Warning", statusVariant: "warning", rowCount: "16,225,558", size: "14.1 GB", fragmentation: 32, lastRead: "Never", deadlocks: 0, slowQ: 0 },
  { name: "USERS", schema: "auth", status: "Healthy", statusVariant: "healthy", rowCount: "154,494", size: "45 MB", fragmentation: 4, lastRead: "1m ago", deadlocks: 0, slowQ: 1 },
  { name: "USERS_REQUESTED_2014", schema: "archive", status: "Healthy", statusVariant: "healthy", rowCount: "154,637", size: "28 MB", fragmentation: 12, lastRead: "Never", deadlocks: 0, slowQ: 0 },
  { name: "WEB_ALERT_2011", schema: "archive", status: "Warning", statusVariant: "warning", rowCount: "2,159,684", size: "1.8 GB", fragmentation: 22, lastRead: "Never", deadlocks: 0, slowQ: 0 },
  { name: "WEB_ALERT_MESSAGE_2011", schema: "archive", status: "Warning", statusVariant: "warning", rowCount: "2,119,059", size: "4.5 GB", fragmentation: 28, lastRead: "Never", deadlocks: 0, slowQ: 0 },
  { name: "WEB_ALERT_RESPONSE_2011", schema: "archive", status: "Warning", statusVariant: "warning", rowCount: "1,489,728", size: "1.2 GB", fragmentation: 25, lastRead: "Never", deadlocks: 0, slowQ: 0 },
  { name: "WEB_AUDIT_TRAIL", schema: "audit", status: "Critical", statusVariant: "critical", rowCount: "58,548,194", size: "142 GB", fragmentation: 62, lastRead: "Now", deadlocks: 24, slowQ: 182 },
  { name: "WEB_AUDIT_TRAIL_API", schema: "audit", status: "Healthy", statusVariant: "healthy", rowCount: "111", size: "128 KB", fragmentation: 0, lastRead: "10m ago", deadlocks: 0, slowQ: 0 },
  { name: "WEB_AUTH_ADJUSTS", schema: "auth", status: "Healthy", statusVariant: "healthy", rowCount: "0", size: "0 KB", fragmentation: 0, lastRead: "Never", deadlocks: 0, slowQ: 0 },
  { name: "WEB_AUTH_CHANGES", schema: "auth", status: "Critical", statusVariant: "critical", rowCount: "14,886,733", size: "18.4 GB", fragmentation: 55, lastRead: "1m ago", deadlocks: 15, slowQ: 92 },
  { name: "WEB_AUTH_DETAILS", schema: "auth", status: "Critical", statusVariant: "critical", rowCount: "22,069,814", size: "32.1 GB", fragmentation: 59, lastRead: "Now", deadlocks: 18, slowQ: 110 },
  { name: "WEB_AUTH_DIAGS", schema: "auth", status: "Critical", statusVariant: "critical", rowCount: "31,330,066", size: "12.8 GB", fragmentation: 64, lastRead: "Now", deadlocks: 21, slowQ: 145 },
  { name: "WEB_AUTH_MASTERS", schema: "auth", status: "Critical", statusVariant: "critical", rowCount: "19,278,092", size: "45.2 GB", fragmentation: 51, lastRead: "Now", deadlocks: 14, slowQ: 88 },
  { name: "WEB_AUTH_MEMOFLDS", schema: "auth", status: "Healthy", statusVariant: "healthy", rowCount: "150,634", size: "840 MB", fragmentation: 12, lastRead: "30m ago", deadlocks: 0, slowQ: 4 },
  { name: "WEB_AUTH_NOTES", schema: "auth", status: "Critical", statusVariant: "critical", rowCount: "31,693,191", size: "88.4 GB", fragmentation: 68, lastRead: "Now", deadlocks: 32, slowQ: 243 },
  { name: "WEB_AUTH_RETRO_ATTESTATION", schema: "auth", status: "Healthy", statusVariant: "healthy", rowCount: "150,634", size: "110 MB", fragmentation: 8, lastRead: "1h ago", deadlocks: 0, slowQ: 1 },
  { name: "WEB_AUTH_REVIEW_COMMENTS", schema: "auth", status: "Healthy", statusVariant: "healthy", rowCount: "186", size: "256 KB", fragmentation: 0, lastRead: "4h ago", deadlocks: 0, slowQ: 0 },
  { name: "WEB_FILE_BYTES_2009", schema: "archive", status: "Healthy", statusVariant: "healthy", rowCount: "36,321", size: "4.2 GB", fragmentation: 5, lastRead: "Never", deadlocks: 0, slowQ: 0 },
  { name: "WEB_FILE_UPLOAD_2009", schema: "archive", status: "Warning", statusVariant: "warning", rowCount: "6,554,727", size: "284 GB", fragmentation: 34, lastRead: "Never", deadlocks: 0, slowQ: 0 },
  { name: "WEB_FILE_UPLOAD_COMPLETED", schema: "dbo", status: "Healthy", statusVariant: "healthy", rowCount: "182,235", size: "420 MB", fragmentation: 11, lastRead: "20m ago", deadlocks: 0, slowQ: 2 },
  { name: "WEB_FILE_VIEW_2013", schema: "archive", status: "Healthy", statusVariant: "healthy", rowCount: "313", size: "12 MB", fragmentation: 0, lastRead: "Never", deadlocks: 0, slowQ: 0 },
  { name: "WEB_FILES_FROM_EZ6_2014", schema: "archive", status: "Warning", statusVariant: "warning", rowCount: "9,648,647", size: "412 GB", fragmentation: 38, lastRead: "Never", deadlocks: 0, slowQ: 0 },
  { name: "WEB_INQUIRY_2016", schema: "archive", status: "Healthy", statusVariant: "healthy", rowCount: "753,905", size: "1.4 GB", fragmentation: 15, lastRead: "Never", deadlocks: 0, slowQ: 0 },
]

const SUMMARY_STATS: Record<string, any[]> = {
  "WebPortalDB": [
    { label: "Tables", value: "34", subtext: "8 need action", color: "text-slate-900" },
    { label: "DB size", value: "842 GB", subtext: "+12% this month", color: "text-slate-900" },
    { label: "Avg fragmentation", value: "32%", subtext: "12 tables > 30%", color: "text-rose-600", tag: "dm_db_index_physical_stats" },
    { label: "Cache hit ratio", value: "89%", subtext: "Target > 95%", color: "text-amber-600", tag: "dm_os_performance_counters" },
    { label: "Deadlocks (24h)", value: "14", subtext: "+6 vs yesterday", color: "text-rose-600", tag: "dm_exec_requests" },
  ],
  "default": [
    { label: "Tables", value: "20", subtext: "4 need action", color: "text-slate-900" },
    { label: "DB size", value: "120 GB", subtext: "+2% this month", color: "text-slate-900" },
    { label: "Avg fragmentation", value: "18%", subtext: "3 tables > 30%", color: "text-amber-600", tag: "dm_db_index_physical_stats" },
    { label: "Cache hit ratio", value: "96%", subtext: "Target > 95%", color: "text-emerald-600", tag: "dm_os_performance_counters" },
    { label: "Deadlocks (24h)", value: "2", subtext: "Stable", color: "text-slate-900", tag: "dm_exec_requests" },
  ]
}

export function TableManager({ activeDb }: { activeDb: string }) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [selectedTables, setSelectedTables] = React.useState<string[]>([])
  const [isGroupModalOpen, setIsGroupModalOpen] = React.useState(false)
  const [groupName, setGroupName] = React.useState("")
  const [groups, setGroups] = React.useState<{name: string, tables: string[]}[]>([])
  const [isExecuting, setIsExecuting] = React.useState(false)

  const activeTables = activeDb === "WebPortalDB" ? WEBPORTAL_TABLES : WEBPORTAL_TABLES.slice(0, 7)
  const activeStats = SUMMARY_STATS[activeDb] || SUMMARY_STATS["default"]

  const filteredTables = React.useMemo(() => {
    return activeTables.filter(table => {
      const matchesSearch = table.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || table.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [activeTables, search, statusFilter])

  const isAllSelected = filteredTables.length > 0 && selectedTables.length === filteredTables.length

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedTables([])
    } else {
      setSelectedTables(filteredTables.map(t => t.name))
    }
  }

  const handleToggleOne = (name: string) => {
    setSelectedTables(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const handleExport = () => {
    const headers = ["Table Name", "Schema", "Status", "Row Count", "Size", "Fragmentation (%)", "Last Read", "Deadlocks", "Slow Q"]
    const rows = filteredTables.map(t => [
      t.name,
      t.schema,
      t.status,
      t.rowCount,
      t.size,
      t.fragmentation,
      t.lastRead,
      t.deadlocks,
      t.slowQ
    ])

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${activeDb}_tables_export.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCreateGroup = () => {
    if (!groupName) return
    const newGroup = { name: groupName, tables: [...selectedTables] }
    setGroups(prev => [...prev, newGroup])
    setGroupName("")
    setIsGroupModalOpen(false)
    toast({
      title: "Table Group Created",
      description: `Successfully added ${selectedTables.length} tables to "${groupName}".`,
    })
    setSelectedTables([])
  }

  const runBulkAction = (action: string) => {
    setIsExecuting(true)
    const tableCount = selectedTables.length
    
    setTimeout(() => {
      setIsExecuting(false)
      toast({
        title: `${action} Complete`,
        description: `Successfully processed ${tableCount} tables in ${activeDb}. Operation complete.`,
      })
      setSelectedTables([])
    }, 2000)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Table Manager</h1>
          <Badge className="bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#E6F4EA] border-none font-medium px-2 py-0.5 text-[10px]">
            {activeDb} - SQL Server
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-400">
            Last scan: today 08:42 AM
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs border-slate-300 rounded-full px-4 bg-white">
            Run Scan
          </Button>
          <Button 
            onClick={() => setIsGroupModalOpen(true)}
            size="sm" 
            className="h-8 bg-[#1E8E3E] hover:bg-[#1A7F37] gap-1.5 text-xs rounded-lg px-4"
          >
            <Plus className="h-3 w-3" />
            Add Table Group
          </Button>
        </div>
      </div>

      <div className="bg-[#FFF4E5] border border-amber-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <div className="text-[11px] font-medium text-amber-900 flex items-center gap-4">
            <span className="flex items-center gap-1"><strong className="font-bold">{activeDb === "WebPortalDB" ? "12 tables" : "3 tables"}</strong> fragmentation {'>'}30%</span>
            <span className="flex items-center gap-1"><strong className="font-bold">{activeDb === "WebPortalDB" ? "8 tables" : "2 tables"}</strong> no access in 60+ days</span>
            <span className="flex items-center gap-1"><strong className="font-bold">Pattern detection:</strong> Matches for _2011, _2014 archive patterns</span>
          </div>
        </div>
        <X className="h-4 w-4 text-amber-400 cursor-pointer hover:text-amber-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {activeStats.map((card, i) => (
          <Card key={i} className="bg-white border-none shadow-sm rounded-xl">
            <CardContent className="p-4 space-y-1">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{card.label}</span>
                {card.tag && <span className="text-[8px] text-slate-300 font-mono leading-none">{card.tag}</span>}
              </div>
              <div className={cn("text-xl font-bold", card.color)}>{card.value}</div>
              <div className="text-[10px] text-slate-400 font-bold">{card.subtext}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-slate-900">All tables — {activeDb}</h2>
            {groups.length > 0 && (
              <div className="flex items-center gap-2">
                <Layers className="h-3 w-3 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{groups.length} Groups Active</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input 
                placeholder="Search tables..." 
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
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs bg-white rounded-lg gap-1.5"
              onClick={handleExport}
            >
              <Download className="h-3 w-3" />
              Export
            </Button>
          </div>
        </div>

        {selectedTables.length > 0 && (
          <div className="flex items-center gap-3 p-2 px-4 bg-[#E8F0FE] border border-[#D2E3FC] rounded-xl animate-in slide-in-from-top-2">
            <span className="text-sm font-semibold text-[#1967D2] mr-2 whitespace-nowrap">
              {selectedTables.length} selected
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <Button 
                onClick={() => setIsGroupModalOpen(true)}
                disabled={isExecuting}
                variant="outline" 
                size="sm" 
                className="h-8 text-xs rounded-full bg-white border-white text-[#1967D2] hover:bg-white hover:text-[#185ABC] shadow-sm font-semibold px-4 whitespace-nowrap"
              >
                <Plus className="h-3 w-3 mr-1" />
                Create Group
              </Button>
              <Button 
                onClick={() => runBulkAction("Index Rebuild")}
                disabled={isExecuting}
                variant="outline" 
                size="sm" 
                className="h-8 text-xs rounded-full bg-white border-white text-[#1967D2] hover:bg-white hover:text-[#185ABC] shadow-sm font-semibold px-4 whitespace-nowrap"
              >
                {isExecuting ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
                Rebuild Indexes
              </Button>
              <Button 
                onClick={() => runBulkAction("Stats Update")}
                disabled={isExecuting}
                variant="outline" 
                size="sm" 
                className="h-8 text-xs rounded-full bg-white border-white text-[#1967D2] hover:bg-white hover:text-[#185ABC] shadow-sm font-semibold px-4 whitespace-nowrap"
              >
                <RefreshCw className={cn("h-3 w-3 mr-1", isExecuting && "animate-spin")} />
                Update Stats
              </Button>
              <Button 
                onClick={() => runBulkAction("Flag Archive")}
                disabled={isExecuting}
                variant="outline" 
                size="sm" 
                className="h-8 text-xs rounded-full bg-white border-white text-[#1967D2] hover:bg-white hover:text-[#185ABC] shadow-sm font-semibold px-4 whitespace-nowrap"
              >
                <Archive className="h-3 w-3 mr-1" />
                Flag Archive
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 text-center">
                  <Checkbox 
                    checked={isAllSelected}
                    onCheckedChange={handleToggleAll}
                    className="h-4 w-4"
                  />
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">
                  <div className="flex flex-col">
                    Table name <span className="text-[8px] font-mono opacity-50">sys.tables</span>
                  </div>
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">
                  <div className="flex flex-col">
                    Row count <span className="text-[8px] font-mono opacity-50">dm_d...</span>
                  </div>
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Size</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">
                  <div className="flex flex-col">
                    Fragmentation <span className="text-[8px] font-mono opacity-50">dm_db_index...</span>
                  </div>
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">
                  <div className="flex flex-col">
                    Last read <span className="text-[8px] font-mono opacity-50">dm_db_ind...</span>
                  </div>
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Deadlocks</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Slow Q</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase text-slate-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTables.map((table, i) => {
                const tableGroups = groups.filter(g => g.tables.includes(table.name))
                return (
                  <TableRow 
                    key={i} 
                    className={cn(
                      "group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0",
                      selectedTables.includes(table.name) && "bg-slate-50/80"
                    )}
                  >
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={selectedTables.includes(table.name)}
                        onCheckedChange={() => handleToggleOne(table.name)}
                        className="h-4 w-4"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-800">{table.name}</span>
                        {tableGroups.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {tableGroups.map(g => (
                              <Badge key={g.name} variant="outline" className="text-[8px] font-bold bg-slate-50 text-slate-400 h-4 border-slate-200">
                                {g.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          "font-bold text-[9px] px-2 py-0.5 rounded border-none shadow-none",
                          table.statusVariant === "critical" && "bg-rose-50 text-rose-500",
                          table.statusVariant === "warning" && "bg-amber-50 text-amber-600",
                          table.statusVariant === "healthy" && "bg-emerald-50 text-emerald-600"
                        )}
                      >
                        {table.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-600">{table.rowCount}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-600">{table.size}</TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              table.fragmentation > 50 ? "bg-rose-500" : table.fragmentation > 20 ? "bg-amber-500" : "bg-emerald-500"
                            )}
                            style={{ width: `${table.fragmentation}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold w-7 text-right",
                          table.fragmentation > 50 ? "text-rose-500" : table.fragmentation > 20 ? "text-amber-500" : "text-emerald-500"
                        )}>
                          {table.fragmentation}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold text-slate-500">{table.lastRead}</TableCell>
                    <TableCell className="text-xs font-bold text-rose-500">{table.deadlocks}</TableCell>
                    <TableCell className="text-xs font-bold text-rose-500">{table.slowQ}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold rounded-lg border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredTables.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center text-slate-400 font-medium">
                    No tables found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isGroupModalOpen} onOpenChange={setIsGroupModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#1E8E3E]" />
              Create Table Group
            </DialogTitle>
            <DialogDescription>
              Organize related tables into a group for easier monitoring and bulk management.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="group-name" className="text-sm font-semibold">Group Name</Label>
              <Input 
                id="group-name" 
                placeholder="e.g., Financial_Records, Archive_Candidates" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="h-10 border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Selected Tables ({selectedTables.length})</Label>
              <div className="max-h-[120px] overflow-y-auto p-3 bg-slate-50 rounded-lg border border-slate-200">
                {selectedTables.length > 0 ? (
                  <ul className="text-xs font-medium text-slate-600 space-y-1">
                    {selectedTables.map(t => (
                      <li key={t} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No tables selected. Close this and select tables first.</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGroupModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateGroup} 
              disabled={!groupName || selectedTables.length === 0}
              className="bg-[#1E8E3E] hover:bg-[#1A7F37]"
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
