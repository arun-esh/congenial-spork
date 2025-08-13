// Manual port configuration for services
// Edit this file to add ports for your custom services

export const SERVICE_PORTS: { [key: string]: string } = {
  // Add your custom services and their ports here
  'mcp-server': '8080',
  'mcp-service': '8081',
  'casaos-app-management': '8082',
  'casaos-gateway': '8083',
  'casaos-local-storage': '8084',
  
  // Add more services as needed
  // 'service-name': 'port-number',
};

// Function to get port for a service
export function getServicePort(serviceName: string): string {
  return SERVICE_PORTS[serviceName] || 'N/A';
}

// Function to check if a service has a configured port
export function hasServicePort(serviceName: string): boolean {
  return serviceName in SERVICE_PORTS;
}
