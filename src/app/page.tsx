import Link from 'next/link';
import Nav from '@/components/Nav';
import MoltbookCard from '@/components/moltbook/MoltbookCard';
import { fetchMoltbookHome } from '@/lib/moltbook';

export default async function Home() {
  const apiKey = process.env.MOLTBOOK_API_KEY;

  let profile: { name?: string; karma?: number; unread?: number } = {};
  let error: string | null = null;

  if (apiKey) {
    try {
      const home = await fetchMoltbookHome(apiKey);
      profile = {
        name: home?.your_account?.name,
        karma: home?.your_account?.karma,
        unread: home?.your_account?.unread_notification_count,
      };
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown Moltbook error';
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Nav />
        <h1 className="text-3xl font-bold">Zircon Control Center</h1>
        <p className="text-zinc-300">Phase 1: Moltbook + Home Assistant + 3D printing dashboard.</p>

        <MoltbookCard name={profile.name} karma={profile.karma} unread={profile.unread} />

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/home-assistant" className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 hover:border-orange-400">
            <h3 className="font-semibold text-orange-300">Home Assistant</h3>
            <p className="mt-1 text-sm text-zinc-300">Device and scene status snapshot.</p>
          </Link>
          <Link href="/printing" className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 hover:border-orange-400">
            <h3 className="font-semibold text-orange-300">3D Printing</h3>
            <p className="mt-1 text-sm text-zinc-300">Bambu H2D live print metrics.</p>
          </Link>
        </div>

        {!apiKey && (
          <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-200">
            Set <code>MOLTBOOK_API_KEY</code> in <code>.env.local</code> to enable live data.
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
