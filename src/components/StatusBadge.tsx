type Tone = 'ok' | 'warn' | 'error' | 'info';

export default function StatusBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const cls = {
    ok: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    warn: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    error: 'border-red-500/40 bg-red-500/10 text-red-300',
    info: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
  }[tone];

  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${cls}`}>{children}</span>;
}
