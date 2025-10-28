// Meta Pixel Event Tracking Utils

declare global {
  interface Window {
    fbq?: (command: string, eventName: string, params?: Record<string, any>) => void;
  }
}

/**
 * Track Meta Pixel event safely
 */
export function trackMetaPixelEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('track', eventName, params);
      console.log(`[Meta Pixel] Tracked event: ${eventName}`, params);
    } catch (error) {
      console.error('[Meta Pixel] Error tracking event:', error);
    }
  }
}

/**
 * Track wheel spin event
 */
export function trackSpinEvent(result: {
  amount: number;
  currency: string;
  localAmount: number;
  promocode: string;
}) {
  trackMetaPixelEvent('Spin', {
    content_name: 'Wheel of Fortune',
    content_category: 'Casino Game',
    value: result.amount,
    currency: result.currency,
    content_ids: [result.promocode],
    // Custom parameters
    local_amount: result.localAmount,
    prize: result.amount,
  });
}

/**
 * Track casino redirect event
 */
export function trackCasinoRedirect(result: {
  amount: number;
  currency: string;
  promocode: string;
}) {
  trackMetaPixelEvent('InitiateCheckout', {
    content_name: 'Casino Redirect',
    content_category: 'Casino Registration',
    value: result.amount,
    currency: result.currency,
    content_ids: [result.promocode],
    // Custom parameter
    promocode: result.promocode,
  });

  // Alternative: Lead event (if using for lead generation)
  trackMetaPixelEvent('Lead', {
    content_name: 'Casino Registration',
    content_category: 'Registration',
    value: result.amount,
    currency: result.currency,
  });
}

/**
 * Track promocode copy event
 */
export function trackPromocodeCopy(promocode: string) {
  trackMetaPixelEvent('CompleteRegistration', {
    content_name: 'Promocode Copied',
    content_category: 'Promocode Action',
    content_ids: [promocode],
  });
}


