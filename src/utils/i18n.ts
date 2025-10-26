import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '@/locales/en/common.json';
import ruCommon from '@/locales/ru/common.json';
import esCommon from '@/locales/es/common.json';
import frCommon from '@/locales/fr/common.json';
import deCommon from '@/locales/de/common.json';
import itCommon from '@/locales/it/common.json';
import ptCommon from '@/locales/pt/common.json';
import trCommon from '@/locales/tr/common.json';
import plCommon from '@/locales/pl/common.json';
import ukCommon from '@/locales/uk/common.json';
import zhCommon from '@/locales/zh/common.json';
import jaCommon from '@/locales/ja/common.json';
import arCommon from '@/locales/ar/common.json';
import hiCommon from '@/locales/hi/common.json';
import faCommon from '@/locales/fa/common.json';
import nlCommon from '@/locales/nl/common.json';
import svCommon from '@/locales/sv/common.json';
import ptBRCommon from '@/locales/pt-BR/common.json';
import esMXCommon from '@/locales/es-MX/common.json';
import azCommon from '@/locales/az/common.json';
import bgCommon from '@/locales/bg/common.json';
import csCommon from '@/locales/cs/common.json';
import elCommon from '@/locales/el/common.json';
import hrCommon from '@/locales/hr/common.json';
import huCommon from '@/locales/hu/common.json';
import idCommon from '@/locales/id/common.json';
import koCommon from '@/locales/ko/common.json';
import msCommon from '@/locales/ms/common.json';
import roCommon from '@/locales/ro/common.json';
import srCommon from '@/locales/sr/common.json';
import thCommon from '@/locales/th/common.json';
import viCommon from '@/locales/vi/common.json';
import filCommon from '@/locales/fil/common.json';

const resources = {
  en: { common: enCommon },
  ru: { common: ruCommon },
  es: { common: esCommon },
  fr: { common: frCommon },
  de: { common: deCommon },
  it: { common: itCommon },
  pt: { common: ptCommon },
  tr: { common: trCommon },
  pl: { common: plCommon },
  uk: { common: ukCommon },
  zh: { common: zhCommon },
  ja: { common: jaCommon },
  ar: { common: arCommon },
  hi: { common: hiCommon },
  fa: { common: faCommon },
  nl: { common: nlCommon },
  sv: { common: svCommon },
  'pt-BR': { common: ptBRCommon },
  'es-MX': { common: esMXCommon },
  az: { common: azCommon },
  bg: { common: bgCommon },
  cs: { common: csCommon },
  el: { common: elCommon },
  hr: { common: hrCommon },
  hu: { common: huCommon },
  id: { common: idCommon },
  ko: { common: koCommon },
  ms: { common: msCommon },
  ro: { common: roCommon },
  sr: { common: srCommon },
  th: { common: thCommon },
  vi: { common: viCommon },
  fil: { common: filCommon },
};

function getInitialLanguage() {
  if (typeof window !== 'undefined') {
    // На клиенте читаем из localStorage или куки
    return localStorage.getItem('turbo_wheel_language') ||
      (document.cookie.match(/turbo_wheel_language=([^;]+)/)?.[1]) || undefined;
  } else if (typeof global !== 'undefined' && (global as { initialLanguage?: string }).initialLanguage) {
    // На сервере можно пробросить initialLanguage через глобал (если нужно)
    return (global as { initialLanguage?: string }).initialLanguage;
  }
  return 'en'; // Возвращаем английский как fallback для сервера
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: getInitialLanguage(),
    defaultNS: 'common',
    ns: ['common'],

    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
      lookupCookie: 'turbo_wheel_language',
      lookupLocalStorage: 'turbo_wheel_language'
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false
    }
  });

export default i18n;
