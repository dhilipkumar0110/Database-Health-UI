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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
        <header className="flex h-14 shrink-0 items-center justify-between px-6 bg-transparent">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-slate-400 hover:text-slate-600 h-8 w-8" />
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Instance:</span>
              <span className="text-xs font-medium text-slate-400">PROD-SQL-01</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="search"
                placeholder="Search logs, queries..."
                className="pl-9 bg-white border-slate-200 h-9 text-xs rounded-lg focus-visible:ring-1 shadow-sm"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="relative h-9 w-9 rounded-lg border-emerald-600/50 hover:bg-emerald-50 hover:border-emerald-600 transition-colors"
            >
              <Bell className="h-4 w-4 text-slate-400" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" />
            </Button>
            <Avatar className="h-8 w-8 rounded-lg border border-slate-200 shadow-sm">
              <AvatarImage src="https://picsum.photos/seed/user-main/32/32" />
              <AvatarFallback className="text-[10px] font-bold">AD</AvatarFallback>
            </Avatar>
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
