import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type Creds = { url?: string; token?: string };

function readCredsFromFile(): Creds {
  try {
    const p = path.join(os.homedir(), 'Documents', 'Zircon-Workshop', 'inbox', 'homeassistant-credentials.txt');
    const txt = fs.readFileSync(p, 'utf8');
    const lines = txt.split(/\r?\n/);
    const out: Creds = {};
    for (const line of lines) {
      if (line.startsWith('url=')) out.url = line.slice(4).trim();
      if (line.startsWith('token=')) out.token = line.slice(6).trim();
    }
    return out;
  } catch {
    return {};
  }
}

function getCreds(): { url: string; token: string } {
  const fileCreds = readCredsFromFile();
  const url = process.env.HA_URL || fileCreds.url;
  const token = process.env.HA_TOKEN || fileCreds.token;
  if (!url || !token) throw new Error('Home Assistant credentials not configured');
  return { url, token };
}

export async function fetchHaState(entityId: string) {
  const { url, token } = getCreds();
  const res = await fetch(`${url}/api/states/${entityId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HA state error ${res.status} for ${entityId}`);
  return res.json();
}

export async function fetchManyStates(entityIds: string[]) {
  return Promise.all(
    entityIds.map(async (id) => {
      try {
        const d = await fetchHaState(id);
        return { entity_id: id, state: d?.state ?? 'unknown', ok: true };
      } catch (e) {
        return { entity_id: id, state: 'unavailable', ok: false, error: e instanceof Error ? e.message : 'error' };
      }
    }),
  );
}
