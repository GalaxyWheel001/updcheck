// Типы для определения ботов
export interface BotDetectionResult {
  isBot: boolean;
  botType?: string;
  confidence: number;
  reasons: string[];
}

// Список User-Agent'ов для ботов, модераторов и проверок
const BOT_UA_REGEX = /bot|crawl|spider|facebookexternalhit|facebot|slurp|mediapartners|adsbot|bingpreview|twitterbot|linkedinbot|embedly|quora|pinterest|crawler|python-requests|axios|wget|fetch|telegrambot|vkshare|whatsapp|skypeuripreview|discordbot|applebot|snapchat|google|yahoo|baidu|yandex|duckduckbot/i;

// Диапазоны IP, часто используемые Meta/Facebook/TikTok/Google для проверки
const BLOCKED_IP_RANGES = [
  /^31\.13\./,     // Facebook/Meta
  /^157\.240\./,   // Facebook/Meta
  /^185\.60\./,    // Facebook/Meta
  /^66\.220\./,    // Facebook/Meta
  /^69\.63\./,     // Facebook/Meta
  /^173\.252\./,   // Facebook/Meta
  /^204\.15\.20\./,// TikTok
  /^23\.235\./,    // Google cache
  /^66\.249\./,    // Googlebot
  /^157\.55\./,    // Bing
];

// Проверка на бота по User-Agent
function checkUserAgent(userAgent: string): { isBot: boolean; botType?: string; confidence: number; reasons: string[] } {
  if (!userAgent) {
    return { isBot: true, botType: 'no_user_agent', confidence: 100, reasons: ['No User-Agent provided'] };
  }

  const reasons: string[] = [];
  let confidence = 0;

  // Проверка на известные боты
  if (BOT_UA_REGEX.test(userAgent)) {
    confidence += 80;
    reasons.push('Bot User-Agent pattern detected');
    
    // Определяем тип бота
    if (userAgent.includes('facebookexternalhit') || userAgent.includes('facebot')) {
      return { isBot: true, botType: 'facebook', confidence: 95, reasons: ['Facebook bot detected'] };
    }
    if (userAgent.includes('googlebot')) {
      return { isBot: true, botType: 'google', confidence: 95, reasons: ['Google bot detected'] };
    }
    if (userAgent.includes('bingbot')) {
      return { isBot: true, botType: 'bing', confidence: 95, reasons: ['Bing bot detected'] };
    }
    if (userAgent.includes('twitterbot')) {
      return { isBot: true, botType: 'twitter', confidence: 95, reasons: ['Twitter bot detected'] };
    }
    if (userAgent.includes('linkedinbot')) {
      return { isBot: true, botType: 'linkedin', confidence: 95, reasons: ['LinkedIn bot detected'] };
    }
    if (userAgent.includes('telegrambot')) {
      return { isBot: true, botType: 'telegram', confidence: 95, reasons: ['Telegram bot detected'] };
    }
    if (userAgent.includes('whatsapp')) {
      return { isBot: true, botType: 'whatsapp', confidence: 95, reasons: ['WhatsApp bot detected'] };
    }
    if (userAgent.includes('discordbot')) {
      return { isBot: true, botType: 'discord', confidence: 95, reasons: ['Discord bot detected'] };
    }
    if (userAgent.includes('applebot')) {
      return { isBot: true, botType: 'apple', confidence: 95, reasons: ['Apple bot detected'] };
    }
    if (userAgent.includes('snapchat')) {
      return { isBot: true, botType: 'snapchat', confidence: 95, reasons: ['Snapchat bot detected'] };
    }
    if (userAgent.includes('pinterest')) {
      return { isBot: true, botType: 'pinterest', confidence: 95, reasons: ['Pinterest bot detected'] };
    }
    if (userAgent.includes('quora')) {
      return { isBot: true, botType: 'quora', confidence: 95, reasons: ['Quora bot detected'] };
    }
    if (userAgent.includes('embedly')) {
      return { isBot: true, botType: 'embedly', confidence: 95, reasons: ['Embedly bot detected'] };
    }
    if (userAgent.includes('vkshare')) {
      return { isBot: true, botType: 'vkontakte', confidence: 95, reasons: ['VKontakte bot detected'] };
    }
    if (userAgent.includes('skypeuripreview')) {
      return { isBot: true, botType: 'skype', confidence: 95, reasons: ['Skype bot detected'] };
    }
    if (userAgent.includes('python-requests') || userAgent.includes('axios') || userAgent.includes('wget') || userAgent.includes('fetch')) {
      return { isBot: true, botType: 'scraper', confidence: 90, reasons: ['Scraper tool detected'] };
    }
    
    return { isBot: true, botType: 'generic_bot', confidence: 85, reasons: ['Generic bot pattern detected'] };
  }

  // Проверка на подозрительные паттерны
  if (userAgent.length < 10) {
    confidence += 30;
    reasons.push('Suspiciously short User-Agent');
  }

  if (userAgent.includes('Mozilla') && !userAgent.includes('Chrome') && !userAgent.includes('Firefox') && !userAgent.includes('Safari')) {
    confidence += 20;
    reasons.push('Suspicious Mozilla User-Agent without browser');
  }

  if (userAgent.includes('Windows') && !userAgent.includes('Chrome') && !userAgent.includes('Firefox')) {
    confidence += 15;
    reasons.push('Windows without common browser');
  }

  return { isBot: confidence > 50, botType: confidence > 50 ? 'suspicious' : undefined, confidence, reasons };
}

