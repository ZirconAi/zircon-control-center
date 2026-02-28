import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/home-assistant', label: 'Home Assistant' },
  { href: '/printing', label: '3D Printing' },
];

export default function Nav() {
  return (
    <nav className="mb-6 flex flex-wrap gap-2 text-sm">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-200 hover:border-orange-400 hover:text-orange-300">
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
