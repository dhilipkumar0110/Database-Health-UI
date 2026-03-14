"use client"

import * as React from "react"
import {
  Database,
  LayoutDashboard,
  Activity,
  ShieldCheck,
  CalendarDays,
  Settings,
  Bell,
  FileText,
  Search,
  Server,
  ChevronRight,
  ChevronDown
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface NavItem {
  title: string
  icon?: any
  id: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    id: "overview"
  },
  {
    title: "Performance",
    icon: Activity,
    id: "performance"
  },
  {
    title: "Health Checks",
    icon: ShieldCheck,
    id: "health",
    children: [
      { title: "Redundancy Scanner", id: "redundancy" },
      { title: "Query Optimization", id: "query-opt" },
      { title: "Table Statistics", id: "table-stats" }
    ]
  },
  {
    title: "Maintenance",
    icon: CalendarDays,
    id: "maintenance"
  },
  {
    title: "Reports & Alerts",
    icon: FileText,
    id: "reports",
    children: [
      { title: "Generate Reports", id: "gen-reports" },
      { title: "Alert Rules", id: "alert-rules" }
    ]
  }
]

export function AppSidebar({ 
  currentView, 
  onViewChange 
}: { 
  currentView: string, 
  onViewChange: (id: string) => void 
}) {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg">
            <Database className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary font-headline">SQL Sentinel</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Management
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              if (item.children) {
                return (
                  <Collapsible key={item.id} asChild defaultOpen={currentView.startsWith(item.id)} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title} className="hover:bg-sidebar-accent transition-colors">
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span className="font-medium">{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton 
                                isActive={currentView === subItem.id}
                                onClick={() => onViewChange(subItem.id)}
                                className="cursor-pointer"
                              >
                                {subItem.title}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              }
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    isActive={currentView === item.id}
                    onClick={() => onViewChange(item.id)}
                    className="hover:bg-sidebar-accent transition-colors"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="space-y-4">
           <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Notifications" className="hover:bg-sidebar-accent">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-accent-foreground">
                  3
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings" className="hover:bg-sidebar-accent">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-slate-200" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Admin User</span>
              <span className="text-[10px] text-muted-foreground">Master DB Account</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}