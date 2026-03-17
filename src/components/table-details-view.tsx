
"use client"

import * as React from "react"
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  Clock, 
  ShieldAlert, 
  Info,
  Database,
  ArrowUpRight
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TableData } from "./table-manager"
import { cn } from "@/lib/utils"

const CHART_DATA = [
  { month: 'Jan', size: 180 },
  { month: 'Feb', size: 195 },
  { month: 'Mar', size: 210 },
  { month: 'Apr', size: 225 },
  { month: 'May', size: 235 },
  { month: 'Jun', size: 245.8 },
]

export function TableDetailsView({ table }: { table: TableData }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-none shadow-sm rounded-2xl p-6 flex flex-col justify-between min-h-[140px]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Database className="h-3 w-3" /> Table Size
            </div>
            <div className="text-3xl font-bold text-slate-900">{table.size}</div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            Snapshot as of current scan
          </div>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-2xl p-6 flex flex-col justify-between min-h-[140px]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Activity className="h-3 w-3" /> Deadlocks
            </div>
            <div className="text-3xl font-bold text-slate-900">{table.deadlocks}</div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            Last 30 Days Execution Window
          </div>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-2xl p-6 flex flex-col justify-between min-h-[140px]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Zap className="h-3 w-3" /> Slow Queries
            </div>
            <div className="text-3xl font-bold text-orange-500">{table.slowQ}</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
            <span>Averaging 2.4s Execution Time</span>
          </div>
        </Card>

        <Card className="bg-[#0F172A] border-none shadow-xl rounded-2xl p-6 flex flex-col justify-between min-h-[140px]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Info className="h-3 w-3" /> Usage Frequency
            </div>
            <div className="text-3xl font-bold text-white">Low</div>
          </div>
          <div>
            <Badge className="bg-blue-900/40 text-blue-400 border-none px-3 py-1 text-[10px] font-bold rounded-full">
              High Archival Priority
            </Badge>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Growth Chart */}
        <Card className="lg:col-span-8 bg-white border-none shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="p-10 pb-0">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-xl font-bold">Table Storage Growth (GB)</CardTitle>
            </div>
            <CardDescription className="text-sm font-medium text-slate-400">
              Historical data size progression over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-6">
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    domain={[0, 260]}
                    ticks={[0, 65, 130, 195, 260]}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="size" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSize)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-8">
          {/* Missing Indexes */}
          <Card className="bg-[#FFF8F8] border-none shadow-sm rounded-3xl p-8">
            <div className="flex items-center gap-2 mb-6 text-rose-800">
              <ShieldAlert className="h-5 w-5" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Missing Indexes</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">[TRANSACTION_ID]</span>
                  <Badge className="bg-rose-50 text-rose-600 border-none font-bold text-[8px] uppercase px-2 py-0.5 rounded">Critical</Badge>
                </div>
                <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                  Missing non-clustered index detected on primary lookup field.
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm relative opacity-80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">[CREATED_AT, STATUS]</span>
                  <Badge className="bg-orange-50 text-orange-600 border-none font-bold text-[8px] uppercase px-2 py-0.5 rounded">Warning</Badge>
                </div>
                <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                  Composite index recommended to improve archival query scans.
                </p>
              </div>
            </div>
          </Card>

          {/* Slow Query Logs */}
          <Card className="bg-white border-none shadow-sm rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Slow Query Logs</h3>
            </div>
            <div className="space-y-6">
              {[
                { sql: "SELECT TOP 100 * FROM...", time: "10 min ago", duration: "4.8s" },
                { sql: "UPDATE transactions SET...", time: "45 min ago", duration: "3.2s" },
                { sql: "DELETE FROM transactions WHERE...", time: "2 hours ago", duration: "12.5s" },
              ].map((query, idx) => (
                <div key={idx} className="flex items-start justify-between group cursor-pointer border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-primary transition-colors">{query.sql}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">{query.time}</div>
                  </div>
                  <div className="text-xs font-bold text-rose-500">{query.duration}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
