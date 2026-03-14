"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { RedundancyScanner } from "@/components/redundancy-scanner"
import { MaintenancePlanner } from "@/components/maintenance-planner"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SQLSentinelApp() {
  const [currentView, setCurrentView] = React.useState("overview")
  const [activeDb, setActiveDb] = React.useState("PortalDB")

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <DashboardOverview />
      case "table-manager":
        return <DashboardOverview /> // Using this as placeholder for table manager
      case "redundancy":
        return <RedundancyScanner />
      case "maintenance":
        return <MaintenancePlanner />
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center p-12">
            <h2 className="text-2xl font-bold text-slate-300">Feature Under Development</h2>
            <p className="text-slate-400 mt-2">The {currentView} interface is currently being integrated for {activeDb}.</p>
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
        activeDb={activeDb}
        onDbChange={setActiveDb}
      />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between px-6 bg-transparent">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-slate-400 hover:text-slate-900" />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Instance:</span>
              <span className="text-xs font-bold text-slate-400">PROD-SQL-01</span>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search logs, queries..."
                className="pl-8 bg-white/50 border-none shadow-none h-9 text-xs focus-visible:ring-1"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-primary h-9 w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-background" />
            </Button>
          </div>
        </header>

        <main className="flex-1 px-8 py-4 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
        
        <footer className="py-4 px-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          &copy; 2024 SQL Sentinel Health Management • Professional Data Intelligence Platform
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}