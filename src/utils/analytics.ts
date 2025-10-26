// Аналитика и мониторинг производительности

interface AnalyticsEvent {
  event: string;
  userId: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isInitialized = false;

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    // Add a small delay to ensure proper initialization
    setTimeout(() => {
      if (typeof window === 'undefined') return;
      
      // Отправляем события каждые 30 секунд
      setInterval(() => {
        this.flushEvents();
      }, 30000);

      // Отправляем события при закрытии страницы
      window.addEventListener('beforeunload', () => {
        this.flushEvents();
      });

      this.isInitialized = true;
    }, 100);
  }

  track(event: string, data?: Record<string, unknown>) {
    if (typeof window === 'undefined') return;
    
    const userId = localStorage.getItem('turbo_wheel_user_id') || 'unknown';
    
    this.events.push({
      event,
      userId,
      timestamp: Date.now(),
      data
    });

    // Если событий много, отправляем немедленно
    if (this.events.length > 10) {
      this.flushEvents();
    }
  }

  private async flushEvents() {
    if (this.events.length === 0 || typeof window === 'undefined') return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      // Log analytics events to console for static export
      console.log('Analytics events:', eventsToSend);
    } catch (error) {
      console.warn('Failed to send analytics:', error);
      // Возвращаем события обратно в очередь только если это не ошибка валидации
      if (error instanceof Error && !error.message.includes('400')) {
        this.events.unshift(...eventsToSend);
      }
    }
  }

  // Отслеживание производительности
  trackPerformance(metric: string, value: number) {
    this.track('performance', { metric, value });
  }

  // Отслеживание ошибок с диагностикой пустых объектов
  trackError(error: Error, context?: string) {
    // ЭКСТРЕННАЯ ДИАГНОСТИКА для поиска источника "Error: {}"
    if (!error || typeof error !== 'object' || !error.message) {
      console.error('🚨 Analytics trackError получил невалидный объект ошибки:', {
        error,
        type: typeof error,
        constructor: error?.constructor?.name,
        keys: error ? Object.keys(error) : [],
        context
      });
      return;
    }
    
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  // Отслеживание пользовательских действий
  trackUserAction(action: string, data?: Record<string, unknown>) {
    this.track('user_action', { action, ...data });
  }
}

export const analytics = new Analytics();

// Автоматическое отслеживание производительности
export function initPerformanceTracking() {
  if (typeof window === 'undefined') return;

  // Add a delay to ensure proper initialization
  setTimeout(() => {
    if (typeof window === 'undefined') return;

    // Отслеживаем время загрузки страницы
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      try {
        analytics.trackPerformance('page_load', loadTime);
      } catch (error) {
        console.warn('Performance tracking failed:', error);
      }
    });

    // Отслеживаем ошибки
    window.addEventListener('error', (event) => {
      try {
        // Проверяем, что error является валидным объектом
        const errorObj = event.error;
        if (!errorObj || typeof errorObj !== 'object') {
          console.warn('Invalid error object in analytics tracking:', errorObj);
          return;
        }
        analytics.trackError(errorObj, 'window_error');
      } catch (error) {
        console.warn('Error tracking failed:', error);
      }
    });

    // Отслеживаем необработанные промисы
    window.addEventListener('unhandledrejection', (event) => {
      try {
        // Проверяем, что reason является валидным объектом
        const reason = event.reason;
        if (!reason || typeof reason !== 'object') {
          console.warn('Invalid promise rejection reason in analytics tracking:', reason);
          return;
        }
        analytics.trackError(new Error(String(reason)), 'unhandled_promise');
      } catch (error) {
        console.warn('Promise error tracking failed:', error);
      }
    });
  }, 200);
} 