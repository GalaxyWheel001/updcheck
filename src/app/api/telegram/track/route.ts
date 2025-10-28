import { NextRequest, NextResponse } from 'next/server';

type TrackEventBody = {
  type: 'visit' | 'spin' | 'casino_redirect';
  userId: string;
  data?: Record<string, unknown>;
};

function getClientIp(req: NextRequest): string | undefined {
  const fromNetlify = req.headers.get('x-nf-client-connection-ip');
  if (fromNetlify) return fromNetlify;
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf;
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
  if (!token || !chatId) {
    console.warn(
      'Telegram env missing:',
      JSON.stringify({
        hasToken: Boolean(token),
        hasChatId: Boolean(chatId)
      })
    );
    return;
  }

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
function countryCodeToFlagEmoji(cc?: string) {
  if (!cc || cc.length !== 2) return '';
  const codePoints = cc
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

async function getGeoData(ip: string, req: NextRequest) {
  // 1) Try Netlify header x-nf-geo
  try {
    const nfGeoHeader = req.headers.get('x-nf-geo');
    if (nfGeoHeader) {
      const g = JSON.parse(nfGeoHeader);
      const country_code = g?.country?.code || g?.country?.code2 || g?.country_code || 'XX';
      const country = g?.country?.name || g?.country_name || 'Unknown';
      return {
        country,
        country_code,
        city: g?.city || undefined,
        region: g?.subdivision?.name || g?.region || g?.subdivision || undefined,
        org: undefined,
        latitude: g?.latitude,
        longitude: g?.longitude,
        timezone: g?.timezone
      };
    }
  } catch {}

  // 2) ipapi.co (ASN/org, city, region)
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || 'Unknown',
        country_code: data.country_code || 'XX',
        city: data.city || undefined,
        region: data.region || data.region_code || undefined,
        org: data.org || data.org_name || data.asn || undefined,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone
      };
    }
  } catch {}

  // 3) geojs.io
  try {
    const response = await fetch('https://get.geojs.io/v1/ip/geo.json', {
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country || 'Unknown',
        country_code: data.country_code || 'XX',
        city: data.city || undefined,
        region: data.region || data.region_code || undefined,
        org: data.organization_name || data.asn || undefined,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone
      };
    }
  } catch {}

  return { country: 'Unknown', country_code: 'XX' };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TrackEventBody;
    const ip = getClientIp(req) || 'unknown';
    const geo = await getGeoData(ip, req);
    const time = new Date().toISOString();
    const userAgent = req.headers.get('user-agent') || 'n/a';
    const acceptLang = req.headers.get('accept-language') || 'n/a';
    const referer = req.headers.get('referer') || 'n/a';
    const chUa = req.headers.get('sec-ch-ua') || '';
    const chUaPlatform = req.headers.get('sec-ch-ua-platform') || '';
    const chUaMobile = req.headers.get('sec-ch-ua-mobile') || '';

    let text = '';
    const flag = countryCodeToFlagEmoji(geo.country_code);
    const geoLine = `${flag ? flag + ' ' : ''}${geo.country} (${geo.country_code})` + (geo.city ? `, ${geo.city}` : '') + (geo.region ? `, ${geo.region}` : '');
    const ctx = body.data || {} as any;
    const tz = ctx.timezone || 'n/a';
    const pageUrl = ctx.url || referer || 'n/a';
    const lang = ctx.language || acceptLang;
    const utm = (() => {
      try {
        const u = new URL(pageUrl);
        const get = (k: string) => u.searchParams.get(k) || undefined;
        const data = {
          source: get('utm_source'),
          medium: get('utm_medium'),
          campaign: get('utm_campaign'),
          term: get('utm_term'),
          content: get('utm_content')
        };
        return Object.values(data).some(Boolean) ? data : undefined;
      } catch { return undefined; }
    })();

    const clientInfo = {
      dpr: ctx.dpr,
      screen: ctx.screen,
      platform: ctx.platform,
      memoryGB: ctx.deviceMemory,
      cores: ctx.hardwareConcurrency,
      chUa: chUa || undefined,
      chUaPlatform: chUaPlatform || undefined,
      chUaMobile: chUaMobile || undefined
    };

    const geoExtra = (geo as any).org || (geo as any).timezone || (geo as any).latitude ?
      `\n🛰️ <b>ASN/Org</b>: ${((geo as any).org || 'n/a')}\n🗺️ <b>Coords</b>: ${(geo as any).latitude ?? 'n/a'}, ${(geo as any).longitude ?? 'n/a'}\n⏱️ <b>TZ (geo)</b>: ${((geo as any).timezone || 'n/a')}` : '';

    const utmLine = utm ? `\n📦 <b>UTM</b>: ${Object.entries(utm).filter(([,v])=>v).map(([k,v])=>`${k}:${v}`).join(', ')}` : '';
    const clientLine = `\n📱 <b>Client</b>: ${clientInfo.platform ?? 'n/a'}, ${clientInfo.screen ?? 'n/a'}, DPR:${clientInfo.dpr ?? 'n/a'}, RAM:${clientInfo.memoryGB ?? 'n/a'}GB, CPU:${clientInfo.cores ?? 'n/a'}`;
    const chLine = (clientInfo.chUa || clientInfo.chUaPlatform || clientInfo.chUaMobile) ? `\n🔎 <b>CH</b>: ${clientInfo.chUaPlatform ?? 'n/a'}, Mobile:${clientInfo.chUaMobile || 'n/a'}, UA:${clientInfo.chUa || 'n/a'}` : '';

    const safeUA = (userAgent.length > 350 ? userAgent.slice(0, 350) + '…' : userAgent);
    const base = `👤 <b>User</b>: <code>${body.userId}</code>\n🌐 <b>IP</b>: <code>${ip}</code>\n📍 <b>Geo</b>: ${geoLine}${geoExtra}\n🕒 <b>Time</b>: ${time}\n🧭 <b>TZ</b>: ${tz}\n🗣️ <b>Lang</b>: ${lang}\n🔗 <b>URL</b>: ${pageUrl}${utmLine}${clientLine}${chLine}\n🖥️ <b>UA</b>: <code>${safeUA}</code>`;

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


