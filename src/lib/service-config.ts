// Service configuration for the dashboard
export const SERVICE_CONFIG = {
  // Custom services that should always be included
  CUSTOM_SERVICES: [
    'mcp-server',
    'mcp-service', 
    'appserver',
    'myapp',
    'custom-app',
    'webapp',
    'api-server',
    'database',
    'redis',
    'nginx',
    'apache2'
  ],

  // System services that should be excluded
  SYSTEM_SERVICES: [
    'systemd',
    'dbus', 
    'udev',
    'kmod',
    'syslog',
    'rsyslog',
    'cron',
    'atd',
    'ssh',
    'sshd',
    'network',
    'networking',
    'ufw',
    'firewalld',
    'iptables',
    'auditd',
    'apparmor',
    'apport',
    'apt',
    'snapd',
    'polkit',
    'avahi',
    'bluetooth',
    'cups',
    'cups-browsed',
    'cupsd',
    'gdm',
    'lightdm',
    'accounts-daemon',
    'fwupd',
    'packagekit',
    'snap',
    'systemd-',
    'user@',
    'user-runtime-dir',
    'user-sessions',
    'user.slice',
    'session.slice',
    'machine.slice',
    'system.slice',
    'init.scope',
    'To:', // Fix for the parsing issue
    'UNIT' // Fix for header parsing
  ],

  // Service name patterns that indicate system services
  SYSTEM_PATTERNS: [
    /^systemd-/,
    /^user@/,
    /^user-runtime-dir/,
    /^user-sessions/,
    /^user\.slice/,
    /^session\.slice/,
    /^machine\.slice/,
    /^system\.slice/,
    /^init\.scope/
  ]
};

// Function to check if a service should be included
export function shouldIncludeService(serviceName: string): boolean {
  // Skip empty or invalid service names
  if (!serviceName || 
      serviceName.trim() === '' || 
      serviceName === 'To:' || 
      serviceName === 'UNIT' ||
      serviceName.includes('To:') ||
      serviceName.includes('UNIT') ||
      serviceName.length < 2) {
    return false;
  }

  // Always include custom services
  if (SERVICE_CONFIG.CUSTOM_SERVICES.some(custom => 
    serviceName.toLowerCase().includes(custom.toLowerCase())
  )) {
    return true;
  }
  
  // Exclude system services
  if (SERVICE_CONFIG.SYSTEM_SERVICES.some(system => 
    serviceName.toLowerCase().includes(system.toLowerCase())
  )) {
    return false;
  }

  // Exclude services matching system patterns
  if (SERVICE_CONFIG.SYSTEM_PATTERNS.some(pattern => pattern.test(serviceName))) {
    return false;
  }
  
  // Include services that don't match system patterns
  return true;
}

// Function to get service display name
export function getServiceDisplayName(serviceName: string): string {
  // Remove common suffixes
  return serviceName
    .replace(/\.service$/, '')
    .replace(/\.slice$/, '')
    .replace(/\.scope$/, '');
}
