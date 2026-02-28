import Nav from '@/components/Nav';
import { fetchManyStates } from '@/lib/homeassistant';

const PRINT_ENTITIES = [
  'sensor.h2d_0948ad552900561_task_name',
  'sensor.h2d_0948ad552900561_print_status',
  'sensor.h2d_0948ad552900561_current_stage',
  'sensor.h2d_0948ad552900561_print_progress',
  'sensor.h2d_0948ad552900561_remaining_time',
  'sensor.h2d_0948ad552900561_end_time',
  'sensor.h2d_0948ad552900561_bed_temperature',
  'sensor.h2d_0948ad552900561_nozzle_temperature',
  'binary_sensor.h2d_0948ad552900561_hms_errors',
  'binary_sensor.h2d_0948ad552900561_print_error',
];

function label(entityId: string) {
  return entityId.replace('sensor.h2d_0948ad552900561_', '').replace('binary_sensor.h2d_0948ad552900561_', '').replaceAll('_', ' ');
}

export default async function PrintingPage() {
  const states = await fetchManyStates(PRINT_ENTITIES);
  const get = (id: string) => states.find((s) => s.entity_id === id)?.state ?? '—';

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <Nav />
        <h1 className="text-3xl font-bold">3D Printing</h1>
        <p className="mt-2 text-zinc-300">Bambu H2D live status.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-400">Task</p>
            <p className="mt-1 text-sm">{get('sensor.h2d_0948ad552900561_task_name')}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-400">Status</p>
            <p className="mt-1 text-sm">{get('sensor.h2d_0948ad552900561_print_status')} / {get('sensor.h2d_0948ad552900561_current_stage')}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-400">Progress</p>
            <p className="mt-1 text-sm">{get('sensor.h2d_0948ad552900561_print_progress')}%</p>
          </div>
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
