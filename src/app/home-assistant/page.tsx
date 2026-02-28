import Nav from '@/components/Nav';
import { fetchManyStates } from '@/lib/homeassistant';

const ENTITIES = [
  'light.bedroom_lights_off',
  'scene.night_mode',
  'scene.night_light',
  'sensor.h2d_0948ad552900561_print_status',
  'sensor.h2d_0948ad552900561_current_stage',
  'binary_sensor.h2d_0948ad552900561_hms_errors',
];

export default async function HomeAssistantPage() {
  const states = await fetchManyStates(ENTITIES);

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <Nav />
        <h1 className="text-3xl font-bold">Home Assistant</h1>
        <p className="mt-2 text-zinc-300">Live status snapshot from your HA instance.</p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th className="px-4 py-3 text-left">Entity</th>
                <th className="px-4 py-3 text-left">State</th>
                <th className="px-4 py-3 text-left">Health</th>
              </tr>
            </thead>
            <tbody>
              {states.map((s) => (
                <tr key={s.entity_id} className="border-t border-zinc-800">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">{s.entity_id}</td>
                  <td className="px-4 py-3">{s.state}</td>
                  <td className="px-4 py-3">{s.ok ? 'OK' : 'Issue'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
