// Route removed — this file was added during an experimental change and has been reverted.
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ success: false, message: 'Route removed' }, { status: 410 });
}
