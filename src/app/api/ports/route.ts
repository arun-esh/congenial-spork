import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const jsonFilePath = path.resolve(process.cwd(), 'src/lib/service-ports.json');

export async function POST(request: Request) {
  try {
    const { serviceName, port } = await request.json();

    if (!serviceName || !port) {
      return NextResponse.json({ error: 'serviceName and port are required' }, { status: 400 });
    }

    const fileContents = await fs.readFile(jsonFilePath, 'utf-8');
    const portsConfig = JSON.parse(fileContents);

    portsConfig[serviceName] = port;

    await fs.writeFile(jsonFilePath, JSON.stringify(portsConfig, null, 2));

    return NextResponse.json({ status: 'success', message: 'Service added successfully' });
  } catch (error) {
    console.error('Failed to add service:', error);
    return NextResponse.json({ error: 'Failed to add service' }, { status: 500 });
  }
}
