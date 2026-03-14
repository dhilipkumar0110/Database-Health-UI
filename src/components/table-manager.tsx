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
  Table as TableIcon
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

const MOCK_TABLES = [
  { name: "invoices", schema: "sys.tables", status: "Critical", statusVariant: "critical", rowCount: "4.2M", size: "245 GB", fragmentation: 68, lastRead: "2h ago", deadlocks: 12, slowQ: 58 },
  { name: "orders", schema: "sys.tables", status: "Critical", statusVariant: "critical", rowCount: "8.1M", size: "182 GB", fragmentation: 54, lastRead: "15m ago", deadlocks: 9, slowQ: 41 },
  { name: "payments", schema: "sys.tables", status: "Critical", statusVariant: "critical", rowCount: "3.7M", size: "98 GB", fragmentation: 47, lastRead: "1h ago", deadlocks: 7, slowQ: 33 },
  { name: "customers", schema: "sys.tables", status: "Warning", statusVariant: "warning", rowCount: "920K", size: "45 GB", fragmentation: 28, lastRead: "30m ago", deadlocks: 3, slowQ: 14 },
  { name: "session_history", schema: "sys.tables", status: "Critical", statusVariant: "critical", rowCount: "22M", size: "310 GB", fragmentation: 61, lastRead: "5m ago", deadlocks: 17, slowQ: 97 },
  { name: "audit_logs", schema: "sys.tables", status: "Warning", statusVariant: "warning", rowCount: "15M", size: "198 GB", fragmentation: 22, lastRead: "10m ago", deadlocks: 4, slowQ: 25 },
  { name: "products", schema: "sys.tables", status: "Healthy", statusVariant: "healthy", rowCount: "48K", size: "3.2 GB", fragmentation: 4, lastRead: "20m ago", deadlocks: 0, slowQ: 2 },
]

const SUMMARY_CARDS = [
  { label: "Tables", value: "20", subtext: "4 need action", color: "text-slate-900" },
  { label: "DB size", value: "842 GB", subtext: "+12% this month", color: "text-slate-900" },
  { label: "Avg fragmentation", value: "24%", subtext: "6 tables > 30%", color: "text-amber-600", tag: "dm_db_index_physical_stats" },
  { label: "Cache hit ratio", value: "91%", subtext: "Target > 95%", color: "text-amber-600", tag: "dm_os_performance_counters" },
  { label: "Deadlocks (24h)", value: "7", subtext: "+3 vs yesterday", color: "text-rose-600", tag: "dm_exec_requests" },
]

export function TableManager({ activeDb }: { activeDb: string }) {
  const [search, setSearch] = React.useState("")

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
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
            size="sm" 
            className="h-8 bg-[#1E8E3E] hover:bg-[#1A7F37] gap-1.5 text-xs rounded-lg px-4"
          >
            + Add Table Group
          </Button>
        </div>
      </div>

      {/* Alert Bar */}
      <div className="bg-[#FFF4E5] border border-amber-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <div className="text-[11px] font-medium text-amber-900 flex items-center gap-4">
            <span className="flex items-center gap-1"><strong className="font-bold">3 tables</strong> fragmentation {'>'}30%</span>
            <span className="flex items-center gap-1"><strong className="font-bold">2 tables</strong> no access in 60+ days</span>
            <span className="flex items-center gap-1"><strong className="font-bold">1 table</strong> matching _date pattern</span>
          </div>
        </div>
        <X className="h-4 w-4 text-amber-400 cursor-pointer hover:text-amber-600" />
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {SUMMARY_CARDS.map((card, i) => (
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

      {/* Tables Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">All tables — {activeDb}</h2>
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
            <Select defaultValue="all">
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
            <Button variant="outline" size="sm" className="h-8 text-xs bg-white rounded-lg">
              Export
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 text-center"><Input type="checkbox" className="h-3 w-3" /></TableHead>
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
              {MOCK_TABLES.map((table, i) => (
                <TableRow key={i} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                  <TableCell className="text-center"><Input type="checkbox" className="h-3 w-3" /></TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{table.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={cn(
                        "font-bold text-[9px] px-2 py-0.5 rounded border-none shadow-none",
                        table.statusVariant === "critical" && "bg-rose-50 text-rose-500",
                        table.statusVariant === "warning" && "bg-amber-50 text-amber-500",
                        table.statusVariant === "healthy" && "bg-emerald-50 text-emerald-500"
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
