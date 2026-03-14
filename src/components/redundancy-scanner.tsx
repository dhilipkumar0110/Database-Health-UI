"use client"

import * as React from "react"
import { ShieldAlert, Search, Database, Sparkles, Loader2, CheckCircle2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { scanDatabaseForRedundancy, AiRedundancyScannerOutput } from "@/ai/flows/ai-redundancy-scanner-flow"
import { Badge } from "@/components/ui/badge"

export function RedundancyScanner() {
  const [schema, setSchema] = React.useState("")
  const [patterns, setPatterns] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState<AiRedundancyScannerOutput | null>(null)

  const handleScan = async () => {
    if (!schema) return
    setIsLoading(true)
    try {
      const output = await scanDatabaseForRedundancy({
        databaseSchema: schema,
        sampleDataPatterns: patterns
      })
      setResults(output)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-accent" />
          AI Redundancy Scanner
        </h1>
        <p className="text-muted-foreground text-lg">
          Optimize your database by identifying redundant tables, columns, and data patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Input Configuration</CardTitle>
              <CardDescription>Provide your schema or DDL statements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Database Schema</label>
                <Textarea 
                  placeholder="CREATE TABLE Users (id INT, email VARCHAR, ...)"
                  className="min-h-[200px] font-mono text-xs"
                  value={schema}
                  onChange={(e) => setSchema(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Data Patterns (Optional)</label>
                <Textarea 
                  placeholder="The 'address' column in table A is identical to 'loc' in table B..."
                  className="min-h-[100px] text-xs"
                  value={patterns}
                  onChange={(e) => setPatterns(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleScan} 
                disabled={isLoading || !schema} 
                className="w-full bg-accent hover:bg-accent/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Initiate Scan
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          {!results && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-lg border border-dashed border-slate-300">
              <Database className="h-12 w-12 text-slate-200 mb-4" />
              <h3 className="text-lg font-medium">Ready to Optimize</h3>
              <p className="text-slate-500 max-w-sm">Enter your database details to the left and click 'Initiate Scan' to start the analysis.</p>
            </div>
          )}

          {isLoading && (
            <div className="space-y-4">
              <Card className="animate-pulse">
                <CardHeader className="h-24 bg-slate-50" />
                <CardContent className="space-y-4 pt-6">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                </CardContent>
              </Card>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              <Card className="border-emerald-100 bg-emerald-50/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {results.redundanciesFound ? (
                      <ShieldAlert className="h-5 w-5 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    )}
                    Scan Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">{results.summary}</p>
                </CardContent>
              </Card>

              {results.redundantItems.map((item, idx) => (
                <Card key={idx} className="overflow-hidden border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">{item.type}</Badge>
                        <CardTitle className="text-lg">{item.name || "Global Pattern"}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">{item.description}</p>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Recommendations</h4>
                      <ul className="space-y-2">
                        {item.recommendations.map((rec, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2 text-sm text-slate-600">
                            <ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}