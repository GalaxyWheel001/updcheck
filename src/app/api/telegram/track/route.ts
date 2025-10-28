import { NextRequest, NextResponse } from 'next/server';

type TrackEventBody = {
  type: 'visit' | 'repeat_visit' | 'spin' | 'casino_redirect';
  userId: string;
  data?: Record<string, unknown>;
};

function getClientIp(req: NextRequest): string | undefined {
  // Try multiple IP sources in order of reliability
  const ipSources = [
    req.headers.get('x-nf-client-connection-ip'), // Netlify
    req.headers.get('cf-connecting-ip'), // Cloudflare
    req.headers.get('x-forwarded-for'), // Standard proxy
    req.headers.get('x-real-ip'), // Nginx
    req.headers.get('x-client-ip'), // Apache
    req.headers.get('x-cluster-client-ip'), // Cluster
    req.headers.get('x-forwarded'), // Alternative
    req.headers.get('forwarded-for'), // Alternative
    req.headers.get('forwarded') // Alternative
  ];

  for (const ip of ipSources) {
    if (ip) {
      // Handle comma-separated IPs (take first one)
      const cleanIp = ip.split(',')[0]?.trim();
      if (cleanIp && cleanIp !== 'unknown' && cleanIp !== '::1') {
        return cleanIp;
      }
    }
  }

  // @ts-ignore nextjs edge/runtime may not expose
  return (req as any)?.ip;
}

async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const groupId = process.env.TELEGRAM_GROUP_ID; // Добавляем ID группы
  
  if (!token || !chatId) {
    console.warn(
      'Telegram env missing:',
      JSON.stringify({
        hasToken: Boolean(token),
        hasChatId: Boolean(chatId),
        hasGroupId: Boolean(groupId)
      })
    );
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
  // Отправляем в основной чат
  const res1 = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  
  if (!res1.ok) {
    const body = await res1.text();
    console.warn('Telegram send to chat failed', res1.status, body);
  }

  // Если есть группа, отправляем и туда
  if (groupId) {
    const res2 = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: groupId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    
    if (!res2.ok) {
      const body = await res2.text();
      console.warn('Telegram send to group failed', res2.status, body);
    }
  }
}

// Simplified geo detection for Netlify compatibility
function parseUserAgent(ua: string) {
  const browser = (() => {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera')) return 'Opera';
    return 'Unknown';
  })();

  const os = (() => {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac OS')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  })();

  const device = (() => {
    if (ua.includes('Mobile')) return 'Mobile';
    if (ua.includes('Tablet')) return 'Tablet';
    return 'Desktop';
  })();

  return { browser, os, device };
}

function countryCodeToFlagEmoji(cc?: string) {
  if (!cc || cc.length !== 2) return '';
  const codePoints = cc
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

async function getGeoData(ip: string, req: NextRequest) {
  // 1) Try Netlify header x-nf-geo (most accurate)
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
        region: g?.subdivision?.name || g?.region || g?.subdivision || undefined
      };
    }
  } catch {}

  // 2) Try Cloudflare header cf-ipcountry
  try {
    const cfCountry = req.headers.get('cf-ipcountry');
    if (cfCountry && cfCountry !== 'XX') {
      // Extended country names mapping
      const countryNames: Record<string, string> = {
        'AZ': 'Azerbaijan', 'US': 'United States', 'RU': 'Russia', 'TR': 'Turkey',
        'GB': 'United Kingdom', 'DE': 'Germany', 'FR': 'France', 'IT': 'Italy',
        'ES': 'Spain', 'NL': 'Netherlands', 'PL': 'Poland', 'UA': 'Ukraine',
        'CN': 'China', 'JP': 'Japan', 'KR': 'South Korea', 'IN': 'India',
        'BR': 'Brazil', 'CA': 'Canada', 'AU': 'Australia', 'MX': 'Mexico',
        'AR': 'Argentina', 'CL': 'Chile', 'CO': 'Colombia', 'PE': 'Peru',
        'EG': 'Egypt', 'ZA': 'South Africa', 'NG': 'Nigeria', 'KE': 'Kenya',
        'SA': 'Saudi Arabia', 'AE': 'UAE', 'IL': 'Israel', 'IR': 'Iran',
        'PK': 'Pakistan', 'BD': 'Bangladesh', 'TH': 'Thailand', 'VN': 'Vietnam',
        'ID': 'Indonesia', 'MY': 'Malaysia', 'SG': 'Singapore', 'PH': 'Philippines'
      };
      return {
        country: countryNames[cfCountry] || cfCountry,
        country_code: cfCountry,
        city: undefined,
        region: undefined
      };
    }
  } catch {}

  // 3) Try ipapi.co with better error handling
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: AbortSignal.timeout(5000)
    });
    if (response.ok) {
      const data = await response.json();
      if (data.country_code && data.country_code !== 'XX') {
      return {
        country: data.country_name || 'Unknown',
          country_code: data.country_code,
          city: data.city || undefined,
          region: data.region || data.region_code || undefined
        };
      }
    }
  } catch {}

  // 4) Try ip-api.com as fallback
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,countryCode,city,region`, {
      signal: AbortSignal.timeout(5000)
    });
    if (response.ok) {
      const data = await response.json();
      if (data.countryCode && data.countryCode !== 'XX') {
        return {
          country: data.country || 'Unknown',
          country_code: data.countryCode,
          city: data.city || undefined,
          region: data.region || undefined
        };
      }
    }
  } catch {}

  // 5) Try geojs.io as last resort
  try {
    const response = await fetch('https://get.geojs.io/v1/ip/geo.json', {
      signal: AbortSignal.timeout(5000)
    });
    if (response.ok) {
      const data = await response.json();
      if (data.country_code && data.country_code !== 'XX') {
        return {
          country: data.country || 'Unknown',
          country_code: data.country_code,
          city: data.city || undefined,
          region: data.region || data.region_code || undefined
        };
      }
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

    // Debug logging for geo issues
    if (geo.country === 'Unknown') {
      console.warn('Geo detection failed:', {
        ip,
        nfGeo: req.headers.get('x-nf-geo'),
        cfCountry: req.headers.get('cf-ipcountry'),
        userAgent: userAgent.substring(0, 100)
      });
    }

    const uaInfo = parseUserAgent(userAgent);
    let text = '';
    const flag = countryCodeToFlagEmoji(geo.country_code);
    const geoLine = `${flag ? flag + ' ' : ''}${geo.country}` + (geo.city ? `, ${geo.city}` : '');
    
    // Compact format
    const base = `👤 <b>User</b>: <code>${body.userId}</code>\n📍 <b>Geo</b>: ${geoLine}\n📱 <b>Device</b>: ${uaInfo.device} | ${uaInfo.browser} | ${uaInfo.os}\n🕒 <b>Time</b>: ${time}`;

    if (body.type === 'visit') {
      text = `🟢 <b>New visitor</b>\n${base}`;
    } else if (body.type === 'repeat_visit') {
      text = `🔄 <b>Repeat visitor</b>\n${base}`;
    } else if (body.type === 'spin') {
      const amount = (body.data as any)?.amount;
      const currency = (body.data as any)?.currency;
      const promocode = (body.data as any)?.promocode;
      text = `🎡 <b>Spin completed</b>\n${base}\n💰 <b>Win</b>: ${amount} ${currency} | 🏷️ <b>Promo</b>: ${promocode ?? '-'}`;
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


