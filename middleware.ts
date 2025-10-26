import { NextRequest, NextResponse } from 'next/server';
import { detectBot, logBotDetection } from '@/utils/botDetection';
import { getBotRedirectConfig } from '@/utils/botRedirects';
// import { telegramNotifier } from '@/utils/telegramEnhanced';

// Маппинг стран к языкам
const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  // Европа
  'AZ': 'az', 'RU': 'ru', 'UA': 'uk', 'BY': 'ru', 'KZ': 'ru', 'UZ': 'ru', 'AM': 'hy', 'GE': 'ka',
  'MD': 'ro', 'RO': 'ro', 'BG': 'bg', 'HR': 'hr', 'SI': 'sl', 'SK': 'sk', 'CZ': 'cs',
  'PL': 'pl', 'HU': 'hu', 'EE': 'et', 'LV': 'lv', 'LT': 'lt', 'MT': 'mt', 'CY': 'el',
  'GR': 'el', 'IT': 'it', 'ES': 'es', 'PT': 'pt', 'FR': 'fr', 'BE': 'nl', 'NL': 'nl',
  'DE': 'de', 'AT': 'de', 'CH': 'de', 'LI': 'de', 'LU': 'fr', 'MC': 'fr', 'AD': 'ca',
  'GB': 'en', 'IE': 'en', 'IS': 'is', 'NO': 'no', 'SE': 'sv', 'DK': 'da', 'FI': 'fi',
  'AL': 'sq', 'MK': 'mk', 'RS': 'sr', 'ME': 'sr', 'BA': 'bs', 'XK': 'sq', 'TR': 'tr',
  
  // Северная Америка
  'US': 'en', 'CA': 'en', 'MX': 'es',
  
  // Южная Америка
  'BR': 'pt-BR', 'AR': 'es', 'CL': 'es', 'CO': 'es', 'PE': 'es', 'VE': 'es', 'EC': 'es',
  'BO': 'es', 'PY': 'es', 'UY': 'es', 'GY': 'en', 'SR': 'nl', 'GF': 'fr', 'FK': 'en',
  
  // Азия
  'JP': 'ja', 'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'MO': 'zh', 'KR': 'ko', 'VN': 'vi',
  'TH': 'th', 'MY': 'ms', 'ID': 'id', 'PH': 'fil', 'SG': 'en', 'BN': 'en', 'KH': 'km',
  'LA': 'lo', 'MM': 'my', 'BD': 'bn', 'LK': 'si', 'NP': 'ne', 'BT': 'dz', 'MV': 'dv',
  'IN': 'hi', 'PK': 'ur', 'AF': 'ps', 'IR': 'fa', 'IQ': 'ar', 'SY': 'ar', 'LB': 'ar',
  'JO': 'ar', 'PS': 'ar', 'IL': 'he', 'SA': 'ar', 'AE': 'ar', 'QA': 'ar', 'KW': 'ar',
  'BH': 'ar', 'OM': 'ar', 'YE': 'ar',
  
  // Африка
  'EG': 'ar', 'LY': 'ar', 'TN': 'ar', 'DZ': 'ar', 'MA': 'ar', 'NG': 'en', 'GH': 'en',
  'KE': 'sw', 'UG': 'en', 'TZ': 'sw', 'ZM': 'en', 'MW': 'en', 'BW': 'en', 'NA': 'en',
  'SZ': 'en', 'LS': 'en', 'MU': 'en', 'SC': 'en', 'KM': 'ar', 'DJ': 'ar', 'ET': 'am',
  'SD': 'ar', 'SS': 'en', 'ER': 'ti', 'SO': 'so', 'RW': 'rw', 'BI': 'fr', 'CD': 'fr',
  'CG': 'fr', 'GA': 'fr', 'GQ': 'es', 'CM': 'fr', 'CF': 'fr', 'TD': 'ar', 'GN': 'fr',
  'SL': 'en', 'LR': 'en', 'GM': 'en', 'SN': 'fr', 'CI': 'fr', 'BF': 'fr', 'ML': 'fr',
  'NE': 'fr', 'TG': 'fr', 'BJ': 'fr', 'GW': 'pt', 'CV': 'pt', 'ST': 'pt', 'AO': 'pt',
  'MZ': 'pt', 'ZW': 'en', 'ZA': 'af', 'MG': 'fr',
  
  // Океания
  'AU': 'en', 'NZ': 'en', 'FJ': 'en', 'PG': 'en', 'SB': 'en', 'VU': 'en', 'NC': 'fr',
  'PF': 'fr', 'WF': 'fr', 'TO': 'en', 'WS': 'en', 'KI': 'en', 'TV': 'en', 'NR': 'en',
  'PW': 'en', 'FM': 'en', 'MH': 'en', 'CK': 'en', 'NU': 'en', 'TK': 'en', 'AS': 'en',
  'GU': 'en', 'MP': 'en'
};

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const userAgentHeader = request.headers.get('user-agent');
  const userAgent = userAgentHeader || '';
  const accept = request.headers.get('accept') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  const referer = request.headers.get('referer') || '';
  
  // Собираем заголовки для анализа
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  // Проверяем, пришел ли пользователь с рекламы Meta
  const isFromMetaAds = 
    referer.includes('facebook.com') || 
    referer.includes('instagram.com') || 
    referer.includes('whatsapp.com') ||
    referer.includes('telegram.me') ||
    referer.includes('t.me');

  // 1) Основной кастомный домен должен открываться без редиректов
  if (host.endsWith('turbo-play.live')) {
    return NextResponse.next();
  }

  // 2) Рекламная ссылка gamingyalanyok.netlify.app:
  //    - без user-agent или бот → редирект на yalanyokgaming.netlify.app
  //    - реальный пользователь → редирект на turbo-play.live
  if (host.endsWith('gamingyalanyok.netlify.app')) {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const botResult = detectBot(userAgent, headers);

    if (!userAgentHeader || botResult.isBot) {
      const config = getBotRedirectConfig(botResult.botType);

      const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
      // telegramNotifier
      //   .sendBotDetectionNotification({
      //     userAgent,
      //     botType: botResult.botType || 'unknown',
      //     confidence: botResult.confidence,
      //     reasons: botResult.reasons,
      //     ip,
      //   })
      //   .catch((error) => {
      //     console.error('Failed to send bot notification:', error);
      //   });

      const response = NextResponse.redirect(getBotRedirectConfig().url, { status: 302 });
      return response;
    }

    // Реальные пользователи с рекламной ссылки идут на основной сайт
    const pathname = request.nextUrl.pathname || '/';
    const search = request.nextUrl.search || '';
    const targetUrl = new URL(`https://turbo-play.live${pathname}${search}`);
    return NextResponse.redirect(targetUrl, { status: 302 });
  }

  // 3) Любой другой хост (например, *.netlify.app):
  //    - без user-agent или бот → редирект на yalanyokgaming.netlify.app
  //    - реальный пользователь → редирект на turbo-play.live
  //    - трафик из Meta также считаем реальным пользователем и ведём на turbo-play.live
  if (!host.endsWith('turbo-play.live')) {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const botResult = detectBot(userAgent, headers);

    if (!userAgentHeader || botResult.isBot) {
      const config = getBotRedirectConfig(botResult.botType);

      const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
      // telegramNotifier
      //   .sendBotDetectionNotification({
      //     userAgent,
      //     botType: botResult.botType || 'unknown',
      //     confidence: botResult.confidence,
      //     reasons: botResult.reasons,
      //     ip,
      //   })
      //   .catch((error) => {
      //     console.error('Failed to send bot notification:', error);
      //   });

      const response = NextResponse.redirect(getBotRedirectConfig().url, { status: 302 });
      return response;
    }

    const pathname = request.nextUrl.pathname || '/';
    const search = request.nextUrl.search || '';
    const targetUrl = new URL(`https://turbo-play.live${pathname}${search}`);

    if (isFromMetaAds) {
      return NextResponse.redirect(targetUrl, { status: 302 });
    }

    return NextResponse.redirect(targetUrl, { status: 302 });
  }
  
  // Определяем страну по IP (используем встроенные заголовки Netlify)
  const country = request.headers.get('x-country') || 
                  request.headers.get('x-vercel-ip-country') || 
                  'US';
  
  // Определяем язык по стране
  const language = COUNTRY_TO_LANGUAGE[country] || 'en';
  
  console.log('🌍 Geo Detection:', {
    country,
    language,
    headers: {
      'x-country': request.headers.get('x-country'),
      'x-vercel-ip-country': request.headers.get('x-vercel-ip-country'),
      'x-forwarded-for': request.headers.get('x-forwarded-for')
    }
  });
  
  // Проверяем, есть ли уже кука с языком
  const existingLanguage = request.cookies.get('turbo_wheel_language')?.value;
  
  // Если язык изменился или куки нет - обновляем
  if (!existingLanguage || existingLanguage !== language) {
    console.log(`🔄 Language Update: ${existingLanguage || 'undefined'} → ${language}`);
    
    // Создаем response с обновленной кукой
    const response = NextResponse.next();
    response.cookies.set('turbo_wheel_language', language, { 
      path: '/', 
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Дополнительные проверки для более точного определения ботов
    const isDefinitelyHuman = 
      userAgent.includes('Mozilla/5.0') && 
      userAgent.includes('Chrome') && 
      accept.includes('text/html') && 
      acceptLanguage && 
      acceptEncoding;
    
    // Если это точно человек - пропускаем
    if (isDefinitelyHuman) {
      return response;
    }
    
    // Определяем бота с помощью нашей утилиты
    const botResult = detectBot(userAgent, headers);
    
    // Логируем обнаруженных ботов
    logBotDetection(botResult, userAgent);
    
    // Если это бот - редиректим
    if (botResult.isBot) {
      const config = getBotRedirectConfig(botResult.botType);
      
      console.log(`🚫 Redirecting bot to: ${config.url}`);
      
      // Отправляем уведомление в Telegram о боте
      const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
      // telegramNotifier.sendBotDetectionNotification({
      //   userAgent,
      //   botType: botResult.botType || 'unknown',
      //   confidence: botResult.confidence,
      //   reasons: botResult.reasons,
      //   ip
      // }).catch(error => {
      //   console.error('Failed to send bot notification:', error);
      // });
      
      const botResponse = NextResponse.redirect(config.url, {
        status: config.status as 301 | 302
      });
      
      // Добавляем дополнительные заголовки если есть
      if (config.headers) {
        Object.entries(config.headers as Record<string, string>).forEach(([key, value]) => {
          botResponse.headers.set(key, value);
        });
      }
      
      return botResponse;
    }
    
    // Для обычных пользователей - продолжаем с обновленной кукой
    return response;
  }
  
  // Если язык не изменился - просто проверяем ботов
  const isDefinitelyHuman = 
    userAgent.includes('Mozilla/5.0') && 
    userAgent.includes('Chrome') && 
    accept.includes('text/html') && 
    acceptLanguage && 
    acceptEncoding;
  
  // Если это точно человек - пропускаем
  if (isDefinitelyHuman) {
    return NextResponse.next();
  }
  
  // Определяем бота с помощью нашей утилиты
  const botResult = detectBot(userAgent, headers);
  
  // Логируем обнаруженных ботов
  logBotDetection(botResult, userAgent);
  
  // Если это бот - редиректим
  if (botResult.isBot) {
    const config = getBotRedirectConfig(botResult.botType);
    
    console.log(`🚫 Redirecting bot to: ${config.url}`);
    
    // Отправляем уведомление в Telegram о боте
    const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
    // telegramNotifier.sendBotDetectionNotification({
    //   userAgent,
    //   botType: botResult.botType || 'unknown',
    //   confidence: botResult.confidence,
    //   reasons: botResult.reasons,
    //   ip
    // }).catch(error => {
    //   console.error('Failed to send bot notification:', error);
    // });
    
    const response = NextResponse.redirect(config.url, {
      status: config.status as 301 | 302
    });
    
    // Добавляем дополнительные заголовки если есть
    if (config.headers) {
      Object.entries(config.headers as Record<string, string>).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    
    return response;
  }
  
  // Для обычных пользователей - продолжаем
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 