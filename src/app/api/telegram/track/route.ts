import { NextRequest, NextResponse } from 'next/server';

type TrackEventBody = {
  type: 'visit' | 'spin' | 'casino_redirect';
  userId: string;
  data?: Record<string, unknown>;
};

function getClientIp(req: NextRequest): string | undefined {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  // @ts-ignore nextjs edge/runtime may not expose
  return (req as any)?.ip;
}

async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.warn('Telegram send failed', res.status, body);
  }
}

// Simplified geo detection for Netlify compatibility
async function getGeoData(ip: string) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || 'Unknown',
        country_code: data.country_code || 'XX'
      };
    }
  } catch (e) {
    // fallback
  }
  return { country: 'Unknown', country_code: 'XX' };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TrackEventBody;
    const ip = getClientIp(req) || 'unknown';
    const geo = await getGeoData(ip);
    const time = new Date().toISOString();

    let text = '';
    const base = `👤 <b>User</b>: <code>${body.userId}</code>\n🌐 <b>IP</b>: <code>${ip}</code>\n📍 <b>Geo</b>: ${geo.country} (${geo.country_code})\n🕒 <b>Time</b>: ${time}`;

    if (body.type === 'visit') {
      text = `🟢 <b>New visitor</b>\n${base}`;
    } else if (body.type === 'spin') {
      const amount = (body.data as any)?.amount;
      const currency = (body.data as any)?.currency;
      const promocode = (body.data as any)?.promocode;
      text = `🎡 <b>Spin completed</b>\n${base}\n💰 <b>Win</b>: ${amount} ${currency}\n🏷️ <b>Promo</b>: ${promocode ?? '-'}`;
    } else if (body.type === 'casino_redirect') {
      const promocode = (body.data as any)?.promocode;
      text = `➡️ <b>Redirect to casino</b>\n${base}\n🏷️ <b>Promo</b>: ${promocode ?? '-'}`;
    } else {
      text = `ℹ️ <b>Event</b>: ${body.type}\n${base}`;
    }

    await sendTelegramMessage(text);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}


