import { Preferences } from '@capacitor/preferences';

// A static 256-bit key (32 bytes) for AES-GCM encryption.
// Prevents plain-text exposure of sensitive data like JWTs in SharedPreferences.
const RAW_KEY = new Uint8Array([
  21, 142, 53, 99, 12, 55, 77, 88,
  12, 33, 44, 55, 66, 77, 88, 99,
  11, 22, 33, 44, 55, 66, 77, 88,
  99, 11, 22, 33, 44, 55, 66, 77
]);

let cryptoKey: CryptoKey | null = null;

async function getCryptoKey() {
  if (cryptoKey) return cryptoKey;
  cryptoKey = await crypto.subtle.importKey(
    "raw",
    RAW_KEY,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
  return cryptoKey;
}

function bufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToBuffer(base64: string) {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

async function encryptData(text: string): Promise<string> {
  try {
    const key = await getCryptoKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );
    
    // Combine IV and Ciphertext for storage
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return bufferToBase64(combined.buffer);
  } catch (e) {
    console.error("Encryption failed, falling back to plaintext", e);
    return text;
  }
}

async function decryptData(encryptedBase64: string): Promise<string> {
  try {
    const key = await getCryptoKey();
    const combined = new Uint8Array(base64ToBuffer(encryptedBase64));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    // If decryption fails (e.g. data is old unencrypted plaintext or invalid),
    // return the raw string as fallback to allow seamless migration.
    return encryptedBase64; 
  }
}

export const SecureToken = {
  async get(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    if (!value) return null;
    return await decryptData(value);
  },

  async set(key: string, value: string): Promise<void> {
    const encrypted = await encryptData(value);
    await Preferences.set({ key, value: encrypted });
  },

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  },

  async clear(): Promise<void> {
    await Preferences.clear();
  }
};
