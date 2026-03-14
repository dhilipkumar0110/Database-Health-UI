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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">All Databases</h1>
          <Badge className="bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#E6F4EA] border-none font-medium">
            SQL Server
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            Last scan: today 08:42 AM
          </div>
          <Button variant="outline" size="sm" className="h-9 border-slate-200">
            Run Scan
          </Button>
          <Button size="sm" className="h-9 bg-[#1E8E3E] hover:bg-[#1A7F37] gap-2">
            <Plus className="h-4 w-4" />
            Connect DB
          </Button>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, i) => (
          <Card key={i} className="bg-[#F8F9F3] border-none shadow-none">
            <CardContent className="pt-6">
              <div className="text-xs font-medium text-slate-400 mb-1">{stat.title}</div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className={cn("text-xs mt-1 font-medium", stat.subtextColor)}>
                {stat.subtext}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connected DBs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Connected SQL Server databases</h2>
          <Button variant="ghost" size="sm" className="text-[#1E8E3E] hover:text-[#1E8E3E] hover:bg-[#E6F4EA] gap-2">
            <Plus className="h-4 w-4" />
            Connect DB
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {databaseInstances.map((db, i) => (
            <Card 
              key={i} 
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                db.isActive ? "border-2 border-[#1E8E3E] shadow-lg" : "border border-slate-200"
              )}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">{db.name}</CardTitle>
                    <div className="text-xs text-slate-400 font-medium mt-1">{db.server}</div>
                  </div>
                  <Badge 
                    className={cn(
                      "font-semibold border-none px-3 py-1",
                      db.statusVariant === "warning" && "bg-amber-50 text-amber-600",
                      db.statusVariant === "critical" && "bg-rose-50 text-rose-600",
                      db.statusVariant === "healthy" && "bg-emerald-50 text-emerald-600"
                    )}
                  >
                    {db.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-y-4">
                  {db.metrics.map((metric, j) => (
                    <div key={j} className="space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{metric.label}</div>
                      <div className={cn("text-lg font-bold", metric.color || "text-slate-900")}>
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <p className={cn(
                    "text-xs font-medium",
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
