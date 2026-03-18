"use client"

import * as React from "react"
import { 
  Badge as BadgeIcon,
  Plus, 
  RefreshCw, 
  Database, 
  Server,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MoreVertical,
  Settings,
  Table as TableIcon,
  Bell
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
import { ConnectDatabaseModal } from "@/components/connect-database-modal"
import { ConfigureTablesModal } from "@/components/configure-tables-modal"
import { ConfigureAlertsModal } from "@/components/configure-alerts-modal"
import { DatabaseInstance } from "@/app/page"

export function DashboardOverview({ 
  databases, 
  onAddDatabase 
}: { 
  databases: DatabaseInstance[], 
  onAddDatabase: (db: string, server: string, count: number) => void 
}) {
  const [isConnectModalOpen, setIsConnectModalOpen] = React.useState(false)
  const [configTablesDb, setConfigTablesDb] = React.useState<string | null>(null)
  const [configAlertsDb, setConfigAlertsDb] = React.useState<string | null>(null)

  // Calculate dynamic stats
  const totalDatabases = databases.length
  const criticalCount = databases.filter(db => db.statusVariant === "critical").length
  const warningCount = databases.filter(db => db.statusVariant === "warning").length
  
  const totalTables = databases.reduce((acc, db) => {
    const tableMetric = db.metrics.find(m => m.label === "Tables")
    return acc + (tableMetric ? parseInt(tableMetric.value) : 0)
  }, 0)

  const stats = [
    {
      title: "Total databases",
      value: totalDatabases.toString(),
      subtext: `${criticalCount} critical`,
      subtextColor: criticalCount > 0 ? "text-rose-600" : "text-slate-400"
    },
    {
      title: "Total size",
      value: "1.05 TB",
      subtext: "Across all DBs",
      subtextColor: "text-slate-400"
    },
    {
      title: "Tables monitored",
      value: totalTables.toString(),
      subtext: `${warningCount + criticalCount} need action`,
      subtextColor: (warningCount + criticalCount) > 0 ? "text-amber-600" : "text-emerald-600"
    },
    {
      title: "Active deadlocks",
      value: "9",
      subtext: "Across active DBs",
      subtextColor: "text-rose-600"
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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
          <Button variant="outline" size="sm" className="h-8 text-xs border-slate-300 rounded-full px-4 bg-white font-bold">
            Run Scan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
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

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Connected SQL Server databases</h2>
          <Button 
            onClick={() => setIsConnectModalOpen(true)}
            variant="link" 
            size="sm" 
            className="h-8 bg-[#1E8E3E] hover:bg-[#1A7F37] text-white no-underline px-4 rounded-lg text-xs font-bold gap-1.5 shadow-sm"
          >
            + Connect DB
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {databases.map((db, i) => (
            <Card 
              key={i} 
              className={cn(
                "relative overflow-hidden transition-all duration-300 bg-white border shadow-sm rounded-2xl flex flex-col",
                db.isActive ? "border-[#1E8E3E] ring-1 ring-[#1E8E3E]" : "border-slate-200"
              )}
            >
              <CardHeader className="p-6 pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold text-slate-900">{db.name}</CardTitle>
                    <div className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">{db.server}</div>
                  </div>
                  <Badge 
                    className={cn(
                      "font-bold border-none px-2 py-0.5 text-[9px] rounded uppercase tracking-tighter",
                      db.statusVariant === "warning" && "bg-amber-50 text-amber-600",
                      db.statusVariant === "critical" && "bg-rose-50 text-rose-600",
                      db.statusVariant === "healthy" && "bg-emerald-50 text-emerald-600"
                    )}
                  >
                    {db.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-6 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  {db.metrics.map((metric, j) => (
                    <div key={j} className="space-y-0.5 border-l-2 border-slate-50 pl-2">
                      <div className="text-[9px] uppercase font-bold tracking-tight text-slate-400">{metric.label}</div>
                      <div className={cn("text-xs font-bold", metric.color || "text-slate-900")}>
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-slate-50">
                  <p className={cn(
                    "text-[10px] font-bold leading-tight",
                    db.statusVariant === "healthy" ? "text-emerald-600" : "text-amber-800"
                  )}>
                    {db.footer}
                  </p>
                </div>

                <div className="pt-4 mt-auto grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setConfigTablesDb(db.name)}
                    className="h-8 text-[10px] font-bold text-slate-600 border-slate-200 rounded-lg hover:bg-slate-50 gap-1.5"
                  >
                    <TableIcon className="h-3 w-3" />
                    Configure Tables
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setConfigAlertsDb(db.name)}
                    className="h-8 text-[10px] font-bold text-slate-600 border-slate-200 rounded-lg hover:bg-slate-50 gap-1.5"
                  >
                    <Bell className="h-3 w-3" />
                    Configure Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ConnectDatabaseModal 
        isOpen={isConnectModalOpen} 
        onClose={() => setIsConnectModalOpen(false)}
        onComplete={onAddDatabase}
      />

      {configTablesDb && (
        <ConfigureTablesModal 
          isOpen={true} 
          onClose={() => setConfigTablesDb(null)} 
          databaseName={configTablesDb} 
        />
      )}

      {configAlertsDb && (
        <ConfigureAlertsModal 
          isOpen={true} 
          onClose={() => setConfigAlertsDb(null)} 
          databaseName={configAlertsDb} 
        />
      )}
    </div>
  )
}
