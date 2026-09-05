import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { status: 'ok', service: 'ai-project-mentor-api', version: '0.1.0' },
    { status: 200 }
  );
}
