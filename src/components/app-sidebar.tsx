"use client"

import * as React from "react"
import {
  LayoutGrid,
  Table,
  Activity,
  ShieldAlert,
  Archive,
  Clock,
  FileText,
  ListFilter
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function AppSidebar({ 
  currentView, 
  onViewChange,
  activeDb,
  onDbChange,
  databases
}: { 
  currentView: string, 
  onViewChange: (id: string) => void,
  activeDb: string,
  onDbChange: (db: string) => void,
  databases: string[]
}) {
  return (
    <Sidebar variant="sidebar" className="border-r bg-white">
      <SidebarHeader className="px-6 py-6 space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-headline">MPM Health</h1>
        <p className="text-sm text-slate-400 font-medium">SQL Server Management</p>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Active Database
          </SidebarGroupLabel>
          <div className="px-4 pb-4">
            <Select value={activeDb} onValueChange={onDbChange}>
              <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-10 focus:ring-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <SelectValue placeholder="Select Database" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {databases.map((db) => (
                  <SelectItem key={db} value={db}>
                    {db}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SidebarGroup>

        <div className="border-t border-slate-100 mx-4 my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Overview
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={currentView === "overview"}
                onClick={() => onViewChange("overview")}
                className={`px-4 py-6 hover:bg-slate-50 transition-colors ${currentView === "overview" ? "bg-[#E6F4EA] text-[#1E8E3E] font-bold" : "text-slate-600"}`}
              >
                <LayoutGrid className="h-5 w-5" />
                <span className="text-sm font-semibold">All Databases</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {activeDb.toUpperCase()}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={currentView === "table-manager"}
                onClick={() => onViewChange("table-manager")}
                className="px-4 py-3 text-slate-500 hover:text-slate-900"
              >
                <Table className="h-4 w-4" />
                <span className="text-sm font-medium flex-1">Table Manager</span>
                <Badge variant="secondary" className="bg-rose-50 text-rose-400 border-none font-bold text-[10px] px-1.5 py-0">4</Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={currentView === "performance"}
                onClick={() => onViewChange("performance")}
                className="px-4 py-3 text-slate-500 hover:text-slate-900"
              >
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">Performance</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={currentView === "redundancy"}
                onClick={() => onViewChange("redundancy")}
                className="px-4 py-3 text-slate-500 hover:text-slate-900"
              >
                <ShieldAlert className="h-4 w-4" />
                <span className="text-sm font-medium">Redundancy Scan</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Maintain
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={currentView === "archive"}
                onClick={() => onViewChange("archive")}
                className="px-4 py-3 text-slate-500 hover:text-slate-900"
              >
                <Archive className="h-4 w-4" />
                <span className="text-sm font-medium">Task Manager</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={currentView === "maintenance"}
                onClick={() => onViewChange("maintenance")}
                className="px-4 py-3 text-slate-500 hover:text-slate-900"
              >
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Scheduler</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Reports
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={currentView === "export"}
                onClick={() => onViewChange("export")}
                className="px-4 py-3 text-slate-500 hover:text-slate-900"
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Export Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={currentView === "alerts"}
                onClick={() => onViewChange("alerts")}
                className="px-4 py-3 text-slate-500 hover:text-slate-900"
              >
                <ListFilter className="h-4 w-4" />
                <span className="text-sm font-medium">Alerts & Rules</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
