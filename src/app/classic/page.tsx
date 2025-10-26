'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { WheelOfFortune } from '@/components/wheel/WheelOfFortune';
import { SpinTimer } from '@/components/wheel/SpinTimer';
import SpinResult from '@/components/wheel/SpinResult';
import SupportChat from '@/components/wheel/SupportChat';
import { detectUserLocation } from '@/utils/geolocation';
import { useSound } from '@/hooks/useSound';
import { useOptimizedSpin } from '@/hooks/useOptimizedSpin';
import { analytics, initPerformanceTracking } from '@/utils/analytics';
import { preloadCriticalImages } from '@/utils/imageOptimization';
import type { GeolocationData, SpinResult as SpinResultType } from '@/types';
import '../../utils/i18n';
import { getUserId, isNewUser } from '@/utils/userId';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    </div>
  );
}

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

export default function ClassicWheelPage() {
  const { t, i18n } = useTranslation();
  const { toggleSound, isMuted } = useSound();

  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [geoData, setGeoData] = useState<GeolocationData | null>(null);
  const [spinResult, setSpinResult] = useState<SpinResultType | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [userLang, setUserLang] = useState('en');
  const [currentLang, setCurrentLang] = useState('en');

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
      analytics.trackUserAction('page_visit', { isNew });

      // Telegram notifications disabled

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
      analytics.trackError(error as Error, 'initialization');
    } finally {
      setLoading(false);
    }
  }, [i18n, updateSpinStatus, updateAvailableSpins]);

  useEffect(() => {
    setMounted(true);
    initializeApp();
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
    <div className="min-h-screen bg-gray-100">
      <LanguageToggle userLang={userLang} currentLang={currentLang} onToggle={toggleLanguage} />

      <header className="pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 text-gray-900">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto px-4 text-gray-700">
            {t('subtitle')}
          </p>
          
          {/* Ссылка на главную */}
          <div className="mt-6">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              🎰 Главная страница
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center px-4 pb-8">
        {spinStatus.hasSpunToday && (
          <SpinTimer nextSpinTime={spinStatus.nextSpinTime} onTimerEnd={handleTimerEnd} />
        )}
        <WheelOfFortune
          currency={selectedCurrency}
          availableSpins={availableSpins}
          onSpinComplete={handleSpinResult}
        />
        {geoData && (
          <div className="mt-8 text-center text-sm text-gray-600">
            🌍 {geoData.country} • 💰 {geoData.currency}
          </div>
        )}
      </main>

      <div className="fixed top-4 right-4 flex gap-2">
        <button
          onClick={toggleSound}
          className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all"
          title={isMuted ? t('soundOff') : t('soundOn')}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button
          onClick={() => setShowSupport(!showSupport)}
          className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all"
          title={t('support')}
        >
          <MessageCircle size={20} />
        </button>
      </div>

      <AnimatePresence>
        {spinResult && (
          <SpinResult
            result={spinResult}
            onClose={() => setSpinResult(null)}
            currency={selectedCurrency}
          />
        )}
      </AnimatePresence>

      {showSupport && (
        <SupportChat isOpen={showSupport} onClose={() => setShowSupport(false)} />
      )}

    </div>
  );
}



