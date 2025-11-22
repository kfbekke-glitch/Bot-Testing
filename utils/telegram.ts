
// Helper to safely access Telegram WebApp API
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export const initTelegramApp = () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    try {
      window.Telegram.WebApp.expand();
      // Force the Telegram header to match our app background
      // This fixes the white bar issue on some devices
      if (window.Telegram.WebApp.setHeaderColor) {
        window.Telegram.WebApp.setHeaderColor('#09090b');
      }
      if (window.Telegram.WebApp.setBackgroundColor) {
        window.Telegram.WebApp.setBackgroundColor('#09090b');
      }
      if (window.Telegram.WebApp.enableClosingConfirmation) {
        window.Telegram.WebApp.enableClosingConfirmation();
      }
    } catch (e) {
      console.warn('Telegram init failed', e);
    }
  }
};

export const getTelegramUser = () => {
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  return null;
};

export const triggerHaptic = (type: 'selection' | 'impact' | 'notification', style?: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
  if (!window.Telegram?.WebApp?.HapticFeedback) return;

  const haptic = window.Telegram.WebApp.HapticFeedback;

  try {
    switch (type) {
      case 'selection':
        haptic.selectionChanged();
        break;
      case 'impact':
        haptic.impactOccurred((style as 'light' | 'medium' | 'heavy') || 'light');
        break;
      case 'notification':
        haptic.notificationOccurred((style as 'success' | 'error') || 'success');
        break;
    }
  } catch (e) {
    // Ignore haptic errors on unsupported platforms
  }
};