import { NextRequest, NextResponse } from 'next/server';

type TelegramUpdate = {
  update_id: number;
  channel_post?: {
    message_id: number;
    chat: {
      id: number;
      type: string;
      title?: string;
    };
    text?: string;
    caption?: string;
  };
};

async function forwardToGroup(channelId: string, groupId: string, messageId: number) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;

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

  return res.ok;
}

export async function POST(req: NextRequest) {
  try {
    const update = (await req.json()) as TelegramUpdate;
    
    // Проверяем, что это сообщение из канала
    if (update.channel_post) {
      const channelId = update.channel_post.chat.id.toString();
      const messageId = update.channel_post.message_id;
      
      // ID группы, куда пересылать (замените на ваш)
      const groupId = process.env.TELEGRAM_GROUP_ID;
      
      if (groupId) {
        await forwardToGroup(channelId, groupId, messageId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
