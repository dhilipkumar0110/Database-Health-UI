"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  Search, 
  Database, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  ChevronRight, 
  Trash2, 
  Archive, 
  ShieldCheck,
  Filter,
  RefreshCw,
  AlertTriangle,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

type RedundantTable = {
  name: string
  reason: "Naming issue" | "Zero reads" | "Duplicate schema"
  lastAccessed: string
  size: string
  status: "pending" | "safe" | "archived" | "dropped"
}

const MOCK_REDUNDANCIES: Record<string, RedundantTable[]> = {
  "PortalDB": [
    { name: "users_backup_2023", reason: "Naming issue", lastAccessed: "142 days ago", size: "1.2 GB", status: "pending" },
    { name: "temp_orders_old", reason: "Naming issue", lastAccessed: "Never", size: "840 MB", status: "pending" },
    { name: "logs_archive_test", reason: "Zero reads", lastAccessed: "210 days ago", size: "14.5 GB", status: "pending" },
    { name: "customer_profiles_v2", reason: "Duplicate schema", lastAccessed: "12 days ago", size: "420 MB", status: "pending" },
  ],
  "ReportingDB": [
    { name: "sales_2022_final", reason: "Zero reads", lastAccessed: "380 days ago", size: "45 GB", status: "pending" },
    { name: "temp_results_backup", reason: "Naming issue", lastAccessed: "Never", size: "2.1 GB", status: "pending" },
  ]
}

export function RedundancyScanner({ activeDb = "PortalDB" }: { activeDb?: string }) {
  const [isScanning, setIsScanning] = React.useState(false)
  const [scanResults, setScanResults] = React.useState<RedundantTable[]>([])
  const [hasScanned, setHasScanned] = React.useState(false)

  const handleRunScan = () => {
    setIsScanning(true)
    // Simulate scan delay
    setTimeout(() => {
      setScanResults(MOCK_REDUNDANCIES[activeDb] || [])
      setIsScanning(false)
      setHasScanned(true)
      toast({
        title: "Scan Complete",
        description: `Identified ${MOCK_REDUNDANCIES[activeDb]?.length || 0} potentially redundant tables in ${activeDb}.`,
      })
    }, 1500)
  }

  const handleAction = (tableName: string, action: string) => {
    setScanResults(prev => prev.map(t => t.name === tableName ? { ...t, status: 'safe' } : t))
    toast({
      title: "Action Recorded",
      description: `${tableName} has been marked as ${action}.`,
    })
  }

  const totalSize = scanResults.reduce((acc, curr) => {
    const val = parseFloat(curr.size)
    return acc + (curr.size.includes('GB') ? val : val / 1024)
  }, 0).toFixed(1)

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
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
            {hasScanned ? "Rescan Database" : "Initiate Full Scan"}
          </Button>
        </div>
      </div>

      {!hasScanned && !isScanning ? (
        <Card className="border-dashed border-2 bg-slate-50/50 py-20">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center">
              <Database className="h-8 w-8 text-slate-200" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-700">Ready to Analyze {activeDb}</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Our AI engine will scan for tables matching redundancy patterns, zero-read metrics, and duplicate schemas to help you reclaim storage.
              </p>
            </div>
            <Button 
              onClick={handleRunScan}
              variant="outline" 
              className="mt-4 border-slate-200 hover:bg-white rounded-xl font-bold text-slate-600"
            >
              Start Identification Scan
            </Button>
          </CardContent>
        </Card>
      ) : isScanning ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
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

          {/* Results Table */}
          <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-6 pb-2 border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">Redundancy findings</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Identified via sys.dm_db_index_usage_stats & naming conventions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold text-slate-600 border-slate-200 rounded-lg">
                  Export Findings
                </Button>
                <Button className="h-8 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold rounded-lg px-4">
                  Bulk Archive All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 px-6">Table Name</TableHead>
                    <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Reason</TableHead>
                    <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Size</TableHead>
                    <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400">Last Accessed</TableHead>
                    <TableHead className="h-10 text-[9px] font-bold uppercase text-slate-400 text-right px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanResults.length > 0 ? (
                    scanResults.map((table, i) => (
                      <TableRow key={i} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                        <TableCell className="py-3 px-6">
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
                        <TableCell className="py-3">
                          <span className={cn(
                            "text-[10px] font-bold",
                            table.lastAccessed === "Never" ? "text-rose-500" : "text-slate-400"
                          )}>
                            {table.lastAccessed}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-right px-6">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAction(table.name, 'safe')}
                              className="h-7 w-7 p-0 text-emerald-600 border-slate-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-200"
                              title="Mark Safe"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAction(table.name, 'archived')}
                              className="h-7 w-7 p-0 text-amber-600 border-slate-200 rounded-lg hover:bg-amber-50 hover:border-amber-200"
                              title="Mark for Archive"
                            >
                              <Archive className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAction(table.name, 'dropped')}
                              className="h-7 w-7 p-0 text-rose-600 border-slate-200 rounded-lg hover:bg-rose-50 hover:border-rose-200"
                              title="Flag to Drop"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
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
    </div>
  )
}
