import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Filesystem, Directory } from '@capacitor/filesystem';

export interface NativeCameraResult {
  dataUrl: string; // base64 data URL (image/jpeg)
}

export interface NativeLocationResult {
  lat: number;
  lng: number;
}

/**
 * Mengambil foto selfie menggunakan kamera native (Capacitor) atau
 * browser getUserMedia sebagai fallback untuk web.
 * Mengembalikan data URL base64.
 */
export async function takeSelfiePhoto(): Promise<NativeCameraResult> {
  if (Capacitor.isNativePlatform()) {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 85,
      width: 640,
      allowEditing: false,
      saveToGallery: false,
      correctOrientation: true,
    });

    if (!photo.dataUrl) throw new Error('Gagal mengambil foto dari kamera.');
    return { dataUrl: photo.dataUrl };
  }

  // Fallback untuk Web/Browser: gunakan navigator.mediaDevices
  return new Promise<NativeCameraResult>((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        video.onloadedmetadata = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          stream.getTracks().forEach((t) => t.stop());
          resolve({ dataUrl });
        };
      })
      .catch(() => reject(new Error('Kamera tidak dapat diakses.')));
  });
}

/**
 * Mengambil koordinat GPS menggunakan native Geolocation plugin (Capacitor)
 * atau browser geolocation sebagai fallback.
 */
export async function getCurrentPosition(): Promise<NativeLocationResult> {
  if (Capacitor.isNativePlatform()) {
    // Minta permission terlebih dahulu
    const permResult = await Geolocation.requestPermissions();
    if (permResult.location !== 'granted' && permResult.coarseLocation !== 'granted') {
      throw new Error('Izin lokasi ditolak. Mohon aktifkan di pengaturan aplikasi.');
    }

    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });

    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    };
  }

  // Fallback untuk Web/Browser
  return new Promise<NativeLocationResult>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolokasi tidak didukung oleh browser ini.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => reject(new Error('Izin lokasi ditolak atau gagal didapatkan.')),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

/**
 * Memicu haptic feedback (getaran) menggunakan Capacitor Haptics.
 * Digunakan untuk KDS atau aksi penting di mobile.
 */
export async function triggerHaptic(style: ImpactStyle = ImpactStyle.Light) {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.impact({ style });
    } catch (e) {
      // Ignore if not supported
    }
  } else {
    // Fallback Web API jika didukung
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(style === ImpactStyle.Heavy ? 100 : 50);
    }
  }
}

/**
 * Menyimpan dan mengunduh file menggunakan Capacitor Filesystem.
 * Untuk PDF payslip download di mobile.
 */
export async function downloadFileMobile(fileName: string, base64Data: string) {
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });
      return result.uri;
    } catch (e) {
      throw new Error("Gagal menyimpan file ke perangkat.");
    }
  } else {
    // Fallback Web: buat anchor link
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64Data}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return null;
  }
}
