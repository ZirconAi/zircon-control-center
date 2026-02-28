import Nav from '@/components/Nav';
import StatusBadge from '@/components/StatusBadge';
import SceneActions from '@/components/ha/SceneActions';
import { fetchManyStates } from '@/lib/homeassistant';

const LIGHTS_AND_SCENES = [
  'light.bedroom_lights_off',
  'light.third_reality_inc_3rcb01057z',
  'scene.night_mode',
  'scene.night_light',
  'scene.bedroom_lights_off',
];

const PRINTER_HEALTH = [
  'sensor.h2d_0948ad552900561_print_status',
  'sensor.h2d_0948ad552900561_current_stage',
  'binary_sensor.h2d_0948ad552900561_hms_errors',
  'binary_sensor.h2d_0948ad552900561_print_error',
  'binary_sensor.h2d_0948ad552900561_online',
];

function timeAgo(iso?: string) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

function toneFromState(state: string, entity: string) {
  const s = state.toLowerCase();
  if (entity.includes('error') || entity.includes('hms_errors')) {
    return s === 'on' ? 'error' : 'ok';
  }
  if (s === 'on' || s === 'running' || s === 'printing' || s === 'online') return 'ok';
  if (s === 'off' || s === 'idle' || s === 'finish') return 'info';
  return 'warn';
}

export default async function HomeAssistantPage() {
  const [ls, ph] = await Promise.all([fetchManyStates(LIGHTS_AND_SCENES), fetchManyStates(PRINTER_HEALTH)]);

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <Nav />
        <h1 className="text-3xl font-bold">Home Assistant</h1>
        <p className="mt-2 text-zinc-300">Live controls + health view for your automations and devices.</p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 lg:col-span-2">
            <p className="text-sm font-semibold">Lights & Scenes</p>
            <div className="mt-3 overflow-hidden rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead className="bg-zinc-950 text-zinc-300">
                  <tr>
                    <th className="px-3 py-2 text-left">Entity</th>
                    <th className="px-3 py-2 text-left">State</th>
                    <th className="px-3 py-2 text-left">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {ls.map((s) => (
                    <tr key={s.entity_id} className="border-t border-zinc-800">
                      <td className="px-3 py-2 font-mono text-xs text-zinc-300">{s.entity_id}</td>
                      <td className="px-3 py-2">
                        <StatusBadge tone={toneFromState(s.state, s.entity_id)}>{s.state}</StatusBadge>
                      </td>
                      <td className="px-3 py-2 text-zinc-400">{timeAgo(s.last_changed)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <SceneActions />
        </div>

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm font-semibold">Printer Health Signals</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ph.map((s) => (
              <div key={s.entity_id} className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs">
                <p className="font-mono text-zinc-400">{s.entity_id}</p>
                <p className="mt-1"><StatusBadge tone={toneFromState(s.state, s.entity_id)}>{s.state}</StatusBadge></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
