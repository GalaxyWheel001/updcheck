'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { WHEEL_SECTORS, generateSpinResult, updateSpinStatus, getSpinStatus } from '@/utils/spin';
import { useSound } from '@/hooks/useSound';
import type { SpinResult } from '@/types';
import { getCurrencyRate, getCurrencySymbol } from '@/utils/currencies';
import { trackSpinEvent } from '@/utils/metaPixel';
import { getUserId } from '@/utils/userId';

interface WheelOfFortuneProps {
  currency: string;
  availableSpins: number;
  onSpinComplete: (result: SpinResult) => void;
}

export function WheelOfFortune({ currency, availableSpins, onSpinComplete }: WheelOfFortuneProps) {
  const { t } = useTranslation();
  const { playSpinSound, playWinSound } = useSound();
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(wheelRef.current, { rotate: 0 });
  }, [availableSpins]);

  const baseTransform = 'translateZ(0) rotateX(5deg)';

  const handleSpin = useCallback(async () => {
    if (isSpinning || availableSpins <= 0) return;

    setIsSpinning(true);
    playSpinSound();

    // Получаем курс валюты
    const rate = getCurrencyRate(currency);
    // Генерируем результат в USD, потом конвертируем
    const resultUSD = generateSpinResult('USD', 1);
    const localAmount = Math.round(resultUSD.amount * rate);

    // Добавляем localAmount в результат
    const result = { 
      ...resultUSD, 
      amount: localAmount, 
      currency,
      localAmount,   // добавлено для удобства
    };


    const sectorAngle = 360 / WHEEL_SECTORS.length;
    const finalAngle = (WHEEL_SECTORS.length - result.sectorIndex - 1) * sectorAngle;
    const spins = 3 + Math.random(); // 3-4 оборота

    const totalRotation = (spins * 360) + finalAngle;

    gsap.set(wheelRef.current, { rotate: 0 });
    gsap.to(wheelRef.current, {
      rotate: totalRotation,
      duration: 4,
      ease: 'power2.out',
      onComplete: () => {
        setIsSpinning(false);
        playWinSound();

        updateSpinStatus();

        // Track Meta Pixel event
        trackSpinEvent({
          amount: result.amount,
          currency,
          localAmount: result.localAmount ?? result.amount,
          promocode: result.promocode,
        });

        // Telegram notify
        try {
          const userId = getUserId();
          fetch('/api/telegram/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'spin',
              userId,
              data: { amount: result.amount, currency, promocode: result.promocode },
            }),
          }).catch(() => {});
        } catch {}

        onSpinComplete(result);

        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#FF6B6B', '#DDA0DD']
        });
      }
    });
  }, [isSpinning, availableSpins, currency, playSpinSound, playWinSound, onSpinComplete]);

  const sectorAngle = 360 / WHEEL_SECTORS.length;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Wheel Container */}
      <div className="wheel-container relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg"></div>
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="wheel relative w-80 h-80 md:w-96 md:h-96 rounded-full border-4 border-yellow-400 shadow-2xl"
          style={{
            background: 'conic-gradient(from 0deg, #FF6B6B 0deg 60deg, #4ECDC4 60deg 120deg, #45B7D1 120deg 180deg, #96CEB4 180deg 240deg, #FFEAA7 240deg 300deg, #DDA0DD 300deg 360deg)',
            boxShadow: `
              0 0 30px rgba(255, 215, 0, 0.8),
              0 0 60px rgba(78, 205, 196, 0.6),
              0 0 90px rgba(69, 183, 209, 0.4),
              inset 0 0 30px rgba(0, 0, 0, 0.4),
              inset 0 0 60px rgba(255, 255, 255, 0.1)
            `,
            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))'
          }}
        >
          {/* Sectors */}
          {WHEEL_SECTORS.map((sector, index) => {
            const angle = index * sectorAngle;
            const textAngle = angle + sectorAngle / 2;
            // Конвертация суммы сектора
            const rate = getCurrencyRate(currency);
            const localAmount = Math.round(sector.amount * rate);
            const symbol = getCurrencySymbol(currency);
            return (
              <div
                key={index}
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  transform: `rotate(${textAngle}deg)`,
                  transformOrigin: 'center'
                }}
              >
                <div
                  className="absolute flex items-center justify-center text-white font-extrabold text-base md:text-2xl orbitron px-1 md:px-2 py-0.5 md:py-1 bg-black bg-opacity-30 rounded-lg shadow-lg max-w-[60px] md:max-w-none truncate text-center"
                  style={{
                    transform: `translateY(calc(-110px)) rotate(${-textAngle}deg)`,
                    textShadow: `
                      0 0 10px rgba(255, 255, 255, 0.9),
                      0 0 20px ${sector.color},
                      0 0 30px ${sector.color},
                      2px 2px 8px rgba(0,0,0,0.9)
                    `
                  }}
                >
                  {symbol}{localAmount}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Circle - Clickable (FIXED POSITION, OUTSIDE WHEEL) */}
        <div
          onClick={handleSpin}
          className={`absolute top-1/2 left-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-4 border-yellow-300 z-30 ${
            isSpinning || availableSpins <= 0
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer'
          }`}
          style={{
            transform: 'translate(-50%, -50%)',
            boxShadow: `
              0 0 20px rgba(255, 215, 0, 1),
              0 0 40px rgba(255, 215, 0, 0.8),
              0 0 60px rgba(255, 215, 0, 0.6),
              inset 0 0 20px rgba(255, 255, 255, 0.3)
            `
          }}
        >
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center pulse-glow"
            style={{
              boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.2)'
            }}
          >
            <span className="text-xs md:text-sm font-bold text-yellow-900 text-center orbitron px-1">
              {isSpinning ? (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {t('loading')}
                </motion.div>
              ) : availableSpins <= 0 ? (
                t('alreadySpun')
              ) : (
                t('spinButton')
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Spin Button - Hidden (now using center circle) */}
      <div className="mt-8" style={{ visibility: 'hidden', height: '0' }}>
        {/* Keeping for layout purposes but hidden */}
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 blur-xl float"></div>
      <div className="absolute -bottom-10 -right-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-xl float-delayed"></div>
    </div>
  );
}
