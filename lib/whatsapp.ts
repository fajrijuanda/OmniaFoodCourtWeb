const phone = "628xxxxxxxxxx";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const defaultWhatsAppMessage =
  "Halo Omnia, saya ingin konsultasi terkait solusi digital untuk bisnis saya.";
