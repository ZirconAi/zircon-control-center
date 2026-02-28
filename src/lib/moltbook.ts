export type MoltbookProfile = {
  name: string;
  karma: number;
  unread_notification_count: number;
};

export async function fetchMoltbookHome(apiKey: string) {
  const res = await fetch('https://www.moltbook.com/api/v1/home', {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Moltbook API error: ${res.status}`);
  return res.json();
}
