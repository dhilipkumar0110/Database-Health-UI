"use client"

import * as React from "react"
import { 
  Archive, 
  Search, 
  MoreVertical,
  FileCode,
  Server, 
  Database
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MaintenanceTask } from "@/app/page"
import { cn } from "@/lib/utils"

export function ArchiveManager({ tasks }: { tasks: MaintenanceTask[] }) {
  const [search, setSearch] = React.useState("")

  const filteredTasks = tasks.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.database.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Archive & Task Manager</h1>
          <Badge className="bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#E6F4EA] border-none font-medium px-2 py-0.5 text-[10px]">
            {tasks.length} Active Tasks
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input 
              placeholder="Search tasks or DBs..." 
              className="h-9 text-xs pl-8 w-64 bg-white border-slate-200 rounded-lg shadow-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white border border-dashed rounded-3xl">
          <Archive className="h-12 w-12 text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No maintenance tasks found</h3>
          <p className="text-sm text-slate-400 max-w-sm">
            Start by selecting tables in the Table Manager and flagging them for archive or index rebuilding.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="bg-white border-none shadow-sm rounded-2xl overflow-hidden group hover:ring-2 hover:ring-primary/10 transition-all">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold text-slate-900">{task.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={cn(
                          "font-bold text-[8px] px-1.5 py-0 rounded border-none uppercase tracking-tighter",
                          task.type === "Archiving" && "bg-amber-50 text-amber-600",
                          task.type === "Index Rebuild" && "bg-blue-50 text-blue-600",
                          task.type === "Update Stats" && "bg-emerald-50 text-emerald-600"
                        )}
                      >
                        {task.type}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-medium">Created {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                      <Server className="h-2.5 w-2.5" /> Server
                    </span>
                    <div className="text-xs font-bold text-slate-700">{task.server}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                      <Database className="h-2.5 w-2.5" /> Database
                    </span>
                    <div className="text-xs font-bold text-slate-700">{task.database}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Scope: {task.tables.length} Tables</span>
                  <div className="flex flex-wrap gap-1">
                    {task.tables.slice(0, 3).map(t => (
                      <Badge key={t} variant="secondary" className="bg-slate-50 text-slate-500 border-none text-[9px] font-medium px-2">
                        {t}
                      </Badge>
                    ))}
                    {task.tables.length > 3 && (
                      <Badge variant="secondary" className="bg-slate-50 text-slate-400 border-none text-[9px] font-medium px-2">
                        +{task.tables.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-5 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
                <Button variant="link" className="h-8 text-[10px] font-bold text-primary p-0 hover:no-underline gap-1.5 transition-all">
                  <FileCode className="h-3.5 w-3.5" />
                  Configure Query
                </Button>
                <Button className="h-8 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg px-4 hover:bg-slate-100 shadow-none">
                  Schedule
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
