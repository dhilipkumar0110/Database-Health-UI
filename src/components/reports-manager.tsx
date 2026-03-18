
"use client"

import * as React from "react"
import { 
  FileText, 
  Download, 
  Database,
  RefreshCw,
  FileSpreadsheet
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function ReportsManager({ activeDb }: { activeDb: string }) {
  const [selectedDb, setSelectedDb] = React.useState(activeDb)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const { toast } = useToast()

  // Mock data for Excel export
  const MOCK_EXPORT_DATA = [
    ["Table Name", "Schema", "Row Count", "Size", "Fragmentation %", "Health Status"],
    ["WEB_AUTH_NOTES", "auth", "31,693,191", "88.4 GB", "68", "Critical"],
    ["WEB_AUDIT_TRAIL", "audit", "58,548,194", "142 GB", "62", "Critical"],
    ["USER_PROVIDERS", "auth", "9,098,052", "8.2 GB", "48", "Warning"],
    ["PROV_CONSULT_NOTES", "dbo", "5,570,747", "12.4 GB", "52", "Critical"],
    ["USERS", "auth", "154,494", "45 MB", "4", "Healthy"],
  ]

  const handleGenerateAndExport = () => {
    setIsGenerating(true)
    
    // Simulate data aggregation
    setTimeout(() => {
      const csvContent = MOCK_EXPORT_DATA.map(e => e.join(",")).join("\n")
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${selectedDb}_Health_Report_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsGenerating(false)
      toast({
        title: "Excel Report Generated",
        description: `Full health audit for ${selectedDb} has been exported.`,
      })
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <FileText className="h-7 w-7 text-primary" />
          Data Export Center
        </h1>
        <p className="text-sm text-slate-400 font-medium">Generate and download comprehensive database health records in Excel format.</p>
      </div>

      <Card className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            Excel Report Generator
          </CardTitle>
          <CardDescription className="text-sm font-medium text-slate-400 mt-1">
            Extract current table metrics, fragmentation levels, and resource usage statistics.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-10 space-y-8">
          <div className="grid gap-6 max-w-md">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Database</label>
              <Select value={selectedDb} onValueChange={setSelectedDb}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-slate-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WebPortalDB">WebPortalDB</SelectItem>
                  <SelectItem value="ReportingDB">ReportingDB</SelectItem>
                  <SelectItem value="SalesDB">SalesDB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Download className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-tight">Export Contents</h4>
              <p className="text-xs text-emerald-700/80 leading-relaxed font-medium">
                The generated file will include detailed analysis for all monitored tables, including index physical stats, buffer cache hit ratios, and recent execution counts.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-10 border-t border-slate-50 bg-slate-50/30 flex justify-end">
          <Button 
            onClick={handleGenerateAndExport} 
            disabled={isGenerating} 
            className="h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-10 shadow-lg shadow-primary/10 transition-all active:scale-95 gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Aggregating Data...
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4" />
                Generate Excel Report
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          Professional SQL Sentinel Health Audit Utility
        </p>
      </div>
    </div>
  )
}
