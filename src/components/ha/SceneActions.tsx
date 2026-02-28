'use client';

import { useState, useTransition } from 'react';

type Action = { label: string; entity_id: string };

const ACTIONS: Action[] = [
  { label: 'Night Mode', entity_id: 'scene.night_mode' },
  { label: 'Night Light', entity_id: 'scene.night_light' },
  { label: 'Bedroom Lights Off', entity_id: 'scene.bedroom_lights_off' },
];

export default function SceneActions() {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string>('');

  async function trigger(entity_id: string) {
    setMsg('');
    const res = await fetch('/api/ha/service', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 'scene', service: 'turn_on', entity_id }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    if (data.ok) setMsg(`Applied ${entity_id}`);
    else setMsg(data.error ?? 'Action failed');
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-sm font-semibold text-zinc-100">Quick Scene Actions</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.entity_id}
            onClick={() => startTransition(() => trigger(a.entity_id))}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 hover:border-orange-400 hover:text-orange-300 disabled:opacity-50"
            disabled={pending}
          >
            {a.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-400">{pending ? 'Sending action…' : msg || 'Ready'}</p>
    </div>
  );
}
