import { NextRequest, NextResponse } from 'next/server';

async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json(
      { ok: false, error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID' },
      { status: 500 }
    );
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

  const bodyText = await res.text();
  return NextResponse.json({ ok: res.ok, status: res.status, body: bodyText }, { status: res.ok ? 200 : 502 });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const text = url.searchParams.get('text') || 'Telegram test message ✅';
  // @ts-ignore return type alignment for early env failure
  return await sendTelegramMessage(text);
}



