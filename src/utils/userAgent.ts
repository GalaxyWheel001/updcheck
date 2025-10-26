export interface UserAgentInfo {
  device: string;
  os: string;
  browser: string;
  version?: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function parseUserAgent(userAgent: string): UserAgentInfo {
  const ua = userAgent.toLowerCase();
  
  // Определяем устройство
  let device = 'Unknown';
  let isMobile = false;
  let isTablet = false;
  let isDesktop = true;
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    device = 'Mobile';
    isMobile = true;
    isDesktop = false;
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    device = 'Tablet';
    isTablet = true;
    isDesktop = false;
  } else {
    device = 'Desktop';
  }
  
  // Определяем ОС
  let os = 'Unknown';
  if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('mac os') || ua.includes('macintosh')) {
    os = 'macOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS';
  }
  
  // Определяем браузер
  let browser = 'Unknown';
  let version: string | undefined;
  
  if (ua.includes('chrome')) {
    browser = 'Chrome';
    const match = ua.match(/chrome\/(\d+)/);
    if (match) version = match[1];
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
    const match = ua.match(/firefox\/(\d+)/);
    if (match) version = match[1];
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
    const match = ua.match(/version\/(\d+)/);
    if (match) version = match[1];
  } else if (ua.includes('edge')) {
    browser = 'Edge';
    const match = ua.match(/edge\/(\d+)/);
    if (match) version = match[1];
  } else if (ua.includes('opera')) {
    browser = 'Opera';
    const match = ua.match(/opera\/(\d+)/);
    if (match) version = match[1];
  }
  
  return {
    device,
    os,
    browser,
    version,
    isMobile,
    isTablet,
    isDesktop
  };
}