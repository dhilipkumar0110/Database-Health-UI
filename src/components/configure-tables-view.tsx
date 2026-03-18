
"use client"

import * as React from "react"
import { ArrowLeft, Search, Table as TableIcon, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react"
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface ConfigureTablesViewProps {
  databaseName: string
  onBack: () => void
  onSave: (count: number) => void
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

export function ConfigureTablesView({ databaseName, onBack, onSave }: ConfigureTablesViewProps) {
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
    onSave(selectedTables.length)
  }

  const SortIndicator = ({ column }: { column: keyof TableData }) => {
    if (sortConfig?.key !== column) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />
    return sortConfig.direction === 'asc' ? <ChevronUp className="ml-2 h-3 w-3" /> : <ChevronDown className="ml-2 h-3 w-3" />
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configure Tables: {databaseName}</h1>
          <p className="text-sm text-slate-400 font-medium">Select the tables you want SQL Sentinel to monitor.</p>
        </div>
      </div>

      <Card className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Filter tables by name or schema..." 
              className="pl-9 h-11 border-slate-200 bg-slate-50/50 rounded-xl"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-slate-400 uppercase">
              {selectedTables.length} Tables Selected
            </div>
            <Button onClick={handleSave} className="h-11 px-8 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/10">
              Update Monitoring
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] w-full">
            <Table>
              <TableHeader className="bg-slate-50/80 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[80px] px-8">
                    <Checkbox 
                      checked={isAllSelected} 
                      onCheckedChange={() => setSelectedTables(isAllSelected ? [] : filteredTables.map(t => t.name))}
                    />
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase cursor-pointer py-4" onClick={() => handleSort('name')}>
                    Name <SortIndicator column="name" />
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase cursor-pointer" onClick={() => handleSort('records')}>
                    Records <SortIndicator column="records" />
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase cursor-pointer px-8" onClick={() => handleSort('size')}>
                    Size <SortIndicator column="size" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTables.map((table) => (
                  <TableRow 
                    key={table.name} 
                    className={cn(
                      "cursor-pointer group hover:bg-slate-50/50 transition-colors border-b border-slate-50",
                      selectedTables.includes(table.name) && "bg-slate-50/80"
                    )} 
                    onClick={() => toggleTable(table.name)}
                  >
                    <TableCell className="px-8 py-4">
                      <Checkbox checked={selectedTables.includes(table.name)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          <TableIcon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">{table.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{table.schema}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-500">{table.records}</TableCell>
                    <TableCell className="text-right text-xs font-bold text-slate-900 px-8">{table.size}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
