import axios from 'axios';
import type { GeolocationData, ExchangeRate, SupportedLanguage, SupportedCurrency } from '@/types';

const FALLBACK_DATA: GeolocationData = {
  country: 'United States',
  country_code: 'US',
  currency: 'USD',
  language: 'en',
  timezone: 'America/New_York'
};

// Кэш для геолокации
const locationCache = new Map<string, GeolocationData>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа

export async function detectUserLocation(): Promise<GeolocationData> {
  // Проверяем кэш
  const cached = localStorage.getItem('turbo_wheel_location_cache');
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    } catch (e) {
      // Игнорируем ошибки кэша
    }
  }

  try {
    // Try ipapi.co first
    const response = await axios.get('https://ipapi.co/json/', {
      timeout: 3000 // Уменьшаем timeout
    });

    if (response.data && response.data.country_code) {
      const locationData = {
        country: response.data.country_name || FALLBACK_DATA.country,
        country_code: response.data.country_code,
        currency: response.data.currency || getCurrencyByCountry(response.data.country_code),
        language: getLanguageByCountry(response.data.country_code),
        timezone: response.data.timezone || FALLBACK_DATA.timezone
      };

      // Сохраняем в кэш
      localStorage.setItem('turbo_wheel_location_cache', JSON.stringify({
        data: locationData,
        timestamp: Date.now()
      }));

      return locationData;
    }
  } catch (error) {
    console.warn('ipapi.co failed, trying geojs.io');
  }

  try {
    // Fallback to geojs.io
    const response = await axios.get('https://get.geojs.io/v1/ip/geo.json', {
      timeout: 3000
    });

    if (response.data && response.data.country_code) {
      const locationData = {
        country: response.data.country || FALLBACK_DATA.country,
        country_code: response.data.country_code,
        currency: getCurrencyByCountry(response.data.country_code),
        language: getLanguageByCountry(response.data.country_code),
        timezone: response.data.timezone || FALLBACK_DATA.timezone
      };

      // Сохраняем в кэш
      localStorage.setItem('turbo_wheel_location_cache', JSON.stringify({
        data: locationData,
        timestamp: Date.now()
      }));

      return locationData;
    }
  } catch (error) {
    console.warn('geojs.io failed, using fallback');
  }

  // Use browser language as additional fallback
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  const fallbackData = {
    ...FALLBACK_DATA,
    language: ['en', 'ru', 'es', 'fr', 'de', 'tr', 'ar', 'ja', 'zh', 'pt'].includes(browserLang) ? browserLang : 'en'
  };

  // Сохраняем fallback в кэш
  localStorage.setItem('turbo_wheel_location_cache', JSON.stringify({
    data: fallbackData,
    timestamp: Date.now()
  }));

  return fallbackData;
}

