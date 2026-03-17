
"use client"

import * as React from "react"
import { 
  CalendarDays, 
  Clock, 
  Info, 
  Check, 
  Plus, 
  Loader2, 
  Sparkles, 
  AlertTriangle,
  Calendar,
  MoreVertical,
  Trash2,
  Table as TableIcon,
  Server,
  Database,
  RefreshCw,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { scheduleMaintenance, MaintenanceSchedulerOutput } from "@/ai/flows/ai-maintenance-scheduler"
import { MaintenanceTask, ScheduleConfig } from "@/app/page"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function MaintenancePlanner({ 
  tasks, 
  onUpdateTask 
}: { 
  tasks: MaintenanceTask[], 
  onUpdateTask: (id: string, updates: Partial<MaintenanceTask>) => void 
}) {
  const [description, setDescription] = React.useState("Peak hours are 9 AM to 5 PM EST on weekdays. Weekends are generally low traffic except for Sunday nights when batch processing occurs.")
  const [aiTasks, setAiTasks] = React.useState(["Full Backup", "Index Rebuild", "Data Archiving"])
  const [newTaskInput, setNewTaskInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [aiResults, setAiResults] = React.useState<MaintenanceSchedulerOutput | null>(null)

  // Manual Schedule Creation
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [selectedTaskId, setSelectedTaskId] = React.useState<string>("")
  const [manualScheduleForm, setManualScheduleForm] = React.useState<ScheduleConfig>({
    frequency: 'Daily',
    dayOfWeek: 'Monday',
    dayOfMonth: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })

  const scheduledTasks = tasks.filter(t => t.status === 'scheduled')
  const pendingTasks = tasks.filter(t => t.status !== 'scheduled')

  const handleAddTask = () => {
    if (newTaskInput && !aiTasks.includes(newTaskInput)) {
      setAiTasks([...aiTasks, newTaskInput])
      setNewTaskInput("")
    }
  }

  const handleRemoveTask = (task: string) => {
    setAiTasks(aiTasks.filter(t => t !== task))
  }

  const handlePlan = async () => {
    if (!description || aiTasks.length === 0) return
    setIsLoading(true)
    try {
      const output = await scheduleMaintenance({
        databaseUsageDescription: description,
        maintenanceTasks: aiTasks
      })
      setAiResults(output)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinalizeManualSchedule = () => {
    if (selectedTaskId) {
      const task = tasks.find(t => t.id === selectedTaskId)
      onUpdateTask(selectedTaskId, {
        status: 'scheduled',
        schedule: manualScheduleForm
      })
      setIsCreateModalOpen(false)
      setSelectedTaskId("")
      toast({
        title: "Schedule Created",
        description: `"${task?.name}" is now active.`
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-primary" />
            Maintenance Scheduler
          </h1>
          <p className="text-slate-400 font-medium">
            Manage your automated maintenance plans and use AI to optimize windows.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-primary/10 transition-all gap-2">
          <Plus className="h-5 w-5" />
          Create New Schedule
        </Button>
      </div>

      {/* Scheduled Tasks Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-bold text-slate-800">Active Maintenance Schedules</h2>
        </div>
        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="h-12 px-8 text-[10px] font-bold uppercase text-slate-400">Task Name</TableHead>
                <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">Frequency</TableHead>
                <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">Schedule Details</TableHead>
                <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">Server/DB</TableHead>
                <TableHead className="h-12 text-[10px] font-bold uppercase text-slate-400">Timeframe</TableHead>
                <TableHead className="h-12 px-8 text-right text-[10px] font-bold uppercase text-slate-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                      <Calendar className="h-12 w-12" />
                      <span className="text-sm font-bold uppercase tracking-widest">No Active Schedules</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                scheduledTasks.map((task) => (
                  <TableRow key={task.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                    <TableCell className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center border",
                          task.type === 'Archiving' ? "bg-amber-50 text-amber-500 border-amber-100" :
                          task.type === 'Index Rebuild' ? "bg-blue-50 text-blue-500 border-blue-100" :
                          "bg-emerald-50 text-emerald-500 border-emerald-100"
                        )}>
                          {task.type === 'Archiving' ? <TableIcon className="h-5 w-5" /> : 
                           task.type === 'Index Rebuild' ? <Zap className="h-5 w-5" /> : 
                           <RefreshCw className="h-5 w-5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{task.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{task.type}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] uppercase">
                        {task.schedule?.frequency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-slate-600 italic">
                        {task.schedule?.frequency === 'Daily' ? 'Every day' :
                         task.schedule?.frequency === 'Weekly' ? `Every ${task.schedule.dayOfWeek}` :
                         `On the ${task.schedule?.dayOfMonth}${task.schedule?.dayOfMonth === 1 ? 'st' : task.schedule?.dayOfMonth === 2 ? 'nd' : 'th'} of month`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                          <Server className="h-2.5 w-2.5" /> {task.server}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <Database className="h-2.5 w-2.5" /> {task.database}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {task.schedule?.startDate} <span className="mx-1">→</span> {task.schedule?.endDate}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* AI Planner Section */}
      <section className="space-y-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold text-slate-800">AI Window Optimization</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <Card className="bg-white border-none shadow-sm rounded-3xl p-8 sticky top-24">
              <h3 className="text-base font-bold text-slate-800 mb-6">Traffic Context</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Usage Description</label>
                  <Textarea 
                    placeholder="Describe peak hours, low traffic windows, etc."
                    className="min-h-[120px] bg-slate-50/50 border-slate-200 rounded-2xl text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tasks to analyze</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. Transaction Backup" 
                      value={newTaskInput}
                      onChange={(e) => setNewTaskInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                      className="bg-slate-50/50 border-slate-200 rounded-xl h-10"
                    />
                    <Button size="icon" variant="outline" onClick={handleAddTask} className="h-10 w-10 rounded-xl border-slate-200">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiTasks.map(task => (
                      <Badge key={task} variant="secondary" className="px-3 py-1 bg-slate-50 text-slate-600 border-none font-medium flex items-center gap-2 rounded-lg">
                        {task}
                        <button onClick={() => handleRemoveTask(task)} className="hover:text-rose-500 opacity-50 hover:opacity-100 transition-opacity">×</button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={handlePlan} 
                  disabled={isLoading || !description || aiTasks.length === 0} 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/10"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Analyze Windows
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8">
            {!aiResults && !isLoading && (
              <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <Clock className="h-12 w-12 text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">Recommended Time Windows</h3>
                <p className="text-sm text-slate-400 max-w-sm mt-1">
                  AI will analyze your usage patterns and suggest the least disruptive windows for maintenance.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-white border border-slate-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            )}

            {aiResults && (
              <div className="space-y-4">
                {aiResults.scheduleRecommendations.map((rec, idx) => (
                  <Card key={idx} className="bg-white border-none shadow-sm rounded-3xl overflow-hidden group hover:ring-2 hover:ring-primary/10 transition-all">
                    <CardHeader className="p-8 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-bold text-slate-900">{rec.task}</CardTitle>
                          <div className="flex items-center gap-2 text-primary font-bold text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{rec.optimalTimeWindow}</span>
                          </div>
                        </div>
                        <Badge className="bg-primary/5 text-primary border-none font-bold text-[9px] uppercase px-3 py-1">AI Recommendation</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                      <div className="bg-slate-50 rounded-2xl p-6 italic text-sm text-slate-600 border border-slate-100">
                        <Info className="h-4 w-4 text-primary mb-2" />
                        "{rec.reason}"
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="p-6 rounded-2xl border border-amber-100 bg-amber-50/50 flex gap-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                  <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                    <strong>Note:</strong> These AI-driven insights are generated based on the operational context provided. Always cross-reference with server-level resource usage monitors before finalizing high-load tasks.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Manual Creation Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Create Maintenance Schedule
            </DialogTitle>
            <DialogDescription>
              Assign a new schedule to a pending maintenance task.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Select Target Task</Label>
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger className="h-11 border-slate-200">
                  <SelectValue placeholder="Pick a task..." />
                </SelectTrigger>
                <SelectContent>
                  {pendingTasks.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name} ({t.database})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Frequency</Label>
              <Select 
                value={manualScheduleForm.frequency} 
                onValueChange={(v: any) => setManualScheduleForm(prev => ({ ...prev, frequency: v }))}
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

            {manualScheduleForm.frequency === 'Weekly' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label className="text-sm font-semibold">Run on day</Label>
                <Select 
                  value={manualScheduleForm.dayOfWeek || "Monday"} 
                  onValueChange={(v) => setManualScheduleForm(prev => ({ ...prev, dayOfWeek: v }))}
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

            {manualScheduleForm.frequency === 'Monthly' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label className="text-sm font-semibold">Run on date (1-31)</Label>
                <Input 
                  type="number" 
                  min={1} 
                  max={31} 
                  value={manualScheduleForm.dayOfMonth || 1}
                  onChange={(e) => setManualScheduleForm(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) || 1 }))}
                  className="h-11 border-slate-200"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-500">Start Date</Label>
                <Input 
                  type="date" 
                  value={manualScheduleForm.startDate}
                  onChange={(e) => setManualScheduleForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="h-11 border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-500">End Date</Label>
                <Input 
                  type="date" 
                  value={manualScheduleForm.endDate}
                  onChange={(e) => setManualScheduleForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="h-11 border-slate-200"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button 
              disabled={!selectedTaskId}
              onClick={handleFinalizeManualSchedule} 
              className="bg-primary hover:bg-primary/90 text-white font-bold"
            >
              Finalize Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
