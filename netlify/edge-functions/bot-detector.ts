import type { Context } from "https://edge.netlify.com";

// Импортируем функции из edge-lib
import { isBot, getRedirectUrl } from "../edge-lib/bot-detector.ts";
import { getRedirectConfig, shouldExcludePath, getTargetUrl } from "../edge-lib/redirect-config.ts";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const host = request.headers.get("host") || "";
  
  // Получаем конфигурацию редиректов
  const config = getRedirectConfig();

  // Если мы уже на основном домене — пропускаем
  if (host.includes(config.mainDomain)) {
    return context.next();
  }

  // Проверяем, нужно ли исключить путь из проверки
  if (shouldExcludePath(url.pathname, config)) {
    return context.next();
  }
  
  // Проверяем, является ли запрос от бота
  const botInfo = isBot(request);
  
  if (botInfo.isBot) {
    console.log(`Bot detected: ${botInfo.type} - ${botInfo.userAgent}`);
    
    // Получаем URL для редиректа ботов
    const redirectUrl = getRedirectUrl(config.botRedirectUrl, url);
    
    return Response.redirect(redirectUrl, 302);
  }
  
  // Для реальных пользователей - редиректим на основной домен
  const targetUrl = getTargetUrl(request, config);
  return Response.redirect(targetUrl, 302);
};
