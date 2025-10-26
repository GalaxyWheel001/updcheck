import { useEffect, useState, useCallback } from 'react';
import { Howl } from 'howler';
import type { SoundManager } from '@/types';

const MUTE_KEY = 'turbo_wheel_muted';

// Глобальный пул звуков для предотвращения исчерпания HTML5 Audio pool
const soundPool = {
  spin: null as Howl | null,
  win: null as Howl | null
};

export function useSound(): SoundManager {
  const [isMuted, setIsMuted] = useState(false);
  const [sounds, setSounds] = useState<{
    spin?: Howl;
    win?: Howl;
  }>({});

  useEffect(() => {
    // Load mute preference
    const stored = localStorage.getItem(MUTE_KEY);
    if (stored) {
      setIsMuted(JSON.parse(stored));
    }

    // Инициализируем звуки только если они еще не созданы (пул звуков)
    let spinSound = soundPool.spin;
    let winSound = soundPool.win;

    if (!spinSound) {
      spinSound = new Howl({
        src: ['data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAA='], // Placeholder
        volume: 0.5,
        html5: false, // Отключаем HTML5 для предотвращения исчерпания pool
        preload: true,
        pool: 1 // Ограничиваем количество экземпляров
      });
      soundPool.spin = spinSound;
    }

    if (!winSound) {
      winSound = new Howl({
        src: ['data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAA='], // Placeholder
        volume: 0.7,
        html5: false, // Отключаем HTML5 для предотвращения исчерпания pool
        preload: true,
        pool: 1 // Ограничиваем количество экземпляров
      });
      soundPool.win = winSound;
    }

    setSounds({ spin: spinSound, win: winSound });

    // НЕ выгружаем звуки при размонтировании компонента - используем пул
    return () => {
      // Останавливаем звуки, но не выгружаем их
      if (spinSound) spinSound.stop();
      if (winSound) winSound.stop();
    };
  }, []);

  const playSpinSound = useCallback(() => {
    if (!isMuted && sounds.spin) {
      try {
        // Проверяем, что звук не заблокирован
        if (sounds.spin.state() === 'loaded') {
          // Останавливаем предыдущий звук перед воспроизведением нового
          sounds.spin.stop();
          sounds.spin.play();
        } else {
          console.warn('Spin sound not loaded, skipping playback');
        }
      } catch (error) {
        console.warn('Failed to play spin sound:', error);
      }
    }
  }, [isMuted, sounds.spin]);

  const playWinSound = useCallback(() => {
    if (!isMuted && sounds.win) {
      try {
        // Проверяем, что звук не заблокирован
        if (sounds.win.state() === 'loaded') {
          // Останавливаем предыдущий звук перед воспроизведением нового
          sounds.win.stop();
          sounds.win.play();
        } else {
          console.warn('Win sound not loaded, skipping playback');
        }
      } catch (error) {
        console.warn('Failed to play win sound:', error);
      }
    }
  }, [isMuted, sounds.win]);

  const toggleSound = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem(MUTE_KEY, JSON.stringify(newMuted));
  }, [isMuted]);

  return {
    playSpinSound,
    playWinSound,
    toggleSound,
    isMuted
  };
}
