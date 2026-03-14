"use client"

import * as React from "react"
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Database, 
  Activity, 
  HardDrive, 
  AlertCircle,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  ShieldCheck
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"

const performanceData = [
  { time: "00:00", cpu: 45, memory: 60, latency: 12 },
  { time: "04:00", cpu: 32, memory: 58, latency: 10 },
  { time: "08:00", cpu: 85, memory: 82, latency: 45 },
  { time: "12:00", cpu: 65, memory: 75, latency: 28 },
  { time: "16:00", cpu: 55, memory: 70, latency: 18 },
  { time: "20:00", cpu: 40, memory: 65, latency: 15 },
]

const tableSummary = [
  { name: "Orders", rows: "1.2M", size: "450MB", health: "Healthy", alerts: 0 },
  { name: "Customers", rows: "850K", size: "120MB", health: "Healthy", alerts: 0 },
  { name: "Inventory", rows: "2.4M", size: "890MB", health: "Attention", alerts: 2 },
  { name: "AuditLogs", rows: "15.7M", size: "4.2GB", health: "Critical", alerts: 5 },
  { name: "Products", rows: "125K", size: "85MB", health: "Healthy", alerts: 0 },
]

const chartConfig = {
  cpu: {
    label: "CPU Usage",
    color: "hsl(var(--chart-1))",
  },
  memory: {
    label: "Memory Usage",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function DashboardOverview() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instance CPU</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54.2%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-destructive flex items-center"><ArrowUpRight className="h-3 w-3" /> +2.1%</span> from last hour
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Utilization</CardTitle>
            <HardDrive className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.1%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-600 flex items-center"><ArrowDownRight className="h-3 w-3" /> -0.4%</span> from last hour
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-primary">+12</span> currently active
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow duration-300 border-accent/20 bg-accent/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <ShieldCheck className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">98.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Optimized Performance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              CPU and Memory usage over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="cpu" 
                    stroke="var(--color-cpu)" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="memory" 
                    stroke="var(--color-memory)" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Pending Alerts</CardTitle>
            <CardDescription>Active issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { title: "Long Running Query", db: "Production_WS", time: "5m ago", icon: Clock, color: "text-amber-500" },
                { title: "Table Bloat Detected", db: "AuditLogs", time: "12m ago", icon: AlertCircle, color: "text-destructive" },
                { title: "High Memory usage", db: "Inventory_Master", time: "1h ago", icon: Activity, color: "text-primary" }
              ].map((alert, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`p-2 rounded-full bg-muted ${alert.color}`}>
                    <alert.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.db}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{alert.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Database Tables Overview</CardTitle>
            <CardDescription>Summary of tables for the active database</CardDescription>
          </div>
          <Badge variant="outline" className="h-6">Active: Production_Main</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Name</TableHead>
                <TableHead>Rows</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Alerts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableSummary.map((table) => (
                <TableRow key={table.name} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <TableIcon className="h-4 w-4 text-muted-foreground" />
                      {table.name}
                    </div>
                  </TableCell>
                  <TableCell>{table.rows}</TableCell>
                  <TableCell>{table.size}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={table.health === "Healthy" ? "secondary" : table.health === "Attention" ? "outline" : "destructive"}
                      className={table.health === "Healthy" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
                    >
                      {table.health === "Healthy" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                      {table.health}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {table.alerts > 0 ? (
                      <Badge variant="destructive" className="h-5 px-1.5 min-w-[20px] justify-center">{table.alerts}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
