import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { cookies } from 'next/headers';
import DynamicTitle from '@/components/DynamicTitle';
import ServerLanguageProvider from '@/components/ServerLanguageProvider';

// ЭКСТРЕННЫЙ ГЛОБАЛЬНЫЙ ПЕРЕХВАТЧИК ДЛЯ ПОИСКА ИСТОЧНИКА "Error: {}"
if (typeof window !== 'undefined') {
  // Перехватываем все возможные источники ошибок
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Проверяем, содержит ли сообщение об ошибке пустой объект
    if (args.some(arg => arg && typeof arg === 'object' && !arg.message && Object.keys(arg).length === 0)) {
      console.log('🚨 НАЙДЕН ПУСТОЙ ОБЪЕКТ В CONSOLE.ERROR:', args);
      console.trace('Stack trace for empty object error');
    }
    originalConsoleError.apply(console, args);
  };
  
  // Перехватываем все возможные источники ошибок
  window.addEventListener('error', (event) => {
    if (event.error && typeof event.error === 'object' && !event.error.message) {
      console.error('🚨 НАЙДЕН ПУСТОЙ ОБЪЕКТ ОШИБКИ В WINDOW.ERROR:', {
        error: event.error,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error.stack,
        constructor: event.error.constructor?.name,
        keys: Object.keys(event.error)
      });
      console.trace('Stack trace for window error');
    }
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason === 'object' && !event.reason.message) {
      console.error('🚨 НАЙДЕН ПУСТОЙ ОБЪЕКТ В UNHANDLED REJECTION:', {
        reason: event.reason,
        constructor: event.reason.constructor?.name,
        keys: Object.keys(event.reason),
        stack: event.reason.stack
      });
      console.trace('Stack trace for unhandled rejection');
    }
  });
  
  // Перехватываем все возможные источники ошибок в fetch
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args).catch(error => {
      if (error && typeof error === 'object' && !error.message) {
        console.error('🚨 НАЙДЕН ПУСТОЙ ОБЪЕКТ ОШИБКИ В FETCH:', error);
        console.trace('Stack trace for fetch error');
      }
      throw error;
    });
  };
}

export const metadata: Metadata = {
  metadataBase: new URL("https://turbo-play.live"),
  title: "TurboPlay — Casino Wheel of Fortune",
  description: "Try your luck! Spin the wheel of fortune and win prizes every day. No deposit, no risk!",
  keywords: "wheel of fortune, casino, prizes, bonuses, game, win, galaxy",
  authors: [{ name: "TurboPlay" }],
  creator: "TurboPlay",
  publisher: "TurboPlay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  openGraph: {
    title: "TurboPlay — Casino Wheel of Fortune",
    description: "Try your luck! Spin the wheel of fortune and win prizes every day. No deposit, no risk!",
    url: "https://turbo-play.live",
    siteName: "TurboPlay",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://turbo-play.live/wheel-preview.jpg",
        width: 1200,
        height: 630,
        alt: "TurboPlay — Casino Wheel of Fortune",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TurboPlay — Casino Wheel of Fortune",
    description: "Try your luck! Spin the wheel of fortune and win prizes every day. No deposit, no risk!",
    images: ["https://turbo-play.live/wheel-preview.jpg"],
    creator: "@turboplay",
    site: "@turboplay",
  },
  alternates: {
    canonical: "https://turbo-play.live/",
  },
  other: {
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "TurboPlay",
    "application-name": "TurboPlay",
    "mobile-web-app-capable": "yes",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let lang = 'en';
  try {
    const cookieStore = await cookies();
    lang = cookieStore.get('turbo_wheel_language')?.value || 'en';
  } catch {}
  return (
    <html lang={lang} className="antialiased">
      <head>
        <DynamicTitle />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://turbo-play.live/" />
        
        {/* Дополнительные мета-теги для лучшего SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="yandex" content="index, follow" />
        
        {/* Социальные сети */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="ru_RU" />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:locale:alternate" content="fr_FR" />
        <meta property="og:locale:alternate" content="de_DE" />
        
        {/* Дополнительные Twitter теги */}
        <meta name="twitter:site" content="@turboplay" />
        <meta name="twitter:creator" content="@turboplay" />
        <meta name="twitter:image:alt" content="TurboPlay — Casino Wheel of Fortune" />
        
        {/* Базовые meta теги для fallback - будут перезаписаны DynamicTitle */}
        <meta name="description" content="Try your luck! Spin the wheel of fortune and win prizes every day. No deposit, no risk!" />
        <meta property="og:title" content="TurboPlay — Casino Wheel of Fortune" />
        <meta property="og:description" content="Try your luck! Spin the wheel of fortune and win prizes every day. No deposit, no risk!" />
        <meta name="twitter:title" content="TurboPlay — Casino Wheel of Fortune" />
        <meta name="twitter:description" content="Try your luck! Spin the wheel of fortune and win prizes every day. No deposit, no risk!" />
        
        {/* Безопасность */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Предзагрузка критических ресурсов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ipapi.co" />
        <link rel="dns-prefetch" href="https://get.geojs.io" />
        <link rel="dns-prefetch" href="https://api.exchangerate-api.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

      </head>
      <body suppressHydrationWarning className="antialiased">
        {/* Meta Pixel Code */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <>
            <Script
              id="facebook-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img 
                height="1" 
                width="1" 
                style={{display:'none'}}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        {/* End Meta Pixel Code */}
        
        <ServerLanguageProvider>
          <ClientBody>{children}</ClientBody>
        </ServerLanguageProvider>
      </body>
    </html>
  );
}
