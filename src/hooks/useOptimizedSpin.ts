import { useState, useCallback, useMemo } from 'react';
import { getSpinStatus, getAvailableSpins, updateSpinStatus } from '@/utils/spin';
import { getCurrencyRate, getCurrencySymbol } from '@/utils/currencies';
import type { SpinResult } from '@/types';

export function useOptimizedSpin(currency: string) {
  const [spinStatus, setSpinStatus] = useState(() => getSpinStatus());
  const [availableSpins, setAvailableSpins] = useState(() => getAvailableSpins());

  // Мемоизируем вычисления валюты
  const currencyRate = useMemo(() => getCurrencyRate(currency), [currency]);
  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  // Оптимизированная функция обновления спинов
  const updateAvailableSpins = useCallback(() => {
    setAvailableSpins(getAvailableSpins());
  }, []);

  // Оптимизированная функция обновления статуса
  const updateSpinStatus = useCallback(() => {
    setSpinStatus(getSpinStatus());
  }, []);

  // Оптимизированная функция обработки спина
  const handleSpinComplete = useCallback((result: SpinResult) => {
    // Обновляем статус
    updateSpinStatus();
    updateAvailableSpins();

    // Telegram notifications disabled
  }, [updateSpinStatus, updateAvailableSpins]);

  return {
    spinStatus,
    availableSpins,
    currencyRate,
    currencySymbol,
    updateAvailableSpins,
    updateSpinStatus,
    handleSpinComplete
  };
} 