// Проверка на бота по IP
function checkIP(ip: string): { isBot: boolean; botType?: string; confidence: number; reasons: string[] } {
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return { isBot: false, confidence: 0, reasons: [] };
  }

  const reasons: string[] = [];
  let confidence = 0;

  // Проверка на заблокированные IP диапазоны
  for (const range of BLOCKED_IP_RANGES) {
    if (range.test(ip)) {
      confidence += 90;
      reasons.push(`IP in blocked range: ${range.source}`);
      return { isBot: true, botType: 'blocked_ip', confidence, reasons };
    }
  }

  return { isBot: false, confidence: 0, reasons: [] };
}

// Проверка на бота по заголовкам
function checkHeaders(headers: Record<string, string>): { isBot: boolean; botType?: string; confidence: number; reasons: string[] } {
  const reasons: string[] = [];
  let confidence = 0;

  // Проверка на отсутствие важных заголовков
  if (!headers['accept']) {
    confidence += 30;
    reasons.push('Missing Accept header');
  }

  if (!headers['accept-language']) {
    confidence += 20;
    reasons.push('Missing Accept-Language header');
  }

  if (!headers['accept-encoding']) {
    confidence += 20;
    reasons.push('Missing Accept-Encoding header');
  }

  // Проверка на подозрительные заголовки
  if (headers['x-forwarded-for'] && headers['x-forwarded-for'].includes(',')) {
    confidence += 10;
    reasons.push('Multiple X-Forwarded-For values');
  }

  if (headers['user-agent'] && headers['user-agent'].length < 20) {
    confidence += 25;
    reasons.push('Suspiciously short User-Agent in headers');
  }

  return { isBot: confidence > 40, botType: confidence > 40 ? 'suspicious_headers' : undefined, confidence, reasons };
}

// Основная функция определения бота
export function detectBot(userAgent: string, headers: Record<string, string> = {}): BotDetectionResult {
  const uaResult = checkUserAgent(userAgent);
  const ipResult = checkIP(headers['x-forwarded-for'] || '');
  const headersResult = checkHeaders(headers);

  // Объединяем результаты
  const allReasons = [...uaResult.reasons, ...ipResult.reasons, ...headersResult.reasons];
  const maxConfidence = Math.max(uaResult.confidence, ipResult.confidence, headersResult.confidence);
  const isBot = uaResult.isBot || ipResult.isBot || headersResult.isBot;

  // Определяем тип бота
  let botType = 'unknown';
  if (uaResult.botType) botType = uaResult.botType;
  else if (ipResult.botType) botType = ipResult.botType;
  else if (headersResult.botType) botType = headersResult.botType;

  return {
    isBot,
    botType: isBot ? botType : undefined,
    confidence: maxConfidence,
    reasons: allReasons
  };
}

// Логирование обнаружения бота
export function logBotDetection(result: BotDetectionResult, userAgent: string): void {
  if (result.isBot) {
    console.log(`🤖 Bot detected:`, {
      type: result.botType,
      confidence: result.confidence,
      reasons: result.reasons,
      userAgent: userAgent.substring(0, 100) + (userAgent.length > 100 ? '...' : '')
    });
  }
}
