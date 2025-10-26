'use client';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function DynamicTitle() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Обновляем title страницы при изменении языка
    document.title = t('pageTitle');
    
    // Обновляем meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('pageDescription'));
    }
    
    // Обновляем Open Graph meta теги
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', t('pageTitle'));
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', t('pageDescription'));
    }
    
    // Обновляем Twitter meta теги
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', t('pageTitle'));
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', t('pageDescription'));
    }
  }, [t, i18n.language]);

  return null;
}
