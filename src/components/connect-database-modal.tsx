"use client"

import * as React from "react"
import { X } from "lucide-react"
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

interface ConnectDatabaseModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConnectDatabaseModal({ isOpen, onClose }: ConnectDatabaseModalProps) {
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

  const handleConnect = () => {
    // Logic for connecting would go here
    console.log("Connecting with:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 border-none overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-medium text-[#4A6076]">New Data Source</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-6 w-6 rounded-full hover:bg-slate-100 p-0"
          >
            <X className="h-4 w-4 text-slate-500" />
          </Button>
        </DialogHeader>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-normal text-slate-600">Data Source Name</Label>
            <Input 
              placeholder="Enter data source name" 
              className="h-10 border-slate-200 focus-visible:ring-slate-200"
              value={formData.dataSourceName}
              onChange={(e) => handleInputChange("dataSourceName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal text-slate-600">Server Name</Label>
            <Input 
              placeholder="Enter server name" 
              className="h-10 border-slate-200 focus-visible:ring-slate-200"
              value={formData.serverName}
              onChange={(e) => handleInputChange("serverName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal text-slate-600">Authentication type</Label>
            <Select 
              value={formData.authType} 
              onValueChange={(val) => handleInputChange("authType", val)}
            >
              <SelectTrigger className="h-10 border-slate-200">
                <SelectValue placeholder="Select authentication type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sql">SQL Server Authentication</SelectItem>
                <SelectItem value="windows">Windows Authentication</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal text-slate-600">User Name</Label>
            <Input 
              placeholder="Enter user name" 
              className="h-10 border-slate-200 focus-visible:ring-slate-200"
              value={formData.userName}
              onChange={(e) => handleInputChange("userName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal text-slate-600">Password</Label>
            <Input 
              type="password"
              placeholder="Enter password" 
              className="h-10 border-slate-200 focus-visible:ring-slate-200"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal text-slate-600">Database (Optional)</Label>
            <Select 
              value={formData.database} 
              onValueChange={(val) => handleInputChange("database", val)}
            >
              <SelectTrigger className="h-10 border-slate-200">
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
            <Button variant="outline" className="h-10 text-slate-400 border-slate-200 hover:bg-slate-50 font-normal">
              Test Connection
            </Button>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t flex sm:justify-between gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 h-10 border-slate-300 text-slate-600 font-normal rounded-md"
          >
            Cancel
          </Button>
          <Button 
            disabled={!isFormValid}
            onClick={handleConnect}
            className={`flex-1 h-10 font-normal rounded-md transition-colors ${
              isFormValid 
                ? "bg-[#FCA5A5] hover:bg-[#F87171] text-white" 
                : "bg-[#FCA5A5]/50 text-white cursor-not-allowed"
            }`}
          >
            Connect DB
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
