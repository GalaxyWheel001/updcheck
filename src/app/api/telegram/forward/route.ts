import { NextRequest, NextResponse } from 'next/server';

type ForwardMessageBody = {
  channelId: string;
  groupId: string;
  messageId: number;
};

async function forwardMessageToGroup(channelId: string, groupId: string, messageId: number) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Missing TELEGRAM_BOT_TOKEN' }, { status: 500 });
  }

  const url = `https://api.telegram.org/bot${token}/forwardMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: groupId,
      from_chat_id: channelId,
      message_id: messageId,
      disable_notification: false
    }),
  });

  const bodyText = await res.text();
  return NextResponse.json({ ok: res.ok, status: res.status, body: bodyText }, { status: res.ok ? 200 : 502 });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ForwardMessageBody;
    const { channelId, groupId, messageId } = body;
    
    if (!channelId || !groupId || !messageId) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    return await forwardMessageToGroup(channelId, groupId, messageId);
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
