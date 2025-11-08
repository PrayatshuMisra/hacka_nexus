import { NextRequest, NextResponse } from 'next/server';
import { runAnywhereExecute } from '../../../lib/runanywhere';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // body: { task?: string, input?: any }
    const result = await runAnywhereExecute({ task: body.task, input: body.input });
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, info: 'Send a POST with {task,input} to run a task via RunAnywhere' });
}
