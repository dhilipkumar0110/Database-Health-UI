
"use client"

import * as React from "react"
import { 
  Archive, 
  Search, 
  MoreVertical, 
  FileCode, 
  Server, 
  Database, 
  ArrowLeft, 
  ChevronRight, 
  ShieldAlert, 
  Activity, 
  Zap, 
  Table as TableIcon, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Code, 
  Clock, 
  Calendar,
  Search as SearchIcon,
  RefreshCw,
  LayoutGrid
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MaintenanceTask, ScheduleConfig } from "@/app/page"
import { cn } from "@/lib/utils"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

type ViewState = 'list' | 'task-details' | 'query-builder'

type QueryRow = {
  id: string
  column: string
  operator: string
  value: string
  logic: string
}

export function ArchiveManager({ 
  tasks, 
  onUpdateTask,
  onViewChange,
  initialTab = "Archiving"
}: { 
  tasks: MaintenanceTask[], 
  onUpdateTask: (id: string, updates: Partial<MaintenanceTask>) => void,
  onViewChange: (view: string) => void,
  initialTab?: string
}) {
  const [view, setView] = React.useState<ViewState>('list')
  const [selectedTask, setSelectedTask] = React.useState<MaintenanceTask | null>(null)
  const [selectedTable, setSelectedTable] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState("")
  const [activeTab, setActiveTab] = React.useState(initialTab)

  // Sync active tab when initialTab prop changes (e.g., when creating a new task of a different type)
  React.useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  // Schedule Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false)
  const [taskToSchedule, setTaskToSchedule] = React.useState<MaintenanceTask | null>(null)
  const [scheduleForm, setScheduleForm] = React.useState<ScheduleConfig>({
    frequency: 'Daily',
    dayOfWeek: 'Monday',
    dayOfMonth: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })

  // Query Builder State
  const [queryRows, setQueryRows] = React.useState<QueryRow[]>([
    { id: '1', column: 'created_at', operator: '<=', value: "DATEADD(year, -5, GETDATE())", logic: 'AND' }
  ])

  const handleTaskClick = (task: MaintenanceTask) => {
    setSelectedTask(task)
    setView('task-details')
  }

  const handleConfigureQuery = (tableName: string) => {
    setSelectedTable(tableName)
    setView('query-builder')
  }

  const handleBack = () => {
    if (view === 'query-builder') setView('task-details')
    else if (view === 'task-details') setView('list')
  }

  const addQueryRow = () => {
    setQueryRows([...queryRows, { id: Date.now().toString(), column: 'created_at', operator: '=', value: '', logic: 'AND' }])
  }

  const removeQueryRow = (id: string) => {
    setQueryRows(queryRows.filter(row => row.id !== id))
  }

  const updateRow = (id: string, field: keyof QueryRow, value: string) => {
    setQueryRows(queryRows.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  const openScheduleDialog = (e: React.MouseEvent, task: MaintenanceTask) => {
    e.stopPropagation()
    setTaskToSchedule(task)
    setIsScheduleModalOpen(true)
  }

  const handleFinalizeSchedule = () => {
    if (taskToSchedule) {
      onUpdateTask(taskToSchedule.id, {
        status: 'scheduled',
        schedule: scheduleForm
      })
      setIsScheduleModalOpen(false)
      toast({
        title: "Task Scheduled",
        description: `"${taskToSchedule.name}" is now active in the Scheduler.`
      })
      onViewChange("maintenance")
    }
  }

  if (view === 'query-builder') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Configure Criteria</h1>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <TableIcon className="h-3 w-3" />
                <span>{selectedTable}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary font-bold">Archiving Settings</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Card className="bg-slate-50 border-none shadow-none px-4 py-2 flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Records</span>
              <span className="text-lg font-bold text-slate-900">1,244,102</span>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <Card className="lg:col-span-8 bg-white border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-lg font-bold">Selection Criteria</CardTitle>
              <p className="text-sm text-slate-400">Define the WHERE clause for the archival extraction process.</p>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="grid grid-cols-12 gap-4 mb-2">
                <div className="col-span-3 text-[10px] font-bold text-slate-400 uppercase">Column Name</div>
                <div className="col-span-2 text-[10px] font-bold text-slate-400 uppercase">Operator</div>
                <div className="col-span-4 text-[10px] font-bold text-slate-400 uppercase">Criteria Value</div>
                <div className="col-span-2 text-[10px] font-bold text-slate-400 uppercase">Logic</div>
                <div className="col-span-1 text-[10px] font-bold text-slate-400 uppercase text-right">Action</div>
              </div>

              {queryRows.map((row) => (
                <div key={row.id} className="grid grid-cols-12 gap-4 items-center animate-in fade-in slide-in-from-top-2">
                  <div className="col-span-3">
                    <Select value={row.column} onValueChange={(v) => updateRow(row.id, 'column', v)}>
                      <SelectTrigger className="h-11 border-slate-200 rounded-xl bg-slate-50/50">
                        <SelectValue placeholder="Column" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created_at">created_at</SelectItem>
                        <SelectItem value="status">status</SelectItem>
                        <SelectItem value="id">id</SelectItem>
                        <SelectItem value="transaction_type">transaction_type</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Select value={row.operator} onValueChange={(v) => updateRow(row.id, 'operator', v)}>
                      <SelectTrigger className="h-11 border-slate-200 rounded-xl bg-slate-50/50">
                        <SelectValue placeholder="Op" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="=">=</SelectItem>
                        <SelectItem value="!=">!=</SelectItem>
                        <SelectItem value="<">{'<'}</SelectItem>
                        <SelectItem value="<=">{'<='}</SelectItem>
                        <SelectItem value=">">{'>'}</SelectItem>
                        <SelectItem value=">=">{'>='}</SelectItem>
                        <SelectItem value="LIKE">LIKE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Input 
                      placeholder="Value" 
                      value={row.value || ""}
                      onChange={(e) => updateRow(row.id, 'value', e.target.value)}
                      className="h-11 border-slate-200 rounded-xl bg-slate-50/50"
                    />
                  </div>
                  <div className="col-span-2">
                    <Select value={row.logic} onValueChange={(v) => updateRow(row.id, 'logic', v)}>
                      <SelectTrigger className="h-11 border-slate-200 rounded-xl bg-slate-50/50">
                        <SelectValue placeholder="Logic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeQueryRow(row.id)}
                      className="h-10 w-10 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button 
                variant="outline" 
                onClick={addQueryRow}
                className="mt-4 border-dashed border-2 border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:bg-slate-50 w-full h-12 rounded-xl font-bold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </CardContent>
            <CardFooter className="p-8 bg-slate-50 flex items-center justify-end border-t border-slate-100">
              <div className="flex items-center gap-3">
                <Button variant="outline" className="h-11 px-8 rounded-xl font-bold bg-white" onClick={() => setView('task-details')}>
                  Cancel
                </Button>
                <Button className="h-11 px-10 rounded-xl font-bold bg-primary text-white shadow-lg hover:shadow-primary/20 transition-all">
                  Save
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden p-8">
              <div className="flex items-center gap-2 mb-6">
                <Code className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-slate-900">Preview</h3>
              </div>
              <div className="relative rounded-2xl bg-[#0F172A] p-6 font-mono text-sm leading-relaxed overflow-hidden min-h-[160px]">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                <pre className="text-slate-300 whitespace-pre-wrap break-all">
                  <span className="text-blue-400 uppercase">SELECT</span> * <span className="text-blue-400 uppercase">FROM</span> <span className="text-emerald-400">{selectedTable}</span>{"\n"}
                  {queryRows.length > 0 && (
                    <>
                      <span className="text-blue-400 uppercase">WHERE</span>{" "}
                      {queryRows.map((row, idx) => (
                        <React.Fragment key={row.id}>
                          {idx > 0 && (
                            <>{"\n"}<span className="text-blue-400 uppercase">{row.logic}</span> </>
                          )}
                          <span className="text-emerald-400">{row.column}</span> {row.operator} <span className="text-amber-400">'{row.value || '?'}'</span>
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </pre>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'task-details' && selectedTask) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{selectedTask.name}</h1>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Database className="h-3 w-3" />
                <span>{selectedTask.database}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary font-bold">Configure Task Components</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="h-12 px-8 text-[10px] font-bold uppercase text-slate-400">Table Name</TableHead>
                <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">Missing Indexes</TableHead>
                <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">Deadlocks</TableHead>
                <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">Slow Queries</TableHead>
                <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">Table Size</TableHead>
                <TableHead className="h-12 px-8 text-right text-[10px] font-bold uppercase text-slate-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTask.tables.map((tableName) => (
                <TableRow key={tableName} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                  <TableCell className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                        <TableIcon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-primary hover:underline cursor-pointer">{tableName}</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Click for analytics</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tableName.includes('UPLOAD') || tableName.includes('AUDIT') ? (
                      <Badge className="bg-rose-50 text-rose-500 border-none font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                        <ShieldAlert className="h-3 w-3" />
                        4 Issues
                      </Badge>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                      <Activity className="h-3 w-3" />
                      {Math.floor(Math.random() * 12) + 2}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
                      <Zap className="h-3 w-3" />
                      {Math.floor(Math.random() * 20) + 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-slate-600">
                      {tableName.includes('BYTES') || tableName.includes('UPLOAD') ? '45.0 GB' : '8.1 GB'}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 text-right">
                    <Button 
                      variant="link"
                      onClick={() => handleConfigureQuery(tableName)}
                      className="h-10 px-6 text-primary hover:no-underline text-[11px] font-bold rounded-xl gap-2"
                    >
                      <FileCode className="h-4 w-4" />
                      Configure
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    )
  }

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.database.toLowerCase().includes(search.toLowerCase())
    const matchesTab = t.type === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Task Manager</h1>
          <Badge className="bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#E6F4EA] border-none font-medium px-2 py-0.5 text-[10px]">
            {tasks.length} Active Tasks
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input 
              placeholder="Search tasks..." 
              className="h-9 text-xs pl-8 w-64 bg-white border-slate-200 rounded-lg shadow-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="Archiving" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-100/80 p-1 h-12 rounded-xl mb-6">
          <TabsTrigger value="Archiving" className="rounded-lg px-6 font-bold text-xs gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Archive className="h-3.5 w-3.5 text-amber-500" />
            Archiving
          </TabsTrigger>
          <TabsTrigger value="Index Rebuild" className="rounded-lg px-6 font-bold text-xs gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Zap className="h-3.5 w-3.5 text-blue-500" />
            Index Rebuild
          </TabsTrigger>
          <TabsTrigger value="Update Stats" className="rounded-lg px-6 font-bold text-xs gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <RefreshCw className="h-3.5 w-3.5 text-emerald-500" />
            Update Stats
          </TabsTrigger>
          <TabsTrigger value="Scanning" className="rounded-lg px-6 font-bold text-xs gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <SearchIcon className="h-3.5 w-3.5 text-purple-500" />
            Scanning
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredTasks.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-white border border-dashed rounded-3xl">
              <Archive className="h-12 w-12 text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">No tasks found</h3>
              <p className="text-sm text-slate-400 max-w-sm">
                There are currently no {activeTab} tasks defined.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="bg-white border-none shadow-sm rounded-2xl overflow-hidden group hover:ring-2 hover:ring-primary/10 transition-all cursor-pointer" onClick={() => handleTaskClick(task)}>
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-base font-bold text-slate-900">{task.name}</CardTitle>
                        <div className="flex items-center flex-wrap gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Type:</span>
                            <Badge 
                              className={cn(
                                "font-bold text-[8px] px-1.5 py-0 rounded border-none uppercase tracking-tighter",
                                task.type === "Archiving" && "bg-amber-50 text-amber-600",
                                task.type === "Index Rebuild" && "bg-blue-50 text-blue-600",
                                task.type === "Update Stats" && "bg-emerald-50 text-emerald-600",
                                task.type === "Scanning" && "bg-purple-50 text-purple-600"
                              )}
                            >
                              {task.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 ml-1 border-l pl-2 border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Status:</span>
                            {task.status === 'scheduled' ? (
                              <Badge className="bg-emerald-500 text-white border-none font-bold text-[8px] uppercase px-1.5 py-0 rounded">Scheduled</Badge>
                            ) : (
                              <Badge className="bg-slate-100 text-slate-400 border-none font-bold text-[8px] uppercase px-1.5 py-0 rounded">Pending</Badge>
                            )}
                          </div>
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
                    <div className="text-[9px] text-slate-300 font-medium italic">
                      Modified on {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
                    <Button 
                      variant="link" 
                      className="h-8 text-[10px] font-bold text-primary p-0 hover:no-underline gap-1.5 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(task);
                      }}
                    >
                      {task.type === "Scanning" ? <SearchIcon className="h-3.5 w-3.5" /> : <FileCode className="h-3.5 w-3.5" />}
                      {task.type === "Scanning" ? "View Audit" : "Configure"}
                    </Button>
                    <Button 
                      className="h-8 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg px-4 hover:bg-slate-100 shadow-none gap-1.5"
                      onClick={(e) => openScheduleDialog(e, task)}
                    >
                      <Clock className="h-3 w-3" />
                      Schedule
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule Maintenance
            </DialogTitle>
            <DialogDescription>
              Configure the execution frequency for "{taskToSchedule?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Frequency</Label>
              <Select 
                value={scheduleForm.frequency} 
                onValueChange={(v: any) => setScheduleForm(prev => ({ ...prev, frequency: v }))}
              >
                <SelectTrigger className="h-11 border-slate-200">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {scheduleForm.frequency === 'Weekly' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label className="text-sm font-semibold">Run on day</Label>
                <Select 
                  value={scheduleForm.dayOfWeek || "Monday"} 
                  onValueChange={(v) => setScheduleForm(prev => ({ ...prev, dayOfWeek: v }))}
                >
                  <SelectTrigger className="h-11 border-slate-200">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {scheduleForm.frequency === 'Monthly' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label className="text-sm font-semibold">Run on date (1-31)</Label>
                <Input 
                  type="number" 
                  min={1} 
                  max={31} 
                  value={scheduleForm.dayOfMonth || 1}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) || 1 }))}
                  className="h-11 border-slate-200"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-500">Start Date</Label>
                <Input 
                  type="date" 
                  value={scheduleForm.startDate || ""}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="h-11 border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-500">End Date</Label>
                <Input 
                  type="date" 
                  value={scheduleForm.endDate || ""}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="h-11 border-slate-200"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>Cancel</Button>
            <Button onClick={handleFinalizeSchedule} className="bg-primary hover:bg-primary/90 text-white font-bold">
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
