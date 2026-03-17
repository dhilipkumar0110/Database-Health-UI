"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { RedundancyScanner } from "@/components/redundancy-scanner"
import { MaintenancePlanner } from "@/components/maintenance-planner"
import { TableManager } from "@/components/table-manager"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export type DatabaseInstance = {
  name: string
  server: string
  status: string
  statusVariant: "warning" | "critical" | "healthy"
  metrics: { label: string; value: string; color?: string }[]
  footer: string
  isActive: boolean
}

export default function SQLSentinelApp() {
  const [currentView, setCurrentView] = React.useState("overview")
  const [databases, setDatabases] = React.useState<DatabaseInstance[]>([
    {
      name: "WebPortalDB",
      server: "SQLSRV-PROD-01 · port 1433",
      status: "Warning",
      statusVariant: "warning",
      metrics: [
        { label: "Size", value: "842 GB" },
        { label: "Tables", value: "20" },
        { label: "Avg frag", value: "24.3%", color: "text-amber-600" },
        { label: "Cache hit", value: "91.4%", color: "text-emerald-600" },
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
    }
  ])
  const [activeDbName, setActiveDbName] = React.useState("WebPortalDB")

  const handleAddDatabase = (dbName: string, serverName: string, tableCount: number) => {
    const newDb: DatabaseInstance = {
      name: dbName || "New_Connection",
      server: `${serverName || "Localhost"} · port 1433`,
      status: "Healthy",
      statusVariant: "healthy",
      metrics: [
        { label: "Size", value: "0 GB" },
        { label: "Tables", value: tableCount.toString() },
        { label: "Avg frag", value: "0%", color: "text-emerald-600" },
        { label: "Cache hit", value: "100%", color: "text-emerald-600" },
        { label: "Deadlocks", value: "0", color: "text-slate-900" },
        { label: "Slow queries", value: "0", color: "text-slate-900" },
      ],
      footer: "Initial scan in progress · No issues found",
      isActive: false
    }
    setDatabases(prev => [newDb, ...prev])
    setActiveDbName(newDb.name)
  }

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <DashboardOverview databases={databases} onAddDatabase={handleAddDatabase} />
      case "table-manager":
        return <TableManager activeDb={activeDbName} />
      case "performance":
        return <PerformanceMonitor activeDb={activeDbName} />
      case "redundancy":
        return <RedundancyScanner activeDb={activeDbName} />
      case "maintenance":
        return <MaintenancePlanner />
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center p-12">
            <h2 className="text-2xl font-bold text-slate-300">Feature Under Development</h2>
            <p className="text-slate-400 mt-2">The {currentView} interface is currently being integrated for {activeDbName}.</p>
            <Button variant="link" onClick={() => setCurrentView("overview")} className="mt-4 text-primary">Return to Dashboard</Button>
          </div>
        )
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        activeDb={activeDbName}
        onDbChange={setActiveDbName}
        databases={databases.map(db => db.name)}
      />
      <SidebarInset className="bg-background flex flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between px-6 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-slate-400 hover:text-slate-600 h-8 w-8" />
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Instance:</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">PROD-SQL-01</span>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 justify-end max-w-4xl">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="search"
                placeholder="Search logs, queries, tables..."
                className="pl-10 bg-[#F8F9FA] border-slate-200 h-10 text-xs rounded-full focus-visible:ring-1 shadow-none w-full"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="relative h-10 w-10 rounded-full border-2 border-[#E6F4EA] bg-white hover:bg-[#F1F9F3] transition-all group"
              >
                <Bell className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </Button>
              <Avatar className="h-10 w-10 rounded-full border-2 border-slate-100 shadow-sm">
                <AvatarImage src="https://picsum.photos/seed/user-main/40/40" />
                <AvatarFallback className="text-[10px] font-bold bg-emerald-50 text-emerald-700">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-8 overflow-auto bg-background">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
        
        <footer className="py-6 px-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-background">
          &copy; 2024 SQL Sentinel Health Management • Professional Data Intelligence Platform
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
