"use client"

import * as React from "react"
import { 
  Plus, 
  RefreshCw, 
  Database, 
  Server,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MoreVertical
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const summaryStats = [
  {
    title: "Total databases",
    value: "3",
    subtext: "1 critical",
    subtextColor: "text-rose-600"
  },
  {
    title: "Total size",
    value: "2.4 TB",
    subtext: "Across all DBs",
    subtextColor: "text-slate-400"
  },
  {
    title: "Tables monitored",
    value: "112",
    subtext: "9 need action",
    subtextColor: "text-amber-600"
  },
  {
    title: "Active deadlocks",
    value: "7",
    subtext: "Across 2 DBs",
    subtextColor: "text-rose-600"
  }
]

const databaseInstances = [
  {
    name: "PortalDB",
    server: "SQLSRV-PROD-01 · port 1433",
    status: "Warning",
    statusVariant: "warning",
    metrics: [
      { label: "Size", value: "842 GB" },
      { label: "Tables", value: "20" },
      { label: "Avg frag", value: "24%", color: "text-amber-600" },
      { label: "Cache hit", value: "91%", color: "text-emerald-600" },
      { label: "Deadlocks", value: "7", color: "text-rose-600" },
      { label: "Slow queries", value: "243", color: "text-rose-600" },
    ],
    footer: "3 tables above 30% fragmentation · 1 redundant table detected",
    isActive: true
  },
  {
    name: "ReportingDB",
    server: "SQLSRV-PROD-01 · port 1433",
    status: "Critical",
    statusVariant: "critical",
    metrics: [
      { label: "Size", value: "210 GB" },
      { label: "Tables", value: "34" },
      { label: "Avg frag", value: "41%", color: "text-rose-600" },
      { label: "Cache hit", value: "78%", color: "text-rose-600" },
      { label: "Deadlocks", value: "2", color: "text-slate-900" },
      { label: "Slow queries", value: "189", color: "text-rose-600" },
    ],
    footer: "5 tables critical · cache hit below 80% threshold",
    isActive: false
  },
  {
    name: "ArchiveDB",
    server: "SQLSRV-ARCH-01 · port 1433",
    status: "Healthy",
    statusVariant: "healthy",
    metrics: [
      { label: "Size", value: "1.4 TB" },
      { label: "Tables", value: "58" },
      { label: "Avg frag", value: "8%", color: "text-emerald-600" },
      { label: "Cache hit", value: "97%", color: "text-emerald-600" },
      { label: "Deadlocks", value: "0", color: "text-slate-900" },
      { label: "Slow queries", value: "12", color: "text-slate-900" },
    ],
    footer: "All metrics within healthy thresholds",
    isActive: false
  }
]

export function DashboardOverview() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">All Databases</h1>
          <Badge className="bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#E6F4EA] border-none font-medium px-2 py-0.5 text-[10px]">
            SQL Server
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-400">
            Last scan: today 08:42 AM
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs border-slate-300 rounded-full px-4">
            Run Scan
          </Button>
          <Button size="sm" className="h-8 bg-[#1E8E3E] hover:bg-[#1A7F37] gap-1.5 text-xs rounded-lg px-4">
            + Connect DB
          </Button>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, i) => (
          <Card key={i} className="bg-[#F1F3ED] border-none shadow-none rounded-xl">
            <CardContent className="p-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">{stat.title}</div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className={cn("text-[10px] mt-0.5 font-bold", stat.subtextColor)}>
                {stat.subtext}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connected DBs Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Connected SQL Server databases</h2>
          <Button variant="link" size="sm" className="h-8 bg-[#1E8E3E] hover:bg-[#1A7F37] text-white no-underline px-4 rounded-lg text-xs font-bold gap-1.5 shadow-sm">
            + Connect DB
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {databaseInstances.map((db, i) => (
            <Card 
              key={i} 
              className={cn(
                "relative overflow-hidden transition-all duration-300 bg-white border shadow-sm rounded-xl",
                db.isActive ? "border-[#1E8E3E] ring-1 ring-[#1E8E3E]" : "border-slate-200"
              )}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">{db.name}</CardTitle>
                    <div className="text-[10px] text-slate-400 font-bold mt-0.5">{db.server}</div>
                  </div>
                  <Badge 
                    className={cn(
                      "font-bold border-none px-2 py-0.5 text-[10px] rounded-md",
                      db.statusVariant === "warning" && "bg-amber-50 text-amber-600",
                      db.statusVariant === "critical" && "bg-rose-50 text-rose-600",
                      db.statusVariant === "healthy" && "bg-emerald-50 text-emerald-600"
                    )}
                  >
                    {db.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-4">
                <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                  {db.metrics.map((metric, j) => (
                    <div key={j} className="space-y-0.5">
                      <div className="text-[9px] uppercase font-bold tracking-tight text-slate-400">{metric.label}</div>
                      <div className={cn("text-xs font-bold", metric.color || "text-slate-900")}>
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-3 border-t border-slate-100">
                  <p className={cn(
                    "text-[10px] font-bold leading-tight",
                    db.statusVariant === "healthy" ? "text-emerald-600" : "text-amber-800"
                  )}>
                    {db.footer}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}