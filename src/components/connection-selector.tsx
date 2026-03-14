"use client"

import * as React from "react"
import { Server, Database, ChevronDown, Check, Plus, Power } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const instances = [
  { name: "PROD-SQL-01", status: "Online", db: ["Sales_DB", "Production_Main", "AuditLogs"] },
  { name: "DEV-SQL-02", status: "Online", db: ["Staging_DB", "Test_Lab"] },
  { name: "BACKUP-SQL", status: "Offline", db: [] }
]

export function ConnectionSelector() {
  const [activeInstance, setActiveInstance] = React.useState(instances[0])
  const [activeDb, setActiveDb] = React.useState(instances[0].db[1])

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2 border-primary/20 hover:bg-primary/5">
            <Server className="h-4 w-4 text-primary" />
            <span className="font-semibold text-primary">{activeInstance.name}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>SQL Instances</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {instances.map((instance) => (
            <DropdownMenuItem 
              key={instance.name} 
              onClick={() => {
                setActiveInstance(instance)
                if (instance.db.length > 0) setActiveDb(instance.db[0])
              }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${instance.status === "Online" ? "bg-emerald-500" : "bg-slate-300"}`} />
                {instance.name}
              </div>
              {activeInstance.name === instance.name && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-accent font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            Connect New Instance
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={activeInstance.status === "Offline"}>
          <Button variant="outline" size="sm" className="h-9 gap-2 border-accent/20 hover:bg-accent/5">
            <Database className="h-4 w-4 text-accent" />
            <span className="font-semibold text-accent">{activeDb || "Select Database"}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Active Databases</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {activeInstance.db.map((db) => (
            <DropdownMenuItem key={db} onClick={() => setActiveDb(db)} className="flex items-center justify-between">
              {db}
              {activeDb === db && <Check className="h-4 w-4 text-accent" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Badge variant="outline" className="h-9 px-3 gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-medium">
        <Power className="h-3 w-3 fill-emerald-500 text-emerald-500" />
        Connection Live
      </Badge>
    </div>
  )
}