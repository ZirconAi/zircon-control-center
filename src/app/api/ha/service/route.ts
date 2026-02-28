import { NextResponse } from 'next/server';
import { callHaService } from '@/lib/homeassistant';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      domain?: string;
      service?: string;
      entity_id?: string;
    };

    if (!body?.domain || !body?.service || !body?.entity_id) {
      return NextResponse.json({ ok: false, error: 'domain, service, entity_id required' }, { status: 400 });
    }

    await callHaService(body.domain, body.service, { entity_id: body.entity_id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : 'request failed' }, { status: 500 });
  }
}
