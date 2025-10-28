"use client";
import { ReactNode, useEffect } from 'react';
import { getUserId, isNewUser } from '@/utils/userId';

import '@/utils/i18n';

export default function ClientBody({ children }: { children: ReactNode }) {
  useEffect(() => {
    // New visitor Telegram notification
    try {
      const firstVisit = isNewUser();
      const uid = getUserId();
      if (firstVisit) {
        fetch('/api/telegram/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'visit',
            userId: uid,
            data: {
              url: window.location.href,
              referrer: document.referrer,
              language: navigator.language,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              dpr: window.devicePixelRatio,
              screen: `${window.screen.width}x${window.screen.height}`,
              platform: navigator.platform,
              deviceMemory: (navigator as any).deviceMemory,
              hardwareConcurrency: navigator.hardwareConcurrency
            }
          }),
        }).catch(() => {});
      } else {
        // Repeat visitor - check if we should notify (e.g., every 24 hours)
        const lastVisitKey = 'turbo_wheel_last_visit';
        const lastVisit = localStorage.getItem(lastVisitKey);
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        
        if (!lastVisit || (now - parseInt(lastVisit)) > dayInMs) {
          localStorage.setItem(lastVisitKey, now.toString());
          fetch('/api/telegram/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'repeat_visit',
              userId: uid,
              data: {
                url: window.location.href,
                referrer: document.referrer,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                dpr: window.devicePixelRatio,
                screen: `${window.screen.width}x${window.screen.height}`,
                platform: navigator.platform,
                deviceMemory: (navigator as any).deviceMemory,
                hardwareConcurrency: navigator.hardwareConcurrency
              }
            }),
          }).catch(() => {});
        }
      }
    } catch {}

    // ЭКСТРЕННЫЙ ДИАГНОСТИЧЕСКИЙ КОД для поиска источника "Error: {}"
    const handleError = (event: ErrorEvent) => {
      console.log('🔥 window error:', event.error);
      
      // СПЕЦИАЛЬНАЯ ПРОВЕРКА для пустых объектов ошибок
      if (event.error && typeof event.error === 'object' && !event.error.message) {
        console.error('🚨 НАЙДЕН ПУСТОЙ ОБЪЕКТ ОШИБКИ:', {
          error: event.error,
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error.stack,
          constructor: event.error.constructor?.name,
          keys: Object.keys(event.error)
        });
        
        // Перехватываем и исправляем пустую ошибку
        event.preventDefault();
        console.error('Пустая ошибка перехвачена и исправлена');
        return;
      }
      
      // Проверяем, что error является валидным объектом
      const errorObj = event.error;
      if (!errorObj || typeof errorObj !== 'object') {
        console.error('Invalid error object received:', errorObj);
        return;
      }
      
      console.log('Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: errorObj,
        stack: errorObj?.stack
      });
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log('🔥 unhandled promise rejection:', event.reason);
      
      // СПЕЦИАЛЬНАЯ ПРОВЕРКА для пустых объектов в promise rejections
      if (event.reason && typeof event.reason === 'object' && !event.reason.message) {
        console.error('🚨 НАЙДЕН ПУСТОЙ ОБЪЕКТ В PROMISE REJECTION:', {
          reason: event.reason,
          constructor: event.reason.constructor?.name,
          keys: Object.keys(event.reason),
          stack: event.reason.stack
        });
        
        // Перехватываем и исправляем пустую ошибку
        event.preventDefault();
        console.error('Пустая promise rejection перехвачена и исправлена');
        return;
      }
      
      // Проверяем, что reason является валидным объектом
      const reason = event.reason;
      if (!reason || typeof reason !== 'object') {
        console.error('Invalid promise rejection reason:', reason);
        return;
      }
      
      console.log('Promise rejection details:', {
        reason: reason,
        promise: event.promise,
        stack: reason?.stack
      });
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', maxWidth: 600, margin: '0 auto', padding: '32px', paddingBottom: '110px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}