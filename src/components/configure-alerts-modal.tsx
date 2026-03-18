"use client"

import * as React from "react"
import { X, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ConfigureAlertsModalProps {
  isOpen: boolean
  onClose: () => void
  databaseName: string
}

export function ConfigureAlertsModal({ isOpen, onClose, databaseName }: ConfigureAlertsModalProps) {
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
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 border-none overflow-hidden rounded-[2rem] shadow-2xl [&>button]:hidden">
        <DialogHeader className="px-8 py-6 border-b flex flex-row items-center justify-between bg-white">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold text-[#4A6076]">
              Alert Thresholds: {databaseName}
            </DialogTitle>
            <p className="text-xs text-slate-400 font-medium">Define when you want to be notified of health issues.</p>
          </div>
          <Button variant="outline" size="icon" onClick={onClose} className="h-9 w-9 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-8 bg-white space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-700">Fragmentation Alert</Label>
              <span className="text-xs font-bold text-emerald-600">{thresholds.frag}%</span>
            </div>
            <Input 
              type="number" 
              value={thresholds.frag}
              onChange={(e) => setThresholds(prev => ({ ...prev, frag: e.target.value }))}
              className="h-11 border-slate-200 rounded-xl"
            />
            <p className="text-[10px] text-slate-400 font-medium italic">Trigger warning when index fragmentation exceeds this limit.</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-700">No-Access Warning</Label>
              <span className="text-xs font-bold text-emerald-600">{thresholds.access} Days</span>
            </div>
            <Input 
              type="number" 
              value={thresholds.access}
              onChange={(e) => setThresholds(prev => ({ ...prev, access: e.target.value }))}
              className="h-11 border-slate-200 rounded-xl"
            />
            <p className="text-[10px] text-slate-400 font-medium italic">Flag tables that haven't been accessed in X days for potential redundancy.</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-700">Slow Query Threshold</Label>
              <span className="text-xs font-bold text-emerald-600">{thresholds.slow} Secs</span>
            </div>
            <Input 
              type="number" 
              value={thresholds.slow}
              onChange={(e) => setThresholds(prev => ({ ...prev, slow: e.target.value }))}
              className="h-11 border-slate-200 rounded-xl"
            />
            <p className="text-[10px] text-slate-400 font-medium italic">Log and monitor queries executing longer than this duration.</p>
          </div>
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-slate-50 flex sm:justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="h-11 px-6 rounded-xl font-bold">Cancel</Button>
          <Button onClick={handleSave} className="h-11 px-8 rounded-xl bg-primary text-white font-bold">Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
