'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import { formatTimeUntilNextSpin } from '@/utils/spin';

interface SpinTimerProps {
  nextSpinTime: number;
  onTimerEnd: () => void;
}

export function SpinTimer({ nextSpinTime, onTimerEnd }: SpinTimerProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const formatted = formatTimeUntilNextSpin(nextSpinTime);
      setTimeLeft(formatted);

      if (formatted === '00:00:00') {
        onTimerEnd();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [nextSpinTime, onTimerEnd]);

  if (!nextSpinTime || timeLeft === '00:00:00') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-6"
    >
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 border border-gray-600 max-w-sm mx-auto">
        <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
          <Clock size={20} />
          <span className="font-medium">{t('nextSpinIn')}</span>
        </div>

        <motion.div
          className="text-2xl md:text-3xl font-bold orbitron text-cyan-400"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {timeLeft}
        </motion.div>

        <div className="text-sm text-gray-400 mt-2">
          {t('comeBackInHour')}
        </div>
      </div>
    </motion.div>
  );
}
