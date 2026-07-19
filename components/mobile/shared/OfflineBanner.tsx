'use client';

import React, { useEffect } from 'react';
import { useNetworkStatus } from '@/lib/mobile/network';
import { OfflineQueue } from '@/lib/mobile/offlineQueue';

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (isOnline) {
      OfflineQueue.processQueue(fetch);
    }
  }, [isOnline]);

  if (isOnline) {
    return null; // Tidak perlu tampil jika online
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-xs font-semibold px-4 py-2 z-[9999] flex items-center justify-center animate-slideDown shadow-md">
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
        <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      Koneksi terputus. Bekerja secara offline.
    </div>
  );
}
