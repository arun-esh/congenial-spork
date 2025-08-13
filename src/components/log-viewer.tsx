"use client";

import { useState, useMemo } from "react";
import { useFormStatus } from "react-dom";
import type { LogEntry } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { handleSummarizeLogs } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Bot, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface LogViewerProps {
  logs: LogEntry[];
}

const levelColors = {
  INFO: "text-blue-500",
  WARN: "text-yellow-500",
  ERROR: "text-red-500",
};

function SummarizeButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
      Summarize Logs
    </Button>
  );
}

export default function LogViewer({ logs }: LogViewerProps) {
  const [filter, setFilter] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const filteredLogs = useMemo(() => {
    if (!filter) return logs;
    return logs.filter((log) =>
      log.message.toLowerCase().includes(filter.toLowerCase())
    );
  }, [logs, filter]);

  const onSummarize = async (formData: FormData) => {
    setError(null);
    setSummary(null);
    setIsSummaryOpen(true);
    const logsString = formData.get("logs") as string;
    const result = await handleSummarizeLogs(logsString);
    if (result.summary) {
      setSummary(result.summary);
    } else {
      setError(result.error ?? "An unknown error occurred.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter logs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
        <form action={onSummarize}>
          <input
            type="hidden"
            name="logs"
            value={filteredLogs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n')}
          />
          <SummarizeButton disabled={filteredLogs.length === 0} />
        </form>
      </div>
      <ScrollArea className="h-96 rounded-md border bg-muted/50 p-4 font-mono text-sm">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex gap-4">
              <span className="text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className={cn("font-bold", levelColors[log.level])}>[{log.level}]</span>
              <p className="flex-1 whitespace-pre-wrap">{log.message}</p>
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No logs to display.
          </div>
        )}
      </ScrollArea>
      <AlertDialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <Bot /> AI Log Summary
            </AlertDialogTitle>
            <AlertDialogDescription>
              An AI-powered summary of the latest logs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {summary && (
             <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Analysis Complete</AlertTitle>
                <AlertDescription className="prose prose-sm dark:prose-invert">
                    {summary}
                </AlertDescription>
            </Alert>
          )}
           {error && (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
           )}
           {!summary && !error && (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
           )}

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
