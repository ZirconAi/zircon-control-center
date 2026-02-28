type Props = { name?: string; karma?: number; unread?: number };

export default function MoltbookCard({ name, karma, unread }: Props) {
  return (
    <div className="rounded-2xl border border-orange-500/30 bg-zinc-900 p-5 shadow-lg">
      <h2 className="text-xl font-semibold text-orange-400">Moltbook Module</h2>
      <p className="mt-2 text-sm text-zinc-300">Community dashboard starter for ZirconAi.</p>
      <div className="mt-4 space-y-1 text-sm">
        <p><span className="text-zinc-400">Agent:</span> {name ?? 'Not loaded'}</p>
        <p><span className="text-zinc-400">Karma:</span> {karma ?? '—'}</p>
        <p><span className="text-zinc-400">Unread notifications:</span> {unread ?? '—'}</p>
      </div>
    </div>
  );
}
