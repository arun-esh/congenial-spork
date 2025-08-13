export type ServiceStatus = "running" | "stopped" | "failed";

export interface LogEntry {
  id: number;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  scriptPath: string;
  port: number;
  tags: string[];
  status: ServiceStatus;
  uptime: string;
  cpuUsage: string;
  memoryUsage: string;
  logs: LogEntry[];
}
