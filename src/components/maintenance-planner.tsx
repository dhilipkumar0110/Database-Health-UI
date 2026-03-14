"use client"

import * as React from "react"
import { CalendarDays, Clock, Info, Check, Plus, Loader2, Sparkles, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { scheduleMaintenance, MaintenanceSchedulerOutput } from "@/ai/flows/ai-maintenance-scheduler"

export function MaintenancePlanner() {
  const [description, setDescription] = React.useState("Peak hours are 9 AM to 5 PM EST on weekdays. Weekends are generally low traffic except for Sunday nights when batch processing occurs.")
  const [tasks, setTasks] = React.useState(["Full Backup", "Index Rebuild", "Data Archiving"])
  const [newTask, setNewTask] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState<MaintenanceSchedulerOutput | null>(null)

  const handleAddTask = () => {
    if (newTask && !tasks.includes(newTask)) {
      setTasks([...tasks, newTask])
      setNewTask("")
    }
  }

  const handleRemoveTask = (task: string) => {
    setTasks(tasks.filter(t => t !== task))
  }

  const handlePlan = async () => {
    if (!description || tasks.length === 0) return
    setIsLoading(true)
    try {
      const output = await scheduleMaintenance({
        databaseUsageDescription: description,
        maintenanceTasks: tasks
      })
      setResults(output)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
          <CalendarDays className="h-8 w-8 text-accent" />
          Maintenance Scheduler
        </h1>
        <p className="text-muted-foreground text-lg">
          AI-driven planning to ensure minimal operational impact during database updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Operational Context</CardTitle>
              <CardDescription>Describe your typical traffic patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Usage Description</label>
                <Textarea 
                  placeholder="Peak usage hours, specific time zones, high-load windows..."
                  className="min-h-[150px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Tasks to Schedule</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g., Log Backup" 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                  <Button size="icon" variant="outline" onClick={handleAddTask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tasks.map(task => (
                    <Badge key={task} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                      {task}
                      <button onClick={() => handleRemoveTask(task)} className="hover:text-destructive">×</button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePlan} 
                disabled={isLoading || !description || tasks.length === 0} 
                className="w-full bg-accent hover:bg-accent/90"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Schedule
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          {!results && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-lg border border-dashed border-slate-300">
              <Clock className="h-12 w-12 text-slate-200 mb-4" />
              <h3 className="text-lg font-medium text-slate-700">Recommended Window</h3>
              <p className="text-slate-500 max-w-sm">
                Get precise time windows for your maintenance tasks based on actual usage patterns.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-24 bg-slate-50" />
                </Card>
              ))}
            </div>
          )}

          {results && (
            <div className="grid grid-cols-1 gap-4">
              {results.scheduleRecommendations.map((rec, idx) => (
                <Card key={idx} className="hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-primary">{rec.task}</CardTitle>
                        <div className="flex items-center gap-2 text-accent">
                          <Clock className="h-4 w-4" />
                          <span className="font-semibold">{rec.optimalTimeWindow}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-accent text-accent">AI Recommended</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3 bg-muted/40 p-4 rounded-lg">
                      <Info className="h-5 w-5 text-accent shrink-0" />
                      <p className="text-sm text-slate-700 leading-relaxed italic">
                        "{rec.reason}"
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end gap-2 border-t pt-4">
                    <Button variant="outline" size="sm">Modify</Button>
                    <Button size="sm" className="bg-primary">
                      <Check className="mr-2 h-4 w-4" />
                      Confirm Schedule
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <div className="mt-4 p-4 rounded-lg border border-amber-100 bg-amber-50 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-800">
                  Note: These recommendations are generated by SQL Sentinel AI based on the provided usage context. Please ensure time zones are aligned with your server configuration.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}