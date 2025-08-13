import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function getServicePort(serviceName: string): Promise<string> {
    console.log(`[${new Date().toISOString()}] Getting port for service: ${serviceName}`);
    try {
        const { stdout: pidsOutput, stderr: pidsError } = await execAsync(`systemctl show -p PIDs --value ${serviceName}.service`);
        if (pidsError) {
            console.error(`[${new Date().toISOString()}] Error getting PIDs for ${serviceName}: ${pidsError}`);
        }
        const pids = pidsOutput.trim().split(' ');
        console.log(`[${new Date().toISOString()}] PIDs for ${serviceName}: ${pids.join(', ')}`);

        if (!pids.length || pids[0] === '') {
            console.log(`[${new Date().toISOString()}] No PIDs found for ${serviceName}.`);
            return "N/A";
        }

        const { stdout: ssOutput, stderr: ssError } = await execAsync('ss -tlpn');
        if (ssError) {
            console.error(`[${new Date().toISOString()}] Error getting listening sockets: ${ssError}`);
        }
        
        const pidToPort: { [key: string]: string } = {};
        ssOutput.split('\n').forEach(line => {
            const pidMatch = line.match(/pid=(\d+)/);
            if (pidMatch) {
                const pid = pidMatch[1];
                const portMatch = line.match(/:(\d+)/);
                if (portMatch) {
                    pidToPort[pid] = portMatch[1];
                }
            }
        });

        for (const pid of pids) {
            if (pid in pidToPort) {
                const port = pidToPort[pid];
                console.log(`[${new Date().toISOString()}] Found port ${port} for PID ${pid} in service ${serviceName}.`);
                return port;
            }
        }
        console.log(`[${new Date().toISOString()}] No matching port found for any PIDs of ${serviceName}.`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] An error occurred in getServicePort for ${serviceName}:`, error);
    }
    return "N/A";
}

export async function GET() {
  try {
    const { stdout } = await execAsync("systemctl list-units --type=service --all --no-pager --plain | awk '{print $1, $3}'");
    const lines = stdout.trim().split('\n');
    const serviceData = lines.filter(line => line && !line.startsWith("UNIT")).map(line => line.split(' '));

    const services = await Promise.all(serviceData.map(async (data) => {
        if (data.length === 2) {
            const [name, status] = data;
            const serviceName = name.replace(".service", "");
            if (serviceName) {
              const port = await getServicePort(serviceName);
              return {
                  id: serviceName,
                  name: serviceName,
                  status: status,
                  port: port,
              };
            }
        }
        return null;
    }));

    return NextResponse.json(services.filter(service => service && service.id));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to list services' }, { status: 500 });
  }
}
