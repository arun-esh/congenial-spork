import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const FAVORITES_FILE = path.join(process.cwd(), 'src', 'lib', 'favorites.json');

async function readFavorites(): Promise<string[]> {
  try {
    const data = await fs.readFile(FAVORITES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeFavorites(favorites: string[]): Promise<void> {
  await fs.writeFile(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
}

export async function GET() {
  try {
    const favorites = await readFavorites();
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Failed to read favorites:', error);
    return NextResponse.json({ error: 'Failed to read favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { serviceName } = await request.json();
    if (!serviceName) {
      return NextResponse.json({ error: 'serviceName is required' }, { status: 400 });
    }
    const favorites = await readFavorites();
    if (!favorites.includes(serviceName)) {
      favorites.push(serviceName);
      await writeFavorites(favorites);
    }
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Failed to add favorite:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { serviceName } = await request.json();
    if (!serviceName) {
      return NextResponse.json({ error: 'serviceName is required' }, { status: 400 });
    }
    let favorites = await readFavorites();
    if (favorites.includes(serviceName)) {
      favorites = favorites.filter(name => name !== serviceName);
      await writeFavorites(favorites);
    }
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
