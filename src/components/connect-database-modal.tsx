"use client"

import * as React from "react"
import { X, Loader2, CheckCircle2 } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface ConnectDatabaseModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConnectDatabaseModal({ isOpen, onClose }: ConnectDatabaseModalProps) {
  const { toast } = useToast()
  const [isTesting, setIsTesting] = React.useState(false)
  const [formData, setFormData] = React.useState({
    dataSourceName: "",
    serverName: "",
    authType: "sql",
    userName: "",
    password: "",
    database: "",
  })

  const isFormValid = 
    formData.dataSourceName.trim() !== "" &&
    formData.serverName.trim() !== "" &&
    formData.userName.trim() !== "" &&
    formData.password.trim() !== ""

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTestConnection = () => {
    setIsTesting(true)
    // Simulate a connection test
    setTimeout(() => {
      setIsTesting(false)
      toast({
        title: "Connection Successful",
        description: `Successfully reached ${formData.serverName}`,
      })
    }, 1500)
  }

  const handleConnect = () => {
    toast({
      title: "Database Connected",
      description: `${formData.dataSourceName} has been added to your inventory.`,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 border-none overflow-hidden rounded-2xl shadow-2xl">
        <DialogHeader className="px-6 py-5 border-b flex flex-row items-center justify-between bg-white">
          <DialogTitle className="text-xl font-bold text-[#4A6076]">New Data Source</DialogTitle>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8 rounded-full border-2 border-emerald-500 hover:bg-emerald-50 p-0 transition-colors"
          >
            <X className="h-4 w-4 text-emerald-600 stroke-[3px]" />
          </Button>
        </DialogHeader>

        <div className="p-6 space-y-4 bg-white">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-500">Data Source Name</Label>
            <Input 
              placeholder="Enter data source name" 
              className="h-11 border-slate-200 bg-slate-50/50 rounded-xl focus-visible:ring-slate-200 shadow-sm"
              value={formData.dataSourceName}
              onChange={(e) => handleInputChange("dataSourceName", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-500">Server Name</Label>
            <Input 
              placeholder="Enter server name" 
              className="h-11 border-slate-200 bg-slate-50/50 rounded-xl focus-visible:ring-slate-200 shadow-sm"
              value={formData.serverName}
              onChange={(e) => handleInputChange("serverName", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-500">Authentication type</Label>
            <Select 
              value={formData.authType} 
              onValueChange={(val) => handleInputChange("authType", val)}
            >
              <SelectTrigger className="h-11 border-slate-200 bg-slate-50/50 rounded-xl shadow-sm">
                <SelectValue placeholder="Select authentication type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sql">SQL Server Authentication</SelectItem>
                <SelectItem value="windows">Windows Authentication</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-500">User Name</Label>
            <Input 
              placeholder="Enter user name" 
              className="h-11 border-slate-200 bg-slate-50/50 rounded-xl focus-visible:ring-slate-200 shadow-sm"
              value={formData.userName}
              onChange={(e) => handleInputChange("userName", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-500">Password</Label>
            <Input 
              type="password"
              placeholder="Enter password" 
              className="h-11 border-slate-200 bg-slate-50/50 rounded-xl focus-visible:ring-slate-200 shadow-sm"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-500">Database (Optional)</Label>
            <Select 
              value={formData.database} 
              onValueChange={(val) => handleInputChange("database", val)}
            >
              <SelectTrigger className="h-11 border-slate-200 bg-slate-50/50 rounded-xl shadow-sm">
                <SelectValue placeholder="Select database" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portal">PortalDB</SelectItem>
                <SelectItem value="sales">Sales_DB</SelectItem>
                <SelectItem value="prod">Production_Main</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isTesting || !formData.serverName}
              className="h-10 px-6 rounded-xl border-slate-200 bg-[#F8FAFC] text-[#4A6076] hover:bg-white hover:border-slate-300 font-semibold shadow-sm transition-all"
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-500" />
                  Testing...
                </>
              ) : (
                "Test Connection"
              )}
            </Button>
          </div>
        </div>

        <DialogFooter className="px-6 py-5 border-t bg-[#F8F9FA] flex sm:justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 h-12 border-slate-300 bg-white text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            Cancel
          </Button>
          <Button 
            disabled={!isFormValid}
            onClick={handleConnect}
            className={`flex-1 h-12 font-bold rounded-xl transition-all shadow-sm ${
              isFormValid 
                ? "bg-[#FCA5A5] hover:bg-[#F87171] text-white" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Connect DB
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
