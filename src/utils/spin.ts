import type { UserSpinStatus, WheelSector, SpinResult } from '@/types';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'turbo_wheel_spin_status';

export const WHEEL_SECTORS: WheelSector[] = [
  { amount: 5, color: '#FF6B6B', promocode: 'TURBO5', probability: 0 },
  { amount: 10, color: '#4ECDC4', promocode: 'TURBO10', probability: 0 },
  { amount: 20, color: '#45B7D1', promocode: 'TURBO20', probability: 0 },
  { amount: 25, color: '#96CEB4', promocode: 'TURBO25', probability: 0 },
  { amount: 40, color: '#FFEAA7', promocode: 'TURBO40', probability: 0 },
  { amount: 50, color: '#DDA0DD', promocode: 'TURBO50', probability: 100 }
];

export function getSpinStatus(): UserSpinStatus {
  if (typeof window === 'undefined') {
    return {
      lastSpinDate: '',
      hasSpunToday: false,
      nextSpinTime: 0
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      lastSpinDate: '',
      hasSpunToday: false,
      nextSpinTime: 0
    };
  }

  try {
    const status: UserSpinStatus = JSON.parse(stored);
    const now = Date.now();
    
    // Проверяем, истек ли час с последнего спина
    const hasSpunToday = status.nextSpinTime > now;
    const nextSpinTime = hasSpunToday ? status.nextSpinTime : 0;

    return {
      ...status,
      hasSpunToday,
      nextSpinTime
    };
  } catch {
    return {
      lastSpinDate: '',
      hasSpunToday: false,
      nextSpinTime: 0
    };
  }
}

export function updateSpinStatus(): void {
  if (typeof window === 'undefined') return;

  const now = new Date();
  const nextSpinTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 час

  const status: UserSpinStatus = {
    lastSpinDate: now.toDateString(),
    hasSpunToday: true,
    nextSpinTime: nextSpinTime.getTime()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
}

export function generateSpinResult(userCurrency: string, exchangeRate: number = 1): SpinResult {
  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < WHEEL_SECTORS.length; i++) {
    cumulative += WHEEL_SECTORS[i].probability;
    if (random <= cumulative) {
      const sector = WHEEL_SECTORS[i];
      return {
        amount: sector.amount,
        localAmount: Math.round(sector.amount * exchangeRate * 100) / 100,
        currency: userCurrency,
        promocode: sector.promocode,
        sectorIndex: i,
        type: `prize_${sector.amount}`
      };
    }
  }

  // Fallback to first sector
  const sector = WHEEL_SECTORS[0];
  return {
    amount: sector.amount,
    localAmount: Math.round(sector.amount * exchangeRate * 100) / 100,
    currency: userCurrency,
    promocode: sector.promocode,
    sectorIndex: 0,
    type: `prize_${sector.amount}`
  };
}

export function formatTimeUntilNextSpin(nextSpinTime: number): string {
  const now = Date.now();
  const timeLeft = nextSpinTime - now;

  if (timeLeft <= 0) return '00:00:00';

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CNY': '¥',
    'RUB': '₽', 'UAH': '₴', 'BYN': 'Br', 'KZT': '₸', 'UZS': 'soʻm',
    'AMD': '֏', 'GEL': '₾', 'AZN': '₼', 'TRY': '₺', 'BRL': 'R$',
    'MXN': '$', 'INR': '₹', 'KRW': '₩', 'CAD': 'C$', 'AUD': 'A$',
    'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft', 'RON': 'lei', 'BGN': 'лв',
    'HRK': 'kn', 'DKK': 'kr', 'NOK': 'kr', 'SEK': 'kr', 'CHF': 'Fr',
    'SGD': 'S$', 'HKD': 'HK$', 'NZD': 'NZ$', 'ZAR': 'R', 'THB': '฿',
    'MYR': 'RM', 'IDR': 'Rp', 'PHP': '₱', 'VND': '₫'
  };

  return symbols[currency] || currency;
}

export function getAvailableSpins(): number {
  if (typeof window === 'undefined') return 0;
  const status = getSpinStatus();
  return status.hasSpunToday ? 0 : 1;
}


