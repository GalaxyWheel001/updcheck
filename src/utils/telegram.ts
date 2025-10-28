export async function tgTrack(type: 'visit' | 'spin' | 'casino_redirect', payload: Record<string, unknown>) {
  try {
    await fetch('/api/telegram/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    // silent
  }
}


