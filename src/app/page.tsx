'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { WheelOfFortune } from '@/components/wheel/WheelOfFortune';
import { SpinTimer } from '@/components/wheel/SpinTimer';
import SpinResult from '@/components/wheel/SpinResult';
import SupportChat from '@/components/wheel/SupportChat';
import AviaMastersGame from '@/components/wheel/AviaMastersGame';
import { detectUserLocation } from '@/utils/geolocation';
import { useSound } from '@/hooks/useSound';
import { useOptimizedSpin } from '@/hooks/useOptimizedSpin';
import { analytics, initPerformanceTracking } from '@/utils/analytics';
import { preloadCriticalImages } from '@/utils/imageOptimization';
import { getCurrencyRate, getCurrencySymbol } from '@/utils/currencies';
import type { GeolocationData, SpinResult as SpinResultType } from '@/types';
import '../utils/i18n';
import { getUserId, isNewUser } from '@/utils/userId';

// Loading screen
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-xl orbitron text-cyan-400">Loading...</div>
      </div>
    </div>
  );
}


// Language toggle button
function LanguageToggle({
  userLang,
  currentLang,
  onToggle
}: {
  userLang: string;
  currentLang: string;
  onToggle: () => void;
}) {
  const nextLang = currentLang === 'en' ? userLang : 'en';
  const flagCode = nextLang === 'en' ? 'gb' : nextLang;

  return (
    <button
      onClick={onToggle}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        border: 'none',
        backgroundImage: `url(https://flagcdn.com/w40/${flagCode}.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: 'pointer',
      }}
      className="fixed top-4 left-4 z-20"
      title={`Switch to ${nextLang.toUpperCase()}`}
    />
  );
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { toggleSound, isMuted } = useSound();

  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [geoData, setGeoData] = useState<GeolocationData | null>(null);
  const [spinResult, setSpinResult] = useState<SpinResultType | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Новый стейт для языков
  const [userLang, setUserLang] = useState('en'); // язык пользователя
  const [currentLang, setCurrentLang] = useState('en'); // текущий язык страницы

  const {
    spinStatus,
    availableSpins,
    updateAvailableSpins,
    updateSpinStatus,
    handleSpinComplete
  } = useOptimizedSpin(selectedCurrency);

  const initializeApp = useCallback(async () => {
    try {
      analytics.init();
      initPerformanceTracking();
      preloadCriticalImages();

      const isNew = isNewUser();
      const userId = getUserId();
      
      // Track user action with error handling
      try {
        analytics.trackUserAction('page_visit', { isNew });
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }


      const locationData = await detectUserLocation();
      setGeoData(locationData);

      if (locationData.currency) {
        setSelectedCurrency(locationData.currency);
              localStorage.setItem('turbo_wheel_currency', locationData.currency);
      }

      const detectedLang = locationData.language || navigator.language.split('-')[0] || 'en';
      setUserLang(detectedLang);

      const savedLang = localStorage.getItem('turbo_wheel_language') || detectedLang;
      setCurrentLang(savedLang);
      i18n.changeLanguage(savedLang);

      localStorage.setItem('turbo_wheel_language', savedLang);
      document.cookie = `turbo_wheel_language=${savedLang}; path=/; max-age=2592000`;

      updateSpinStatus();
      updateAvailableSpins();
    } catch (error) {
      console.error('Initialization error:', error);
      try {
        analytics.trackError(error as Error, 'initialization');
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }
    } finally {
      setLoading(false);
    }
  }, [i18n, updateSpinStatus, updateAvailableSpins]);

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    
    // ЭКСТРЕННЫЙ ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ОШИБОК для поиска источника "Error: {}"
    const handleError = (e: ErrorEvent) => {
      console.log('🚨 GLOBAL ERROR HANDLER:', e.error);
      
      // СПЕЦИАЛЬНАЯ ПРОВЕРКА для пустых объектов ошибок
      if (e.error && typeof e.error === 'object' && !e.error.message) {
        console.error('🚨 НАЙДЕН ПУСТОЙ ОБЪЕКТ ОШИБКИ В GLOBAL HANDLER:', {
          error: e.error,
          message: e.message,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
          stack: e.error.stack,
          constructor: e.error.constructor?.name,
          keys: Object.keys(e.error)
        });
        
        // Перехватываем и исправляем пустую ошибку
        e.preventDefault();
        console.error('Пустая ошибка перехвачена в global handler');
        return;
      }
      
      // Проверяем, что error является валидным объектом
      const errorObj = e.error;
      if (!errorObj || typeof errorObj !== 'object') {
        console.error('Invalid error object received in page.tsx:', errorObj);
        return;
      }
      
      console.log('Error details:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: errorObj
      });
    };
    
    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      console.log('unhandledrejection', e.reason);
      
      // Проверяем, что reason является валидным объектом
      const reason = e.reason;
      if (!reason || typeof reason !== 'object') {
        console.error('Invalid promise rejection reason in page.tsx:', reason);
        return;
      }
      
      console.log('Promise rejection details:', {
        reason: reason,
        promise: e.promise
      });
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Add a small delay to ensure proper hydration
    const timer = setTimeout(() => {
      initializeApp();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [initializeApp]);

  const handleSpinResult = (result: SpinResultType) => {
    setSpinResult(result);
    handleSpinComplete(result);
    analytics.trackUserAction('spin_complete', { amount: result.amount, currency: result.currency });
  };

  const handleTimerEnd = () => {
    updateSpinStatus();
    updateAvailableSpins();
    analytics.trackUserAction('timer_end');
  };

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? userLang : 'en';
    setCurrentLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('turbo_wheel_language', newLang);
    document.cookie = `turbo_wheel_language=${newLang}; path=/; max-age=2592000`;
  };

  if (!mounted || loading) return <LoadingScreen />;

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        {/* AviaMasters Background */}
        <AviaMastersGame />
        
        {/* Language toggle */}
        <LanguageToggle userLang={userLang} currentLang={currentLang} onToggle={toggleLanguage} />

      {/* Header */}
      <header className="relative z-20 pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center relative">
          <h1 className="text-4xl md:text-6xl font-bold orbitron text-white mb-2 mx-auto text-center">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto px-4 text-center">
            {t('subtitle')}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 flex flex-col items-center justify-center px-4 pb-8">
        {spinStatus.hasSpunToday && (
          <SpinTimer nextSpinTime={spinStatus.nextSpinTime} onTimerEnd={handleTimerEnd} />
        )}
        <WheelOfFortune
          currency={selectedCurrency}
          availableSpins={availableSpins}
          onSpinComplete={handleSpinResult}
        />
        {geoData && (
          <div className="mt-8 text-center text-gray-300 text-sm">
            🌍 {geoData.country} • 💰 {geoData.currency}
          </div>
        )}
      </main>

      {/* Control Buttons */}
      <div className="fixed top-4 right-4 z-20 flex gap-2">
        <button
          onClick={toggleSound}
          className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all backdrop-blur-sm"
          title={isMuted ? t('soundOff') : t('soundOn')}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button
          onClick={() => setShowSupport(!showSupport)}
          className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all backdrop-blur-sm"
          title={t('support')}
        >
          <MessageCircle size={20} />
        </button>
      </div>

      {/* Spin Result Modal */}
      <AnimatePresence>
        {spinResult && (
          <SpinResult
            result={spinResult}
            onClose={() => setSpinResult(null)}
            currency={selectedCurrency}
          />
        )}
      </AnimatePresence>

      {/* Support Chat */}
      {showSupport && (
        <SupportChat isOpen={showSupport} onClose={() => setShowSupport(false)} />
      )}

      </div>
    </ErrorBoundary>
  );
}
