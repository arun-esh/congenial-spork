import SERVICE_PORTS from './service-ports.json';

// Function to get port for a service
export function getServicePort(serviceName: string): string {
  return (SERVICE_PORTS as Record<string, string>)[serviceName] || 'N/A';
}

// Function to check if a service has a configured port
export function hasServicePort(serviceName: string): boolean {
  return serviceName in SERVICE_PORTS;
}