export async function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
  if (fromCurrency === toCurrency) return amount;

  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`, {
      timeout: 5000
    });

    const rate = response.data.rates[toCurrency];
    if (rate) {
      return Math.round(amount * rate * 100) / 100;
    }
  } catch (error) {
    console.warn('Currency conversion failed:', error);
  }

  return amount; // Return original amount if conversion fails
}

function getCurrencyByCountry(countryCode: string): SupportedCurrency {
  const currencyMap: Record<string, SupportedCurrency> = {
    // Северная Америка
    'US': 'USD', 'CA': 'CAD', 'MX': 'MXN',
    
    // Европа
    'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'PT': 'EUR', 
    'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'FI': 'EUR', 'IE': 'EUR', 'GR': 'EUR',
    'PL': 'PLN', 'CZ': 'CZK', 'HU': 'HUF', 'RO': 'RON', 'BG': 'BGN', 'HR': 'HRK',
    'SK': 'EUR', 'SI': 'EUR', 'EE': 'EUR', 'LV': 'EUR', 'LT': 'EUR', 'MT': 'EUR',
    'CY': 'EUR', 'LU': 'EUR', 'DK': 'DKK', 'NO': 'NOK', 'SE': 'SEK', 'CH': 'CHF',
    'IS': 'ISK', 'LI': 'CHF', 'MC': 'EUR', 'SM': 'EUR', 'VA': 'EUR', 'AD': 'EUR',
    'AL': 'ALL', 'MK': 'MKD', 'RS': 'RSD', 'ME': 'EUR', 'BA': 'BAM', 'XK': 'EUR',
    'TR': 'TRY', 'UA': 'UAH', 'BY': 'BYN', 'MD': 'MDL', 'GE': 'GEL', 'AM': 'AMD',
    'AZ': 'AZN', 'KZ': 'KZT', 'UZ': 'UZS', 'KG': 'RUB', 'TJ': 'RUB', 'TM': 'RUB',
    'RU': 'RUB',
    
    // Азия
    'JP': 'JPY', 'CN': 'CNY', 'TW': 'TWD', 'HK': 'HKD', 'MO': 'MOP', 'KR': 'KRW',
    'VN': 'VND', 'TH': 'THB', 'MY': 'MYR', 'ID': 'IDR', 'PH': 'PHP', 'SG': 'SGD',
    'BN': 'BND', 'KH': 'KHR', 'LA': 'LAK', 'MM': 'MMK', 'BD': 'BDT', 'LK': 'LKR',
    'NP': 'NPR', 'BT': 'INR', 'MV': 'MVR', 'IN': 'INR', 'PK': 'PKR', 'AF': 'AFN',
    'IR': 'IRR', 'IQ': 'IQD', 'SY': 'SYP', 'LB': 'LBP', 'JO': 'JOD', 'PS': 'ILS',
    'IL': 'ILS', 'SA': 'SAR', 'AE': 'AED', 'QA': 'QAR', 'KW': 'KWD', 'BH': 'BHD',
    'OM': 'OMR', 'YE': 'SAR',
    
    // Африка
    'EG': 'EGP', 'LY': 'LYD', 'TN': 'TND', 'DZ': 'DZD', 'MA': 'MAD', 'NG': 'NGN',
    'GH': 'GHS', 'KE': 'KES', 'UG': 'UGX', 'TZ': 'TZS', 'ZM': 'ZMW', 'MW': 'MWK',
    'BW': 'BWP', 'NA': 'NAD', 'SZ': 'SZL', 'LS': 'LSL', 'MU': 'MUR', 'SC': 'SCR',
    'KM': 'KMF', 'DJ': 'DJF', 'ET': 'ETB', 'SD': 'SDG', 'SS': 'SSP', 'ER': 'ERN',
    'SO': 'SOS', 'RW': 'RWF', 'BI': 'BIF', 'CD': 'CDF', 'CG': 'XAF', 'GA': 'XAF',
    'GQ': 'XAF', 'CM': 'XAF', 'CF': 'XAF', 'TD': 'XAF', 'GN': 'GNF', 'SL': 'SLL',
    'LR': 'LRD', 'GM': 'GMD', 'SN': 'XOF', 'CI': 'XOF', 'BF': 'XOF', 'ML': 'XOF',
    'NE': 'XOF', 'TG': 'XOF', 'BJ': 'XOF', 'GW': 'XOF', 'CV': 'CVE', 'ST': 'STD',
    'AO': 'AOA', 'MZ': 'MZN', 'ZW': 'USD', 'ZA': 'ZAR', 'MG': 'USD',
    
    // Океания
    'AU': 'AUD', 'NZ': 'NZD', 'FJ': 'FJD', 'PG': 'PGK', 'SB': 'SBD', 'VU': 'VUV',
    'NC': 'XPF', 'PF': 'XPF', 'WF': 'XPF', 'TO': 'TOP', 'WS': 'WST', 'KI': 'AUD',
    'TV': 'AUD', 'NR': 'AUD', 'PW': 'USD', 'FM': 'USD', 'MH': 'USD', 'CK': 'NZD',
    'NU': 'NZD', 'TK': 'NZD', 'AS': 'USD', 'GU': 'USD', 'MP': 'USD',
    
    // Южная Америка
    'BR': 'BRL', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP', 'PE': 'PEN', 'VE': 'VES',
    'EC': 'USD', 'BO': 'BOB', 'PY': 'PYG', 'UY': 'UYU', 'GY': 'GYD', 'SR': 'SRD',
    'GF': 'EUR', 'FK': 'GBP', 'GS': 'GBP', 'AQ': 'USD'
  };

  return currencyMap[countryCode] || 'USD';
}

function getLanguageByCountry(countryCode: string): SupportedLanguage {
  const languageMap: Record<string, SupportedLanguage> = {
    // Европа
    'RU': 'ru', 'UA': 'uk', 'BY': 'ru', 'KZ': 'ru', 'UZ': 'ru', 'AM': 'hy', 'GE': 'ka', 'AZ': 'az',
    'MD': 'ro', 'RO': 'ro', 'BG': 'bg', 'HR': 'hr', 'SI': 'sl', 'SK': 'sk', 'CZ': 'cs',
    'PL': 'pl', 'HU': 'hu', 'EE': 'et', 'LV': 'lv', 'LT': 'lt', 'MT': 'mt', 'CY': 'el',
    'GR': 'el', 'IT': 'it', 'ES': 'es', 'PT': 'pt', 'FR': 'fr', 'BE': 'nl', 'NL': 'nl',
    'DE': 'de', 'AT': 'de', 'CH': 'de', 'LI': 'de', 'LU': 'fr', 'MC': 'fr', 'AD': 'ca',
    'GB': 'en', 'IE': 'en', 'IS': 'is', 'NO': 'no', 'SE': 'sv', 'DK': 'da', 'FI': 'fi',
    'AL': 'sq', 'MK': 'mk', 'RS': 'sr', 'ME': 'sr', 'BA': 'bs', 'XK': 'sq', 'TR': 'tr',
    
    // Северная Америка
    'US': 'en', 'CA': 'en', 'MX': 'es',
    
    // Южная Америка
    'BR': 'pt-BR', 'AR': 'es', 'CL': 'es', 'CO': 'es', 'PE': 'es', 'VE': 'es', 'EC': 'es',
    'BO': 'es', 'PY': 'es', 'UY': 'es', 'GY': 'en', 'SR': 'nl', 'GF': 'fr', 'FK': 'en',
    
    // Азия
    'JP': 'ja', 'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'MO': 'zh', 'KR': 'kr', 'VN': 'en',
    'TH': 'th', 'MY': 'en', 'ID': 'id', 'PH': 'en', 'SG': 'en', 'BN': 'en', 'KH': 'km',
    'LA': 'lo', 'MM': 'my', 'BD': 'bn', 'LK': 'si', 'NP': 'ne', 'BT': 'dz', 'MV': 'dv',
    'IN': 'hi', 'PK': 'ur', 'AF': 'ps', 'IR': 'fa', 'IQ': 'ar', 'SY': 'ar', 'LB': 'ar',
    'JO': 'ar', 'PS': 'ar', 'IL': 'he', 'SA': 'ar', 'AE': 'ar', 'QA': 'ar', 'KW': 'ar',
    'BH': 'ar', 'OM': 'ar', 'YE': 'ar',
    
    // Африка
    'EG': 'ar', 'LY': 'ar', 'TN': 'ar', 'DZ': 'ar', 'MA': 'ar', 'NG': 'en', 'GH': 'en',
    'KE': 'sw', 'UG': 'en', 'TZ': 'sw', 'ZM': 'en', 'MW': 'en', 'BW': 'en', 'NA': 'en',
    'SZ': 'en', 'LS': 'en', 'MU': 'en', 'SC': 'en', 'KM': 'ar', 'DJ': 'ar', 'ET': 'am',
    'SD': 'ar', 'SS': 'en', 'ER': 'ti', 'SO': 'so', 'RW': 'rw', 'BI': 'fr', 'CD': 'fr',
    'CG': 'fr', 'GA': 'fr', 'GQ': 'es', 'CM': 'fr', 'CF': 'fr', 'TD': 'ar', 'GN': 'fr',
    'SL': 'en', 'LR': 'en', 'GM': 'en', 'SN': 'fr', 'CI': 'fr', 'BF': 'fr', 'ML': 'fr',
    'NE': 'fr', 'TG': 'fr', 'BJ': 'fr', 'GW': 'pt', 'CV': 'pt', 'ST': 'pt', 'AO': 'pt',
    'MZ': 'pt', 'ZW': 'en', 'ZA': 'af', 'MG': 'fr',
    
    // Океания
    'AU': 'en', 'NZ': 'en', 'FJ': 'en', 'PG': 'en', 'SB': 'en', 'VU': 'en', 'NC': 'fr',
    'PF': 'fr', 'WF': 'fr', 'TO': 'en', 'WS': 'en', 'KI': 'en', 'TV': 'en', 'NR': 'en',
    'PW': 'en', 'FM': 'en', 'MH': 'en', 'CK': 'en', 'NU': 'en', 'TK': 'en', 'AS': 'en',
    'GU': 'en', 'MP': 'en'
  };

  return languageMap[countryCode] || 'en';
}
export async function getLocationByIp(ip: string): Promise<GeolocationData> {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
      timeout: 5000,
    });

    if (response.data && response.data.country_code) {
      return {
        country: response.data.country_name || FALLBACK_DATA.country,
        country_code: response.data.country_code,
        currency: response.data.currency || getCurrencyByCountry(response.data.country_code),
        language: getLanguageByCountry(response.data.country_code),
        timezone: response.data.timezone || FALLBACK_DATA.timezone,
      };
    }
  } catch (error) {
    console.warn('ipapi.co failed for IP lookup, using fallback');
  }

  return FALLBACK_DATA;
}
