import { useEffect, useState } from 'react';
import { Network, ConnectionStatus } from '@capacitor/network';
import { App, AppState } from '@capacitor/app';

export const MobileNetwork = {
  async getStatus(): Promise<ConnectionStatus> {
    return await Network.getStatus();
  },

  addListener(callback: (status: ConnectionStatus) => void) {
    const handler = Network.addListener('networkStatusChange', callback);
    return handler;
  }
};

/**
 * Hook untuk memonitor status jaringan secara real-time.
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      try {
        const status = await MobileNetwork.getStatus();
        if (mounted) setIsOnline(status.connected);
      } catch (e) {
        // Fallback untuk web/browser
        if (mounted) setIsOnline(navigator.onLine);
      }
    };

    checkStatus();

    let networkListener: any;
    
    // Listener Capacitor
    MobileNetwork.addListener((status) => {
      if (mounted) setIsOnline(status.connected);
    }).then(handler => {
      networkListener = handler;
    }).catch(e => {
      console.warn("Capacitor network listener not available", e);
    });

    // Fallback listeners (untuk web)
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      mounted = false;
      if (networkListener && networkListener.remove) {
        networkListener.remove();
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}

/**
 * Hook untuk memonitor kapan aplikasi kembali dari background (resume)
 * atau ditutup ke background (pause).
 */
export function useAppLifecycle(onResume?: () => void, onPause?: () => void) {
  useEffect(() => {
    let appListener: any;
    
    App.addListener('appStateChange', (state: AppState) => {
      if (state.isActive) {
        if (onResume) onResume();
      } else {
        if (onPause) onPause();
      }
    }).then(handler => {
      appListener = handler;
    }).catch(e => {
      console.warn("Capacitor app lifecycle listener not available", e);
    });

    // Fallback web (Page Visibility API)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (onResume) onResume();
      } else {
        if (onPause) onPause();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (appListener && appListener.remove) {
        appListener.remove();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onResume, onPause]);
}
