import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'master_mapping.json');

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return NextResponse.json({ error: 'Mapping file not found' }, { status: 404 });
    }
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Failed to read mapping:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updatedData = await request.json();
    
    // Write formatted JSON back to file
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to write mapping:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
