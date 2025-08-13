import type { Service, ServiceStatus } from "@/types";

let services: Service[] = [
  {
    id: "web-server-1",
    name: "Main Web Server",
    description: "Handles primary HTTP traffic.",
    scriptPath: "/etc/init.d/nginx",
    port: 80,
    tags: ["web", "production"],
    status: "running",
    uptime: "23d 4h 12m",
    cpuUsage: "5.2%",
    memoryUsage: "256 MB",
    logs: [
      { id: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), level: "INFO", message: "Server started successfully." },
      { id: 2, timestamp: new Date(Date.now() - 1800000).toISOString(), level: "INFO", message: "User 'admin' logged in." },
      { id: 3, timestamp: new Date().toISOString(), level: "WARN", message: "High CPU usage detected." },
    ],
  },
  {
    id: "database-main",
    name: "PostgreSQL DB",
    description: "Primary database for user data.",
    scriptPath: "/usr/bin/pg_ctl",
    port: 5432,
    tags: ["database", "production"],
    status: "running",
    uptime: "10d 1h 5m",
    cpuUsage: "12.0%",
    memoryUsage: "1.2 GB",
    logs: [
      { id: 1, timestamp: new Date().toISOString(), level: "INFO", message: "Database backup completed." },
    ],
  },
  {
    id: "auth-service",
    name: "Authentication API",
    description: "Handles user authentication and tokens.",
    scriptPath: "/opt/auth/start.sh",
    port: 3001,
    tags: ["api", "security"],
    status: "stopped",
    uptime: "0m",
    cpuUsage: "0%",
    memoryUsage: "0 MB",
    logs: [
      { id: 1, timestamp: new Date(Date.now() - 86400000).toISOString(), level: "INFO", message: "Service stopped by user." },
      { id: 2, timestamp: new Date(Date.now() - 90000000).toISOString(), level: "ERROR", message: "Failed to connect to redis cache." },
    ],
  },
  {
    id: "worker-jobs",
    name: "Background Jobs",
    description: "Processes background tasks and jobs.",
    scriptPath: "/usr/local/bin/celery",
    port: 0,
    tags: ["worker", "async"],
    status: "failed",
    uptime: "2h 30m",
    cpuUsage: "100%",
    memoryUsage: "512 MB",
    logs: [
       { id: 1, timestamp: new Date().toISOString(), level: "ERROR", message: "Unhandled exception: OutOfMemoryError." },
    ],
  },
];

export async function getServices(): Promise<Service[]> {
  // In a real app, this would fetch from a DB
  return Promise.resolve(services);
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  return Promise.resolve(services.find((s) => s.id === id));
}

export async function addService(serviceData: Omit<Service, 'id' | 'status' | 'uptime' | 'cpuUsage' | 'memoryUsage' | 'logs'>): Promise<Service> {
    const newService: Service = {
        ...serviceData,
        id: serviceData.name.toLowerCase().replace(/\s+/g, '-'),
        status: 'stopped',
        uptime: '0m',
        cpuUsage: '0%',
        memoryUsage: '0 MB',
        logs: [{id: 1, timestamp: new Date().toISOString(), level: 'INFO', message: 'Service created.'}]
    };
    services.push(newService);
    return Promise.resolve(newService);
}

export async function updateServiceStatus(id: string, status: ServiceStatus): Promise<Service | undefined> {
    const serviceIndex = services.findIndex(s => s.id === id);
    if (serviceIndex !== -1) {
        services[serviceIndex].status = status;
        if (status === 'running') {
            services[serviceIndex].uptime = '0m 1s';
        } else {
            services[serviceIndex].uptime = '0m';
        }
        return Promise.resolve(services[serviceIndex]);
    }
    return Promise.resolve(undefined);
}
