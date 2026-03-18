
"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  Search, 
  Database, 
  RefreshCw, 
  Trash2, 
  Archive, 
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  Table as TableIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

type RedundantTable = {
  name: string
  reason: "Naming issue" | "Zero reads" | "Duplicate schema"
  lastAccessed: string
  size: string
}

const MOCK_REDUNDANCIES: Record<string, RedundantTable[]> = {
  "WebPortalDB": [
    { name: "users_backup_2023", reason: "Naming issue", lastAccessed: "142 days ago", size: "1.2 GB" },
    { name: "temp_orders_old", reason: "Naming issue", lastAccessed: "Never", size: "840 MB" },
    { name: "logs_archive_test", reason: "Zero reads", lastAccessed: "210 days ago", size: "14.5 GB" },
    { name: "customer_profiles_v2", reason: "Duplicate schema", lastAccessed: "12 days ago", size: "420 MB" },
    { name: "audit_trail_tmp_01", reason: "Naming issue", lastAccessed: "Never", size: "3.2 GB" },
  ],
  "ReportingDB": [
    { name: "sales_2022_final", reason: "Zero reads", lastAccessed: "380 days ago", size: "45 GB" },
    { name: "temp_results_backup", reason: "Naming issue", lastAccessed: "Never", size: "2.1 GB" },
    { name: "legacy_reports_v1", reason: "Zero reads", lastAccessed: "1 year ago", size: "12.4 GB" },
  ]
}

const DEFAULT_REDUNDANCIES: RedundantTable[] = [
  { name: "staging_data_temp_copy", reason: "Naming issue", lastAccessed: "89 days ago", size: "2.4 GB" },
  { name: "old_audit_logs_archive", reason: "Zero reads", lastAccessed: "Never", size: "18.2 GB" },
  { name: "legacy_metadata_v2", reason: "Duplicate schema", lastAccessed: "210 days ago", size: "540 MB" },
  { name: "temp_transaction_log", reason: "Naming issue", lastAccessed: "Never", size: "4.1 GB" },
]

