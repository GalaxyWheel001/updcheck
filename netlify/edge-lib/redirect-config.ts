// Конфигурация редиректов для проекта TurpoPlay

export interface RedirectConfig {
  mainDomain: string;
  botRedirectUrl: string;
  fallbackUrl: string;
  allowedPaths: string[];
  excludedPaths: string[];
}

// Получение конфигурации редиректов
export function getRedirectConfig(): RedirectConfig {
  return {
    // Основной домен проекта
    mainDomain: "turbo-play.live",
    
    // URL для редиректа ботов
    botRedirectUrl: "https://yalanyokgaming.netlify.app",
    
    // Fallback URL для неопределенных случаев
    fallbackUrl: "https://turbo-play.live",
    
    // Разрешенные пути (не требуют проверки)
    allowedPaths: [
      "/",
      "/classic",
      "/api/analytics",
      "/api/meta/game-events",
      "/api/meta/purchase",
      "/api/notify",
      "/api/telegram/alert",
      "/api/telegram/daily-report",
      "/api/telegram/interactive",
      "/api/telegram/stats",
      "/api/telegram/weekly-report"
    ],
    
    // Исключенные пути (пропускаются без проверки)
    excludedPaths: [
      "/_next/static",
      "/_next/image",
      "/api",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml",
      "/manifest.json",
      "/apple-touch-icon.png"
    ]
  };
}

// Проверка, нужно ли исключить путь из проверки
export function shouldExcludePath(pathname: string, config: RedirectConfig): boolean {
  return config.excludedPaths.some(excludedPath => 
    pathname.startsWith(excludedPath)
  );
}

// Проверка, является ли путь разрешенным
export function isAllowedPath(pathname: string, config: RedirectConfig): boolean {
  return config.allowedPaths.includes(pathname) || 
         config.allowedPaths.some(allowedPath => 
           pathname.startsWith(allowedPath)
         );
}

// Получение целевого URL для редиректа
export function getTargetUrl(request: Request, config: RedirectConfig): string {
  const url = new URL(request.url);
  const host = request.headers.get("host") || "";
  
  // Если уже на основном домене - возвращаем текущий URL
  if (host.includes(config.mainDomain)) {
    return url.toString();
  }
  
  // Иначе редиректим на основной домен
  return `https://${config.mainDomain}${url.pathname}${url.search}`;
}

