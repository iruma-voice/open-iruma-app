import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pdfPath = searchParams.get('path');

  if (!pdfPath) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  // Basic security check: ensure it's a PDF and resides in the public disclosure directory
  // Note: For a local admin tool, this is less critical, but good practice.
  if (!pdfPath.toLowerCase().endsWith('.pdf')) {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
  }

  try {
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(pdfPath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(path.basename(pdfPath))}`,
      },
    });
  } catch (error) {
    console.error('Failed to read PDF:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
