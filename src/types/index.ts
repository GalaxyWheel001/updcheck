export interface GeolocationData {
  country: string;
  country_code: string;
  currency: string;
  language: string;
  timezone: string;
}

export interface ExchangeRate {
  result: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
}

export interface SpinResult {
  amount: number;
  localAmount: number;
  currency: string;
  promocode: string;
  sectorIndex: number;
  type?: string; // Prize type for analytics
}

export interface WheelSector {
  amount: number;
  color: string;
  promocode: string;
  probability: number;
}

export interface UserSpinStatus {
  lastSpinDate: string;
  hasSpunToday: boolean;
  nextSpinTime: number;
}

export interface SoundManager {
  playSpinSound: () => void;
  playWinSound: () => void;
  toggleSound: () => void;
  isMuted: boolean;
}

export interface ShareData {
  amount: number;
  currency: string;
  promocode: string;
  message: string;
}

export type SupportedLanguage = 'en' | 'ru' | 'es' | 'fr' | 'de' | 'tr' | 'ar' | 'ja' | 'zh' | 'pt' | 'pt-BR' | 'es-MX' | 'it' | 'nl' | 'pl' | 'uk' | 'bg' | 'cs' | 'el' | 'hr' | 'hu' | 'ro' | 'sk' | 'sl' | 'sv' | 'da' | 'fi' | 'no' | 'is' | 'et' | 'lv' | 'lt' | 'mt' | 'ga' | 'cy' | 'ca' | 'eu' | 'gl' | 'sq' | 'mk' | 'sr' | 'bs' | 'me' | 'cn' | 'tw' | 'hk' | 'mo' | 'kr' | 'vn' | 'th' | 'my' | 'id' | 'ph' | 'sg' | 'bn' | 'hi' | 'ur' | 'fa' | 'he' | 'yi' | 'am' | 'ka' | 'hy' | 'az' | 'kk' | 'ky' | 'tg' | 'uz' | 'mn' | 'ne' | 'si' | 'km' | 'lo' | 'bo' | 'dz' | 'ti' | 'so' | 'sw' | 'zu' | 'af' | 'st' | 'tn' | 'xh' | 'yo' | 'ig' | 'ha' | 'wo' | 'ff' | 'bm' | 'dy' | 'rw' | 'ak' | 'lg' | 'luo' | 'teo' | 'kam' | 'ki' | 'mer' | 'kik' | 'luy' | 'mas' | 'nyn' | 'run' | 'te' | 'ta' | 'ml' | 'kn' | 'gu' | 'pa' | 'or' | 'as' | 'mr' | 'sa' | 'dv' | 'ps' | 'ku' | 'ckb' | 'sd';

export type SupportedCurrency = 'USD' | 'EUR' | 'RUB' | 'GBP' | 'JPY' | 'CNY' | 'AZN' | 'TRY' | 'UAH' | 'KZT' | 'UZS' | 'BYN' | 'AMD' | 'GEL' | 'MXN' | 'BRL' | 'INR' | 'KRW' | 'CAD' | 'AUD' | 'PLN' | 'CZK' | 'HUF' | 'RON' | 'BGN' | 'HRK' | 'DKK' | 'NOK' | 'SEK' | 'CHF' | 'SGD' | 'HKD' | 'NZD' | 'ZAR' | 'THB' | 'MYR' | 'IDR' | 'PHP' | 'VND' | 'ILS' | 'SAR' | 'QAR' | 'AED' | 'KWD' | 'BHD' | 'OMR' | 'JOD' | 'LBP' | 'EGP' | 'LYD' | 'TND' | 'DZD' | 'MAD' | 'NGN' | 'GHS' | 'KES' | 'UGX' | 'TZS' | 'ZMW' | 'MWK' | 'BWP' | 'NAD' | 'SZL' | 'LSL' | 'MUR' | 'SCR' | 'KMF' | 'DJF' | 'ETB' | 'SDG' | 'SSP' | 'ERN' | 'SOS' | 'RWF' | 'BIF' | 'CDF' | 'GNF' | 'SLL' | 'LRD' | 'GMD' | 'XOF' | 'XAF' | 'XPF' | 'CVE' | 'STD' | 'AOA' | 'MZN' | 'TWD' | 'PKR' | 'BDT' | 'LKR' | 'NPR' | 'MMK' | 'KHR' | 'LAK' | 'MVR' | 'BND' | 'IRR' | 'IQD' | 'SYP' | 'AFN' | 'FJD' | 'PGK' | 'SBD' | 'VUV' | 'TOP' | 'WST' | 'ARS' | 'CLP' | 'COP' | 'PEN' | 'VES' | 'BOB' | 'PYG' | 'UYU' | 'GYD' | 'SRD' | 'ISK' | 'ALL' | 'MKD' | 'RSD' | 'BAM' | 'XK' | 'MDL' | 'KG' | 'TJ' | 'TM' | 'MOP' | 'BN' | 'KH' | 'LA' | 'MM' | 'BD' | 'LK' | 'NP' | 'BT' | 'MV' | 'PK' | 'AF' | 'IR' | 'IQ' | 'SY' | 'LB' | 'JO' | 'PS' | 'IL' | 'SA' | 'AE' | 'QA' | 'KW' | 'BH' | 'OM' | 'YE' | 'EG' | 'LY' | 'TN' | 'DZ' | 'MA' | 'NG' | 'GH' | 'KE' | 'UG' | 'TZ' | 'ZM' | 'MW' | 'BW' | 'NA' | 'SZ' | 'LS' | 'MU' | 'SC' | 'KM' | 'DJ' | 'ET' | 'SD' | 'SS' | 'ER' | 'SO' | 'RW' | 'BI' | 'CD' | 'CG' | 'GA' | 'GQ' | 'CM' | 'CF' | 'TD' | 'GN' | 'SL' | 'LR' | 'GM' | 'SN' | 'CI' | 'BF' | 'ML' | 'NE' | 'TG' | 'BJ' | 'GW' | 'CV' | 'ST' | 'AO' | 'MZ' | 'ZW' | 'MG' | 'AU' | 'NZ' | 'NC' | 'PF' | 'WF' | 'TO' | 'WS' | 'KI' | 'TV' | 'NR' | 'PW' | 'FM' | 'MH' | 'CK' | 'NU' | 'TK' | 'AS' | 'GU' | 'MP' | 'BR' | 'AR' | 'CL' | 'CO' | 'PE' | 'VE' | 'EC' | 'BO' | 'PY' | 'UY' | 'GY' | 'SR' | 'GF' | 'FK' | 'GS' | 'AQ';
