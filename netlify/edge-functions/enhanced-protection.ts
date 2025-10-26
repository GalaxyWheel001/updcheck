import { Context } from "https://edge.netlify.com";
import { isBot } from "../edge-lib/bot-detector.ts";
import { getRedirectConfig, shouldExcludePath } from "../edge-lib/redirect-config.ts";

export default async function handler(req: Request, context: Context) {
  const url = new URL(req.url);
  
  // Получаем конфигурацию редиректов
  const config = getRedirectConfig();
  
  // Проверяем, нужно ли исключить путь из проверки
  if (shouldExcludePath(url.pathname, config)) {
    return context.next();
  }

  // Используем улучшенную детекцию ботов
  const botInfo = isBot(req);

  if (botInfo.isBot) {
    console.log(`Enhanced protection: Bot detected - ${botInfo.type} - ${botInfo.userAgent}`);
    
    // Для подозрительных ботов возвращаем 403
    if (botInfo.type === "scraper" || botInfo.type === "blocked_ip") {
      return new Response("Access denied: bot or scraper detected", { 
        status: 403,
        headers: {
          "Content-Type": "text/plain",
          "X-Bot-Type": botInfo.type
        }
      });
    }
    
    // Для других ботов - редирект
    return Response.redirect(config.botRedirectUrl, 302);
  }

  // Дополнительные проверки безопасности
  const referer = req.headers.get("referer");
  const acceptLanguage = req.headers.get("accept-language");
  
  // Проверка на подозрительные рефереры
  if (referer && /(facebook|twitter|linkedin|instagram|tiktok)\.com/i.test(referer)) {
    console.log(`Suspicious referer detected: ${referer}`);
    return Response.redirect(config.botRedirectUrl, 302);
  }
  
  // Проверка на отсутствие Accept-Language (часто у ботов)
  if (!acceptLanguage || acceptLanguage.length < 5) {
    console.log(`Suspicious request: missing or short Accept-Language header`);
    return Response.redirect(config.botRedirectUrl, 302);
  }

  return context.next();
}
