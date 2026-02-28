import Nav from '@/components/Nav';
import StatusBadge from '@/components/StatusBadge';
import { fetchManyStates } from '@/lib/homeassistant';

const PRINT_ENTITIES = [
  'sensor.h2d_0948ad552900561_task_name',
  'sensor.h2d_0948ad552900561_print_status',
  'sensor.h2d_0948ad552900561_current_stage',
  'sensor.h2d_0948ad552900561_print_progress',
  'sensor.h2d_0948ad552900561_remaining_time',
  'sensor.h2d_0948ad552900561_end_time',
  'sensor.h2d_0948ad552900561_start_time',
  'sensor.h2d_0948ad552900561_current_layer',
  'sensor.h2d_0948ad552900561_total_layer_count',
  'sensor.h2d_0948ad552900561_bed_temperature',
  'sensor.h2d_0948ad552900561_bed_target_temperature',
  'sensor.h2d_0948ad552900561_nozzle_temperature',
  'sensor.h2d_0948ad552900561_nozzle_target_temperature',
  'sensor.h2d_0948ad552900561_active_tray',
  'binary_sensor.h2d_0948ad552900561_hms_errors',
  'binary_sensor.h2d_0948ad552900561_print_error',
];

function label(entityId: string) {
  return entityId
    .replace('sensor.h2d_0948ad552900561_', '')
    .replace('binary_sensor.h2d_0948ad552900561_', '')
    .replaceAll('_', ' ');
}

function parseNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function progressTone(status: string) {
  const s = status.toLowerCase();
  if (s === 'running' || s === 'printing') return 'ok';
  if (s === 'pause' || s === 'paused') return 'warn';
  if (s.includes('error') || s.includes('fail')) return 'error';
  return 'info';
}

export default async function PrintingPage() {
  const states = await fetchManyStates(PRINT_ENTITIES);
  const get = (id: string) => states.find((s) => s.entity_id === id)?.state ?? '—';

  const progress = parseNum(get('sensor.h2d_0948ad552900561_print_progress')) ?? 0;
  const curLayer = parseNum(get('sensor.h2d_0948ad552900561_current_layer'));
  const totalLayer = parseNum(get('sensor.h2d_0948ad552900561_total_layer_count'));
  const layerPct = curLayer && totalLayer ? Math.min(100, Math.round((curLayer / totalLayer) * 100)) : null;

  const hmsErr = get('binary_sensor.h2d_0948ad552900561_hms_errors');
  const printErr = get('binary_sensor.h2d_0948ad552900561_print_error');
  const hasError = hmsErr === 'on' || printErr === 'on';

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <Nav />
        <h1 className="text-3xl font-bold">3D Printing</h1>
        <p className="mt-2 text-zinc-300">Bambu H2D live telemetry and print health.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:col-span-2">
            <p className="text-xs text-zinc-400">Task</p>
            <p className="mt-1 text-sm">{get('sensor.h2d_0948ad552900561_task_name')}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-400">Status</p>
            <div className="mt-1"><StatusBadge tone={progressTone(get('sensor.h2d_0948ad552900561_print_status'))}>{get('sensor.h2d_0948ad552900561_print_status')}</StatusBadge></div>
            <p className="mt-2 text-xs text-zinc-400">Stage: {get('sensor.h2d_0948ad552900561_current_stage')}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-400">ETA</p>
            <p className="mt-1 text-sm">{get('sensor.h2d_0948ad552900561_end_time')}</p>
            <p className="mt-2 text-xs text-zinc-400">Remaining: {get('sensor.h2d_0948ad552900561_remaining_time')}h</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Progress</p>
            <p className="text-sm text-zinc-300">{progress}%</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full bg-orange-400" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
          </div>
          <p className="mt-2 text-xs text-zinc-400">Layer: {curLayer ?? '—'} / {totalLayer ?? '—'} {layerPct !== null ? `(${layerPct}%)` : ''}</p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-400">Nozzle</p>
            <p className="mt-1 text-sm">{get('sensor.h2d_0948ad552900561_nozzle_temperature')}°C / target {get('sensor.h2d_0948ad552900561_nozzle_target_temperature')}°C</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-400">Bed</p>
            <p className="mt-1 text-sm">{get('sensor.h2d_0948ad552900561_bed_temperature')}°C / target {get('sensor.h2d_0948ad552900561_bed_target_temperature')}°C</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-400">Filament</p>
            <p className="mt-1 text-sm">{get('sensor.h2d_0948ad552900561_active_tray')}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border p-4 ${hasError ? 'border-red-500/40 bg-red-500/10' : 'border-emerald-500/30 bg-emerald-500/10'}">
          <p className="text-sm font-semibold">Error Panel</p>
          <p className="mt-2 text-sm">HMS errors: <strong>{hmsErr}</strong> · Print error: <strong>{printErr}</strong></p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th className="px-4 py-3 text-left">Metric</th>
                <th className="px-4 py-3 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {states.map((s) => (
                <tr key={s.entity_id} className="border-t border-zinc-800">
                  <td className="px-4 py-3 capitalize">{label(s.entity_id)}</td>
                  <td className="px-4 py-3">{s.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