export function RedundancyScanner({ 
  activeDb = "WebPortalDB", 
  serverName = "SQLSRV-PROD-01",
  onCreateTask 
}: { 
  activeDb?: string, 
  serverName?: string,
  onCreateTask: (task: any) => void 
}) {
  const [isScanning, setIsScanning] = React.useState(false)
  const [hasScanned, setHasScanned] = React.useState(true)
  const [scanResults, setScanResults] = React.useState<RedundantTable[]>(MOCK_REDUNDANCIES[activeDb] || DEFAULT_REDUNDANCIES)
  
  const [selectedTables, setSelectedTables] = React.useState<string[]>([])
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false)
  const [taskName, setTaskName] = React.useState("")
  const [currentActionType, setCurrentActionType] = React.useState<"Safe" | "Archive" | "Drop">("Safe")

  // Update results when active database changes
  React.useEffect(() => {
    setScanResults(MOCK_REDUNDANCIES[activeDb] || DEFAULT_REDUNDANCIES)
    setSelectedTables([])
  }, [activeDb])

  const handleRunScan = () => {
    setIsScanning(true)
    setSelectedTables([])
    setTimeout(() => {
      const results = MOCK_REDUNDANCIES[activeDb] || DEFAULT_REDUNDANCIES
      setScanResults(results)
      setIsScanning(false)
      setHasScanned(true)
      toast({
        title: "Scan Complete",
        description: `Identified ${results.length} potentially redundant tables in ${activeDb}.`,
      })
    }, 1500)
  }

  const isAllSelected = scanResults.length > 0 && selectedTables.length === scanResults.length

  const handleToggleAll = () => {
    if (isAllSelected) setSelectedTables([])
    else setSelectedTables(scanResults.map(t => t.name))
  }

  const handleToggleOne = (name: string) => {
    setSelectedTables(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  const openTaskCreation = (type: "Safe" | "Archive" | "Drop") => {
    setCurrentActionType(type)
    setTaskName(`${type} Task - ${new Date().toLocaleDateString()}`)
    setIsTaskModalOpen(true)
  }

  const handleFinalizeTask = () => {
    // Map actions
    const type = currentActionType === "Archive" ? "Archiving" : "Multi-Task"
    
    onCreateTask({
      name: taskName,
      type: type,
      actions: currentActionType === "Archive" ? ["Archiving"] : ["Scanning"],
      server: serverName,
      database: activeDb,
      tables: [...selectedTables]
    })
    
    setIsTaskModalOpen(false)
    setSelectedTables([])
    toast({
      title: "Task Created",
      description: `Task for ${selectedTables.length} tables added to the Task Manager.`,
    })
  }

  const totalSize = scanResults.reduce((acc, curr) => {
    const val = parseFloat(curr.size)
    return acc + (curr.size.includes('GB') ? val : val / 1024)
  }, 0).toFixed(1)

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Redundancy Scan</h1>
          <Badge className="bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#E6F4EA] border-none font-medium px-2 py-0.5 text-[10px]">
            {activeDb}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Pattern match: _backup, _old, _date, temp_</span>
          <Button 
            onClick={handleRunScan}
            disabled={isScanning}
            className="h-9 bg-[#1E8E3E] hover:bg-[#1A7F37] text-white text-xs font-bold rounded-lg px-6 shadow-sm gap-2"
          >
            {isScanning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            Rescan Database
          </Button>
        </div>
      </div>

      {isScanning ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse h-24 bg-white border-none shadow-sm" />
            ))}
          </div>
          <Card className="animate-pulse h-96 bg-white border-none shadow-sm" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white border-none shadow-sm rounded-xl">
              <CardContent className="p-4 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Total suspected</span>
                <div className="text-xl font-bold text-slate-900">{scanResults.length} Tables</div>
                <div className="text-[10px] text-amber-600 font-bold">Needs review</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-sm rounded-xl">
              <CardContent className="p-4 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Potential savings</span>
                <div className="text-xl font-bold text-[#1E8E3E]">{totalSize} GB</div>
                <div className="text-[10px] text-slate-400 font-bold">Reclaimable space</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-sm rounded-xl">
              <CardContent className="p-4 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Naming issues</span>
                <div className="text-xl font-bold text-slate-900">
                  {scanResults.filter(t => t.reason === "Naming issue").length}
                </div>
                <div className="text-[10px] text-slate-400 font-bold">Pattern matches</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-sm rounded-xl">
              <CardContent className="p-4 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Duplicate schemas</span>
                <div className="text-xl font-bold text-slate-900">
                  {scanResults.filter(t => t.reason === "Duplicate schema").length}
                </div>
                <div className="text-[10px] text-slate-400 font-bold">Identical DDL</div>
              </CardContent>
            </Card>
          </div>

          {/* Selection Bar */}
          {selectedTables.length > 0 && (
            <div className="flex items-center justify-between p-3 px-6 bg-[#E8F0FE] border border-[#D2E3FC] rounded-2xl animate-in slide-in-from-top-2 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#1967D2] mr-4 whitespace-nowrap flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#1967D2] animate-pulse" />
                  {selectedTables.length} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => openTaskCreation("Safe")} 
                    className="h-10 px-6 rounded-full bg-white hover:bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold shadow-sm gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Mark Safe
                  </Button>
                  <Button 
                    onClick={() => openTaskCreation("Archive")} 
                    className="h-10 px-6 rounded-full bg-white hover:bg-amber-50 text-amber-600 border border-amber-100 font-bold shadow-sm gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    Mark for Archive
                  </Button>
                  <Button 
                    onClick={() => openTaskCreation("Drop")} 
                    className="h-10 px-6 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-100 font-bold shadow-sm gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Flag to Drop
                  </Button>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedTables([])}
                className="h-8 w-8 rounded-full text-slate-500 hover:bg-white/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Results Table */}
          <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-6 pb-2 border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">Redundancy findings</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Identified via sys.dm_db_index_usage_stats & naming conventions</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="w-12 text-center">
                      <Checkbox checked={isAllSelected} onCheckedChange={handleToggleAll} className="h-4 w-4" />
                    </TableHead>
                    <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Table Name</TableHead>
                    <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Reason</TableHead>
                    <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Size</TableHead>
                    <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 px-6">Last Accessed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanResults.length > 0 ? (
                    scanResults.map((table, i) => (
                      <TableRow key={i} className={cn("group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0", selectedTables.includes(table.name) && "bg-slate-50/80")}>
                        <TableCell className="text-center">
                          <Checkbox checked={selectedTables.includes(table.name)} onCheckedChange={() => handleToggleOne(table.name)} className="h-4 w-4" />
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">{table.name}</span>
                            {table.lastAccessed === "Never" && (
                              <Badge className="bg-rose-50 text-rose-500 border-none text-[8px] font-bold uppercase px-1.5 h-4">Obsolete</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge 
                            className={cn(
                              "font-bold text-[8px] px-2 py-0.5 rounded border-none shadow-none uppercase tracking-tighter",
                              table.reason === "Naming issue" && "bg-amber-50 text-amber-600",
                              table.reason === "Zero reads" && "bg-rose-50 text-rose-600",
                              table.reason === "Duplicate schema" && "bg-blue-50 text-blue-600"
                            )}
                          >
                            {table.reason}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-xs font-bold text-slate-600">
                          {table.size}
                        </TableCell>
                        <TableCell className="py-3 px-6">
                          <span className={cn(
                            "text-[10px] font-bold",
                            table.lastAccessed === "Never" ? "text-rose-500" : "text-slate-400"
                          )}>
                            {table.lastAccessed}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-50" />
                        No redundancies identified in {activeDb}.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#FFF8F1] border-amber-100 rounded-2xl p-6 flex gap-4 shadow-none">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-900 uppercase tracking-tight">Best Practice Recommendation</h4>
                <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
                  Tables with suffixes like <code className="bg-amber-200/50 px-1 rounded text-[10px]">_backup</code> or <code className="bg-amber-200/50 px-1 rounded text-[10px]">_old</code> often contribute to "data drift" where stale data is accidentally queried or maintained. We recommend a strict 30-day archival policy for such objects.
                </p>
              </div>
            </Card>

            <Card className="bg-[#F8FAFC] border-slate-200 rounded-2xl p-6 flex gap-4 shadow-none">
              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <Info className="h-5 w-5 text-slate-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Detection Logic</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Our system evaluates redundancy by comparing the structural DDL of tables and analyzing <code className="bg-slate-200/50 px-1 rounded text-[10px]">user_scans</code> and <code className="bg-slate-200/50 px-1 rounded text-[10px]">user_lookups</code> from system dynamic management views.
                </p>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Task Creation Dialog */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              {currentActionType === "Safe" ? <ShieldCheck className="h-6 w-6 text-emerald-500" /> : 
               currentActionType === "Archive" ? <Archive className="h-6 w-6 text-amber-500" /> : 
               <Trash2 className="h-6 w-6 text-rose-500" />}
              Create {currentActionType} Task
            </DialogTitle>
            <DialogDescription className="text-sm font-medium">
              You are about to create a maintenance task for {selectedTables.length} selected table(s).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="redundancy-task-name" className="text-sm font-bold text-slate-700">Task Name</Label>
              <Input 
                id="redundancy-task-name" 
                value={taskName} 
                onChange={(e) => setTaskName(e.target.value)} 
                className="h-11 border-slate-200 rounded-xl" 
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-700">Selected Tables ({selectedTables.length})</Label>
              <div className="border rounded-2xl bg-slate-50/50 p-1 border-slate-100 overflow-hidden">
                <ScrollArea className="h-[140px]">
                  <div className="p-3 grid grid-cols-2 gap-2">
                    {selectedTables.map(t => (
                      <div key={t} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <TableIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-700 truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
          <DialogFooter className="bg-slate-50/50 p-6 -mx-6 -mb-6 border-t rounded-b-[2rem]">
            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)} className="rounded-xl font-bold h-11 px-8">Cancel</Button>
            <Button 
              onClick={handleFinalizeTask} 
              disabled={!taskName} 
              className={cn(
                "font-bold h-11 px-10 rounded-xl shadow-lg text-white",
                currentActionType === "Safe" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" :
                currentActionType === "Archive" ? "bg-amber-600 hover:bg-amber-700 shadow-amber-100" :
                "bg-rose-600 hover:bg-rose-700 shadow-rose-100"
              )}
            >
              Confirm & Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
