import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { shouldIncludeService, getServiceDisplayName } from '@/lib/service-config';
import { getServicePort } from '@/lib/service-ports';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Get system services
    const { stdout: systemOutput } = await execAsync("systemctl list-units --type=service --all --no-pager --plain | awk '{print $1, $3}'");
    const systemLines = systemOutput.trim().split('\n');
    const systemServiceData = systemLines.filter(line => line && !line.startsWith("UNIT")).map(line => line.split(' '));

    // Get user services (only if user service manager is available)
    let userServiceData: string[][] = [];
    try {
      // Check if user service manager is available
      await execAsync("systemctl --user daemon-reload");
      const { stdout: userOutput } = await execAsync("systemctl --user list-units --type=service --all --no-pager --plain | awk '{print $1, $3}'");
      const userLines = userOutput.trim().split('\n');
      userServiceData = userLines.filter(line => line && !line.startsWith("UNIT")).map(line => line.split(' '));
      console.log(`[${new Date().toISOString()}] Found ${userServiceData.length} user services`);
    } catch (error) {
      console.log('No user services found or user service manager not available');
    }

    // Combine both system and user services
    const allServiceData = [...systemServiceData, ...userServiceData];

    const services = allServiceData.map((data) => {
        if (data.length === 2) {
            const [name, status] = data;
            const serviceName = name.replace(".service", "");
            
            // Check if we should include this service
            if (!shouldIncludeService(serviceName)) {
                console.log(`[${new Date().toISOString()}] Excluding service: ${serviceName}`);
                return null;
            }
            
            // Determine if this is a user service
            const isUserService = userServiceData.some(userData => userData[0] === name);
            
            return {
                id: serviceName,
                name: getServiceDisplayName(serviceName),
                status: status,
                port: getServicePort(serviceName), // Use manual port configuration
                isUserService: isUserService
            };
        }
        return null;
    });

    const validServices = services.filter(service => service && service.id);
    
    // Ensure unique service IDs to prevent React key duplication
    const uniqueServices = validServices.filter((service, index, self) => 
        service && index === self.findIndex(s => s && s.id === service.id)
    );
    
    console.log(`[${new Date().toISOString()}] Returning ${uniqueServices.length} unique services (${uniqueServices.filter(s => s?.isUserService).length} user services)`);
    
    return NextResponse.json(uniqueServices);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to list services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, serviceName } = await request.json();
    
    if (!action || !serviceName) {
      return NextResponse.json({ error: 'action and serviceName are required' }, { status: 400 });
    }

    // First, determine if this is a system or user service
    let isUserService = false;
    try {
      // Try to check if it's a user service first
      const { stdout: userCheck } = await execAsync(`systemctl --user is-active ${serviceName}.service`);
      isUserService = true;
    } catch (error) {
      // If user service check fails, it's likely a system service
      isUserService = false;
    }

    let command: string;
    if (isUserService) {
      // Use --user flag for user services
      switch (action) {
        case 'start':
          command = `systemctl --user start ${serviceName}.service`;
          break;
        case 'stop':
          command = `systemctl --user stop ${serviceName}.service`;
          break;
        case 'restart':
          command = `systemctl --user restart ${serviceName}.service`;
          break;
        default:
          return NextResponse.json({ error: 'Invalid action. Use start, stop, or restart' }, { status: 400 });
      }
    } else {
      // Use system-level commands for system services
      switch (action) {
        case 'start':
          command = `systemctl start ${serviceName}.service`;
          break;
        case 'stop':
          command = `systemctl stop ${serviceName}.service`;
          break;
        case 'restart':
          command = `systemctl restart ${serviceName}.service`;
          break;
        default:
          return NextResponse.json({ error: 'Invalid action. Use start, stop, or restart' }, { status: 400 });
      }
    }

    console.log(`[${new Date().toISOString()}] Executing command: ${command} (${isUserService ? 'user' : 'system'} service)`);
    
    try {
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr && !stderr.includes('Interactive authentication required')) {
        console.error(`Error executing ${command}:`, stderr);
        return NextResponse.json({ error: stderr }, { status: 500 });
      }
      
      console.log(`[${new Date().toISOString()}] Success with command: ${command}`);
    } catch (error: any) {
      console.error(`Command failed: ${command}`, error);
      return NextResponse.json({ 
        error: `Failed to ${action} service: ${error.message}`,
        details: `Service type: ${isUserService ? 'user' : 'system'}, Command: ${command}`
      }, { status: 500 });
    }

    // Wait a moment for the service to change state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get updated service status using the correct service type
    let newStatus = 'unknown';
    try {
      if (isUserService) {
        const { stdout: statusOutput } = await execAsync(`systemctl --user is-active ${serviceName}.service`);
        newStatus = statusOutput.trim();
      } else {
        const { stdout: statusOutput } = await execAsync(`systemctl is-active ${serviceName}.service`);
        newStatus = statusOutput.trim();
      }
    } catch (error: any) {
      // systemctl is-active returns exit code 3 for inactive services, which is normal
      if (error.code === 3) {
        newStatus = 'inactive';
        console.log(`[${new Date().toISOString()}] Service ${serviceName} is inactive (exit code 3 is normal)`);
      } else {
        console.error('Could not determine service status:', error);
        newStatus = 'unknown';
      }
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: `${serviceName} ${action}ed successfully`,
      newStatus,
      serviceType: isUserService ? 'user' : 'system'
    });
  } catch (error) {
    console.error('Service control error:', error);
    return NextResponse.json({ error: 'Failed to control service' }, { status: 500 });
  }
}
