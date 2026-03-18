"use client"

import * as React from "react"
import { X, Search, Table as TableIcon, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { useToast } from "@/hooks/use-toast"

interface ConfigureTablesModalProps {
  isOpen: boolean
  onClose: () => void
  databaseName: string
}

type TableData = {
  name: string
  schema: string
  size: string
  records: string
}

const MOCK_TABLES: TableData[] = [
  { name: "Auth_Consult_Notes", schema: "dbo", size: "420 MB", records: "609,251" },
  { name: "Claims_inquiry_Response", schema: "dbo", size: "85 MB", records: "44,738" },
  { name: "POST_DISMISSALS", schema: "dbo", size: "2.1 GB", records: "1,586,110" },
  { name: "PROV_CONSULT_NOTES", schema: "dbo", size: "12.4 GB", records: "5,570,747" },
  { name: "REQUEST_LOG", schema: "audit", size: "180 MB", records: "331,196" },
  { name: "USERS", schema: "auth", size: "45 MB", records: "154,494" },
  { name: "WEB_AUDIT_TRAIL", schema: "audit", size: "142 GB", records: "58,548,194" },
  { name: "WEB_AUTH_DETAILS", schema: "auth", size: "32.1 GB", records: "22,069,814" },
]

export function ConfigureTablesModal({ isOpen, onClose, databaseName }: ConfigureTablesModalProps) {
  const { toast } = useToast()
  const [tableSearch, setTableSearch] = React.useState("")
  const [selectedTables, setSelectedTables] = React.useState<string[]>([])
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof TableData, direction: 'asc' | 'desc' } | null>({ key: 'name', direction: 'asc' })

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
    return value
  }

  const parseRecords = (recordsStr: string) => parseInt(recordsStr.replace(/,/g, ''), 10)

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
          return sortConfig.direction === 'asc' ? parseSize(aValue) - parseSize(bValue) : parseSize(bValue) - parseSize(aValue)
        }

        if (sortConfig.key === 'records') {
          return sortConfig.direction === 'asc' ? parseRecords(aValue) - parseRecords(bValue) : parseRecords(bValue) - parseRecords(aValue)
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return results
  }, [tableSearch, sortConfig])

  const isAllSelected = filteredTables.length > 0 && selectedTables.length === filteredTables.length

  const handleSave = () => {
    toast({
      title: "Tables Configured",
      description: `Monitoring ${selectedTables.length} tables for ${databaseName}.`
    })
    onClose()
  }

  const SortIndicator = ({ column }: { column: keyof TableData }) => {
    if (sortConfig?.key !== column) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />
    return sortConfig.direction === 'asc' ? <ChevronUp className="ml-2 h-3 w-3" /> : <ChevronDown className="ml-2 h-3 w-3" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 border-none overflow-hidden rounded-[2rem] shadow-2xl [&>button]:hidden">
        <DialogHeader className="px-8 py-6 border-b flex flex-row items-center justify-between bg-white">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold text-[#4A6076]">
              Configure Tables: {databaseName}
            </DialogTitle>
            <p className="text-xs text-slate-400 font-medium">Select the tables you want SQL Sentinel to monitor.</p>
          </div>
          <Button variant="outline" size="icon" onClick={onClose} className="h-9 w-9 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-8 bg-white space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Filter tables..." 
              className="pl-9 h-11 border-slate-200 bg-slate-50/50 rounded-xl"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
          </div>
          
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <ScrollArea className="h-[350px] w-full">
              <Table>
                <TableHeader className="bg-slate-50/80 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={isAllSelected} 
                        onCheckedChange={() => setSelectedTables(isAllSelected ? [] : filteredTables.map(t => t.name))}
                      />
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase cursor-pointer" onClick={() => handleSort('name')}>
                      Name <SortIndicator column="name" />
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase cursor-pointer" onClick={() => handleSort('records')}>
                      Records <SortIndicator column="records" />
                    </TableHead>
                    <TableHead className="text-right text-[10px] font-bold uppercase cursor-pointer" onClick={() => handleSort('size')}>
                      Size <SortIndicator column="size" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTables.map((table) => (
                    <TableRow key={table.name} className="cursor-pointer" onClick={() => toggleTable(table.name)}>
                      <TableCell><Checkbox checked={selectedTables.includes(table.name)} /></TableCell>
                      <TableCell className="text-sm font-semibold">{table.name}</TableCell>
                      <TableCell className="text-xs text-slate-500">{table.records}</TableCell>
                      <TableCell className="text-right text-xs font-bold">{table.size}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-slate-50 flex sm:justify-between gap-4">
          <div className="text-xs font-bold text-slate-400 uppercase self-center">
            {selectedTables.length} Tables Selected
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="h-11 px-6 rounded-xl font-bold">Cancel</Button>
            <Button onClick={handleSave} className="h-11 px-8 rounded-xl bg-primary text-white font-bold">Update Monitoring</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
