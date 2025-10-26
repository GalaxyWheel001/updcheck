// Дополнительные оптимизации производительности

// Дебаунс функция
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Троттлинг функция
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Виртуализация для больших списков
export function createVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;

  return {
    visibleCount,
    totalHeight,
    getVisibleRange: (scrollTop: number) => {
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(start + visibleCount, items.length);
      return { start, end };
    },
  };
}

// Оптимизация изображений
export function optimizeImage(
  src: string,
  width: number,
  quality: number = 80
): string {
  // Здесь можно добавить логику оптимизации изображений
  // Например, использование CDN или сервиса оптимизации
  return src;
}

// Предзагрузка критических ресурсов
export function preloadCriticalResources() {
  const criticalResources: string[] = [];

  // Предзагружаем API endpoints (disabled for static export)
  criticalResources.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = url;
    document.head.appendChild(link);
  });
}

// Оптимизация памяти
interface GCWindow extends Window {
  gc?: () => void;
}

export function cleanupMemory() {
  const maybeGC = (window as GCWindow).gc;
  if (typeof maybeGC === "function") {
    maybeGC();
  }
}

// Мониторинг производительности
export function monitorPerformance() {
  if (typeof window === "undefined") return;

  let frameCount = 0;
  let lastTime = performance.now();

  function countFrames() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      console.log(`FPS: ${fps}`);

      if (fps < 30) {
        // Отправить в аналитику, если нужно
      }

      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(countFrames);
  }

  requestAnimationFrame(countFrames);
}



