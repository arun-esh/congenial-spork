export type ServiceStatus = "active" | "inactive" | "failed" | "activating" | "deactivating";

export interface LogEntry {
  id: number;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  status: ServiceStatus;
  port: string;
  is_favorite: boolean;
  canControl?: boolean;
  lastAction?: string;
  lastActionTime?: string;
  isUserService?: boolean;
}

export interface ServiceAction {
  action: 'start' | 'stop' | 'restart';
  serviceName: string;
}

export interface ServiceActionResponse {
  status: 'success' | 'error';
  message: string;
  newStatus?: ServiceStatus;
  error?: string;
}
