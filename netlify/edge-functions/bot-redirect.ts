import type { Context } from "https://edge.netlify.com";

// Импортируем функции из edge-lib
import { isBot, getRedirectUrl } from "../edge-lib/bot-detector.ts";
import { getRedirectConfig, shouldExcludePath } from "../edge-lib/redirect-config.ts";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  
  // Получаем конфигурацию редиректов
  const config = getRedirectConfig();
  
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
  
  // Для реальных пользователей - пропускаем запрос дальше
  return context.next();
};

export const config = {
  path: "/*",
  excludedPath: [
    "/_next/static/*",
    "/_next/image/*",
    "/api/*", 
    "/api/telegram/*",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.json",
    "/apple-touch-icon.png"
  ]
};

