"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { RedundancyScanner } from "@/components/redundancy-scanner"
import { MaintenancePlanner } from "@/components/maintenance-planner"
import { ConnectionSelector } from "@/components/connection-selector"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Bell, Search, Filter, Download } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SQLSentinelApp() {
  const [currentView, setCurrentView] = React.useState("overview")

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <DashboardOverview />
      case "redundancy":
        return <RedundancyScanner />
      case "maintenance":
        return <MaintenancePlanner />
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center p-12">
            <h2 className="text-2xl font-bold text-slate-300">Feature Under Development</h2>
            <p className="text-slate-400 mt-2">The {currentView} interface is currently being integrated.</p>
            <Button variant="link" onClick={() => setCurrentView("overview")} className="mt-4 text-primary">Return to Dashboard</Button>
          </div>
        )
    }
  }

  const getPageTitle = () => {
    switch (currentView) {
      case "overview": return "Database Health Overview"
      case "performance": return "Performance Analytics"
      case "redundancy": return "Redundancy Scanner"
      case "maintenance": return "Maintenance Scheduling"
      case "reports": return "Reports & Export"
      default: return currentView.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <ConnectionSelector />
          </div>
          <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tables, logs, queries..."
                className="pl-8 bg-muted/40 border-none shadow-none focus-visible:ring-1"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-800 font-headline">{getPageTitle()}</h2>
                <p className="text-muted-foreground mt-1">
                  Managed monitoring for <span className="text-primary font-medium">Production_Main</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button size="sm" className="gap-2 bg-primary">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>

            {renderContent()}
          </div>
        </main>
        
        <footer className="py-6 px-8 border-t bg-white/30 text-center text-xs text-muted-foreground">
          &copy; 2024 SQL Sentinel Health Management • Professional Data Intelligence Platform
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}