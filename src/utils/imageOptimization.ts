// Утилиты для оптимизации изображений

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function getOptimizedImageUrl(src: string, width: number = 800): string {
  // Если это внешнее изображение, возвращаем как есть
  if (src.startsWith('http')) {
    return src;
  }
  
  // Для локальных изображений можно добавить оптимизацию
  return src;
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Кэш для предзагруженных изображений
const imageCache = new Set<string>();

export function preloadCriticalImages(): void {
  const criticalImages = [
    '/favicon.ico'
  ];

  criticalImages.forEach(src => {
    if (!imageCache.has(src)) {
      imageCache.add(src);
      preloadImage(src).catch(console.error);
    }
  });
} 