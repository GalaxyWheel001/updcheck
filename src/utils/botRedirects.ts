// Конфигурация редиректов для разных типов ботов
export interface BotRedirectConfig {
  url: string;
  status: 301 | 302;
  headers?: Record<string, string>;
}

// Базовые конфигурации редиректов
const BOT_REDIRECT_CONFIGS: Record<string, BotRedirectConfig> = {
  // Facebook/Meta боты
  facebook: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Google боты
  google: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Bing боты
  bing: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Twitter боты
  twitter: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // LinkedIn боты
  linkedin: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Telegram боты
  telegram: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // WhatsApp боты
  whatsapp: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Discord боты
  discord: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Apple боты
  apple: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Snapchat боты
  snapchat: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Pinterest боты
  pinterest: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Quora боты
  quora: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Embedly боты
  embedly: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // VKontakte боты
  vkontakte: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Skype боты
  skype: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Скрейперы
  scraper: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Заблокированные IP
  blocked_ip: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Подозрительные запросы
  suspicious: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Подозрительные заголовки
  suspicious_headers: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Боты без User-Agent
  no_user_agent: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Общие боты
  generic_bot: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  
  // Неизвестные боты
  unknown: {
    url: 'https://yalanyokgaming.netlify.app',
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  }
};

// Получение конфигурации редиректа для типа бота
export function getBotRedirectConfig(botType?: string): BotRedirectConfig {
  if (!botType) {
    return BOT_REDIRECT_CONFIGS.unknown;
  }
  
  return BOT_REDIRECT_CONFIGS[botType] || BOT_REDIRECT_CONFIGS.unknown;
}

// Получение всех доступных конфигураций
export function getAllBotRedirectConfigs(): Record<string, BotRedirectConfig> {
  return { ...BOT_REDIRECT_CONFIGS };
}

// Проверка, является ли URL редиректом для ботов
export function isBotRedirectUrl(url: string): boolean {
  return url === 'https://yalanyokgaming.netlify.app';
}

// Получение URL для редиректа ботов
export function getBotRedirectUrl(): string {
  return 'https://yalanyokgaming.netlify.app';
}
