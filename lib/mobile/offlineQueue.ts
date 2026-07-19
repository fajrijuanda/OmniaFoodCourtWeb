import { Preferences } from '@capacitor/preferences';

const QUEUE_KEY = 'OMNIA_OFFLINE_QUEUE';

export interface OfflineRequest {
  id: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  timestamp: number;
}

export const OfflineQueue = {
  /**
   * Mendapatkan antrean request yang tersimpan
   */
  async getQueue(): Promise<OfflineRequest[]> {
    try {
      const { value } = await Preferences.get({ key: QUEUE_KEY });
      if (value) {
        return JSON.parse(value) as OfflineRequest[];
      }
    } catch (e) {
      console.error('Failed to get offline queue', e);
    }
    return [];
  },

  /**
   * Menambahkan request baru ke antrean (enqueue)
   */
  async enqueue(request: Omit<OfflineRequest, 'id' | 'timestamp'>): Promise<void> {
    const queue = await this.getQueue();
    const newRequest: OfflineRequest = {
      ...request,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      timestamp: Date.now(),
    };
    
    queue.push(newRequest);
    await Preferences.set({
      key: QUEUE_KEY,
      value: JSON.stringify(queue),
    });
    console.log(`[OfflineQueue] Enqueued request to ${request.url}`);
  },

  /**
   * Menghapus request dari antrean berdasarkan ID
   */
  async dequeue(id: string): Promise<void> {
    const queue = await this.getQueue();
    const newQueue = queue.filter(req => req.id !== id);
    await Preferences.set({
      key: QUEUE_KEY,
      value: JSON.stringify(newQueue),
    });
  },

  /**
   * Memproses semua request dalam antrean. 
   * Dipanggil saat aplikasi kembali online atau saat resume.
   */
  async processQueue(fetchFn: (input: string | URL | Request, init?: RequestInit) => Promise<Response>): Promise<void> {
    const queue = await this.getQueue();
    
    if (queue.length === 0) {
      return;
    }

    console.log(`[OfflineQueue] Processing ${queue.length} queued requests...`);
    
    for (const req of queue) {
      try {
        console.log(`[OfflineQueue] Retrying ${req.method} ${req.url}`);
        
        // Coba kirim request
        const response = await fetchFn(req.url, {
          method: req.method,
          headers: {
            ...req.headers,
            'X-Offline-Retry': 'true'
          },
          body: req.body ? JSON.stringify(req.body) : undefined,
        });

        // Jika berhasil (2xx) atau gagal secara logikal (4xx) tapi BUKAN gagal jaringan, kita hapus dari antrean
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          await this.dequeue(req.id);
          console.log(`[OfflineQueue] Request ${req.id} processed and dequeued. Status: ${response.status}`);
        } else {
          // Status 5xx biasanya server error, kita biarkan di antrean untuk dicoba lagi nanti
          console.warn(`[OfflineQueue] Request ${req.id} returned status ${response.status}. Keeping in queue.`);
        }
      } catch (error) {
        console.error(`[OfflineQueue] Network error while retrying ${req.id}`, error);
        // Tetap di antrean karena masih gagal jaringan
        break; // Berhenti memproses antrean jika jaringan masih bermasalah
      }
    }
  }
};
