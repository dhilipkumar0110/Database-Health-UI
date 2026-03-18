
"use client"

import * as React from "react"
import { ArrowLeft, Bell, AlertTriangle, ShieldAlert, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

interface ConfigureAlertsViewProps {
  databaseName: string
  onBack: () => void
  onSave: () => void
}

export function ConfigureAlertsView({ databaseName, onBack, onSave }: ConfigureAlertsViewProps) {
  const { toast } = useToast()
  const [thresholds, setThresholds] = React.useState({
    frag: "30",
    access: "90",
    slow: "5"
  })

  const handleSave = () => {
    toast({
      title: "Alerts Updated",
      description: `Monitoring thresholds saved for ${databaseName}.`
    })
    onSave()
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alert Thresholds: {databaseName}</h1>
          <p className="text-sm text-slate-400 font-medium">Define when you want to be notified of health issues.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              <CardTitle className="text-lg font-bold">Fragmentation Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-700">Trigger Threshold (%)</Label>
              <span className="text-sm font-bold text-primary">{thresholds.frag}%</span>
            </div>
            <Input 
              type="number" 
              value={thresholds.frag}
              onChange={(e) => setThresholds(prev => ({ ...prev, frag: e.target.value }))}
              className="h-12 border-slate-200 rounded-xl text-lg font-bold"
            />
            <p className="text-xs text-slate-400 font-medium italic">
              Trigger a high-severity warning when index fragmentation exceeds this limit. High fragmentation can severely impact query performance.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg font-bold">Data Access Warnings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-700">Inactivity Limit (Days)</Label>
              <span className="text-sm font-bold text-primary">{thresholds.access} Days</span>
            </div>
            <Input 
              type="number" 
              value={thresholds.access}
              onChange={(e) => setThresholds(prev => ({ ...prev, access: e.target.value }))}
              className="h-12 border-slate-200 rounded-xl text-lg font-bold"
            />
            <p className="text-xs text-slate-400 font-medium italic">
              Flag tables that haven't been accessed for read or write operations in X days. These tables are prime candidates for the Redundancy Scanner.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg font-bold">Execution Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-700">Slow Query Threshold (Seconds)</Label>
              <span className="text-sm font-bold text-primary">{thresholds.slow}s</span>
            </div>
            <Input 
              type="number" 
              value={thresholds.slow}
              onChange={(e) => setThresholds(prev => ({ ...prev, slow: e.target.value }))}
              className="h-12 border-slate-200 rounded-xl text-lg font-bold"
            />
            <p className="text-xs text-slate-400 font-medium italic">
              Automatically log and alert on any queries executing longer than this duration. These logs will appear in the Performance Monitor.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="h-12 px-8 rounded-xl font-bold bg-white">
            Cancel
          </Button>
          <Button onClick={handleSave} className="h-12 px-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/10">
            Save Monitoring Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
