"use client"

import * as React from "react"
import { X, Loader2, CheckCircle2, ChevronRight, Search, Table as TableIcon, Settings, Check, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface ConnectDatabaseModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: (dbName: string, serverName: string, tableCount: number) => void
}

type TableData = {
  name: string
  schema: string
  size: string
  records: string
}

const MOCK_TABLES: TableData[] = [
  { name: "Users", schema: "dbo", size: "124 MB", records: "12,500" },
  { name: "Orders", schema: "sales", size: "1.2 GB", records: "450,200" },
  { name: "OrderDetails", schema: "sales", size: "2.4 GB", records: "1,200,500" },
  { name: "Products", schema: "inv", size: "45 MB", records: "8,400" },
  { name: "Category", schema: "inv", size: "12 KB", records: "42" },
  { name: "Logs", schema: "audit", size: "14.2 GB", records: "24,500,000" },
  { name: "AuditTrail", schema: "audit", size: "8.1 GB", records: "12,200,000" },
  { name: "Transactions", schema: "dbo", size: "5.4 GB", records: "8,900,000" },
  { name: "CustomerProfiles", schema: "sales", size: "890 MB", records: "340,000" },
]

export function ConnectDatabaseModal({ isOpen, onClose, onComplete }: ConnectDatabaseModalProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isTesting, setIsTesting] = React.useState(false)
  const [isTested, setIsTested] = React.useState(false)
  const [tableSearch, setTableSearch] = React.useState("")
  const [selectedTables, setSelectedTables] = React.useState<string[]>([])
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof TableData, direction: 'asc' | 'desc' } | null>({ key: 'name', direction: 'asc' })
  
  const [formData, setFormData] = React.useState({
    dataSourceName: "",
    serverName: "",
    authType: "sql",
    userName: "",
    password: "",
    database: "",
    thresholdFrag: "30",
    thresholdAccess: "90",
    thresholdSlow: "5"
  })

  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1)
        setIsTested(false)
        setSelectedTables([])
      }, 300)
    }
  }, [isOpen])

  const isStep1Valid = React.useMemo(() => {
    const common = formData.dataSourceName.trim() !== "" && formData.serverName.trim() !== "" && formData.database !== ""
    if (formData.authType === "windows") return common
    return common && formData.userName.trim() !== "" && formData.password.trim() !== ""
  }, [formData])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (["serverName", "userName", "password", "authType", "database"].includes(field)) {
      setIsTested(false)
    }
  }

  const handleTestConnection = () => {
    setIsTesting(true)
    setTimeout(() => {
      setIsTesting(false)
      setIsTested(true)
      toast({
        title: "Connection Successful",
        description: `Successfully reached ${formData.serverName}`,
      })
    }, 1500)
  }

  const toggleTable = (tableName: string) => {
    setSelectedTables(prev => 
      prev.includes(tableName) ? prev.filter(t => t !== tableName) : [...prev, tableName]
    )
  }

  const handleSort = (key: keyof TableData) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const parseSize = (sizeStr: string) => {
    const value = parseFloat(sizeStr)
    if (sizeStr.includes('GB')) return value * 1024 * 1024
    if (sizeStr.includes('MB')) return value * 1024
    if (sizeStr.includes('KB')) return value
    return value
  }

  const parseRecords = (recordsStr: string) => {
    return parseInt(recordsStr.replace(/,/g, ''), 10)
  }

  const filteredTables = React.useMemo(() => {
    let results = MOCK_TABLES.filter(t => 
      t.name.toLowerCase().includes(tableSearch.toLowerCase()) || 
      t.schema.toLowerCase().includes(tableSearch.toLowerCase())
    )

    if (sortConfig) {
      results = [...results].sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (sortConfig.key === 'size') {
          const aSize = parseSize(aValue)
          const bSize = parseSize(bValue)
          return sortConfig.direction === 'asc' ? aSize - bSize : bSize - aSize
        }

        if (sortConfig.key === 'records') {
          const aRecs = parseRecords(aValue)
          const bRecs = parseRecords(bValue)
          return sortConfig.direction === 'asc' ? aRecs - bRecs : bRecs - aRecs
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return results
  }, [tableSearch, sortConfig])

  const isAllSelected = filteredTables.length > 0 && selectedTables.length === filteredTables.length

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTables([])
    } else {
      setSelectedTables(filteredTables.map(t => t.name))
    }
  }

  const handleFinalize = () => {
    if (onComplete) {
      onComplete(formData.dataSourceName, formData.serverName, selectedTables.length)
    }
    setCurrentStep(4)
  }

  const SortIndicator = ({ column }: { column: keyof TableData }) => {
    if (sortConfig?.key !== column) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />
    return sortConfig.direction === 'asc' ? <ChevronUp className="ml-2 h-3 w-3" /> : <ChevronDown className="ml-2 h-3 w-3" />
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
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

            {formData.authType === "sql" && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-500">User Name</Label>
                  <Input 
                    placeholder="User" 
                    className="h-11 border-slate-200 bg-slate-50/50 rounded-xl focus-visible:ring-slate-200 shadow-sm"
                    value={formData.userName}
                    onChange={(e) => handleInputChange("userName", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-500">Password</Label>
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    className="h-11 border-slate-200 bg-slate-50/50 rounded-xl focus-visible:ring-slate-200 shadow-sm"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-500">Database Name</Label>
              <Select 
                value={formData.database} 
                onValueChange={(val) => handleInputChange("database", val)}
              >
                <SelectTrigger className="h-11 border-slate-200 bg-slate-50/50 rounded-xl shadow-sm">
                  <SelectValue placeholder="Select target database" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portal">PortalDB</SelectItem>
                  <SelectItem value="sales">Sales_DB</SelectItem>
                  <SelectItem value="prod">Production_Main</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={isTesting || !formData.serverName || !formData.database}
                className="h-10 px-6 rounded-xl border-slate-200 bg-[#F8FAFC] text-[#4A6076] hover:bg-white hover:border-slate-300 font-semibold shadow-sm transition-all"
              >
                {isTesting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-500" />
                ) : isTested ? (
                  <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                ) : null}
                {isTesting ? "Testing..." : isTested ? "Tested" : "Test Connection"}
              </Button>
              {isTested && (
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Ready to connect</span>
              )}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Filter tables by name or schema..." 
                className="pl-9 h-11 border-slate-200 bg-slate-50/50 rounded-xl"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
              />
            </div>
            
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <ScrollArea className="h-[320px] w-full">
                <Table>
                  <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                    <TableRow className="hover:bg-transparent border-b border-slate-200">
                      <TableHead className="w-[50px] py-3">
                        <Checkbox 
                          checked={isAllSelected} 
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead 
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400 py-3 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Table Name
                          <SortIndicator column="name" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400 py-3 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort('schema')}
                      >
                        <div className="flex items-center">
                          Schema
                          <SortIndicator column="schema" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400 py-3 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort('records')}
                      >
                        <div className="flex items-center">
                          Records
                          <SortIndicator column="records" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 py-3 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort('size')}
                      >
                        <div className="flex items-center justify-end">
                          Size
                          <SortIndicator column="size" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTables.map((table) => (
                      <TableRow 
                        key={table.name}
                        className="cursor-pointer hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                        onClick={() => toggleTable(table.name)}
                      >
                        <TableCell className="py-3">
                          <Checkbox 
                            checked={selectedTables.includes(table.name)}
                            onCheckedChange={() => toggleTable(table.name)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell className="py-3 text-sm font-semibold text-slate-700">{table.name}</TableCell>
                        <TableCell className="py-3 text-[10px] font-bold text-slate-400 uppercase">{table.schema}</TableCell>
                        <TableCell className="py-3 text-xs font-medium text-slate-500">{table.records}</TableCell>
                        <TableCell className="py-3 text-right text-xs font-bold text-slate-600">{table.size}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
            
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">
                {selectedTables.length} tables selected
              </span>
              {selectedTables.length > 0 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => setSelectedTables([])}
                  className="text-[10px] h-auto p-0 text-rose-500 font-bold uppercase"
                >
                  Clear Selection
                </Button>
              )}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm font-semibold text-slate-700">Fragmentation Alert</Label>
                  <span className="text-xs font-bold text-emerald-600">{formData.thresholdFrag}%</span>
                </div>
                <Input 
                  type="number" 
                  value={formData.thresholdFrag}
                  onChange={(e) => handleInputChange("thresholdFrag", e.target.value)}
                  className="h-11 border-slate-200 rounded-xl"
                />
                <p className="text-[10px] text-slate-400 font-medium italic">Notify when index fragmentation exceeds this limit.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm font-semibold text-slate-700">No-Access Warning</Label>
                  <span className="text-xs font-bold text-emerald-600">{formData.thresholdAccess} Days</span>
                </div>
                <Input 
                  type="number" 
                  value={formData.thresholdAccess}
                  onChange={(e) => handleInputChange("thresholdAccess", e.target.value)}
                  className="h-11 border-slate-200 rounded-xl"
                />
                <p className="text-[10px] text-slate-400 font-medium italic">Flag tables that haven't been accessed in X days.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm font-semibold text-slate-700">Slow Query Threshold</Label>
                  <span className="text-xs font-bold text-emerald-600">{formData.thresholdSlow} Secs</span>
                </div>
                <Input 
                  type="number" 
                  value={formData.thresholdSlow}
                  onChange={(e) => handleInputChange("thresholdSlow", e.target.value)}
                  className="h-11 border-slate-200 rounded-xl"
                />
                <p className="text-[10px] text-slate-400 font-medium italic">Monitor queries executing longer than this duration.</p>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
            <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
              <Check className="h-10 w-10 text-emerald-500 stroke-[3px]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Setup Complete!</h3>
            <p className="text-slate-500 max-w-xs mx-auto mb-8">
              {formData.dataSourceName} is connected. {selectedTables.length} tables are now under active surveillance.
            </p>
            <Button 
              onClick={onClose}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl"
            >
              Go to Dashboard
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const stepIcons = [TableIcon, Search, Settings, CheckCircle2]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0 border-none overflow-hidden rounded-[2rem] shadow-2xl [&>button]:hidden">
        <DialogHeader className="px-8 py-6 border-b flex flex-row items-center justify-between bg-white">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold text-[#4A6076]">
              {currentStep === 4 
                ? "Finished" 
                : `New Data Source — Step ${currentStep}${currentStep === 3 ? " (Optional)" : ""}`
              }
            </DialogTitle>
            <div className="flex items-center gap-1.5 pt-1">
              {stepIcons.map((_, idx) => (
                <React.Fragment key={idx}>
                  <div 
                    className={`h-1.5 w-6 rounded-full transition-colors ${
                      currentStep > idx ? "bg-emerald-500" : currentStep === idx + 1 ? "bg-emerald-200" : "bg-slate-100"
                    }`}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onClose}
            className="h-9 w-9 rounded-full border-2 border-emerald-500 hover:bg-emerald-50 p-0 transition-colors shadow-none"
          >
            <X className="h-4 w-4 text-emerald-600 stroke-[4px]" />
          </Button>
        </DialogHeader>

        <div className="p-8 bg-white min-h-[440px]">
          {renderStep()}
        </div>

        {currentStep < 4 && (
          <DialogFooter className="px-8 py-6 border-t bg-[#F8F9FA] flex sm:justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={currentStep === 1 ? onClose : () => setCurrentStep(prev => prev - 1)}
              className="flex-1 h-12 border-slate-300 bg-white text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>
            <Button 
              disabled={(currentStep === 1 && (!isStep1Valid || !isTested)) || (currentStep === 2 && selectedTables.length === 0)}
              onClick={currentStep === 3 ? handleFinalize : () => setCurrentStep(prev => prev + 1)}
              className={`flex-1 h-12 font-bold rounded-xl transition-all shadow-sm ${
                ((currentStep === 1 && isStep1Valid && isTested) || (currentStep === 2 && selectedTables.length > 0) || currentStep === 3)
                  ? "bg-primary hover:bg-primary/90 text-white" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {currentStep === 1 ? "Connect DB" : currentStep === 3 ? "Finalize" : "Next Step"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
