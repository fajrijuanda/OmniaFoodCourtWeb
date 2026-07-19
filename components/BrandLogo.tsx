"use client";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  alt?: string;
};

export function BrandLogo({ className = "h-10 w-10", imageClassName = "h-full w-full object-contain", fallbackClassName = "", alt = "Omnia" }: BrandLogoProps) {
  return (
    <span className={`inline-grid shrink-0 place-items-center overflow-hidden ${className}`}>
      <img
        src="/omnia-logo.png"
        alt={alt}
        className={imageClassName}
        onError={(e) => {
          // Fallback to OM text if image fails
          const parent = e.currentTarget.parentElement;
          if (parent) {
            e.currentTarget.style.display = "none";
            parent.innerHTML = `<span class="grid h-full w-full place-items-center rounded-full bg-orange-500 text-xs font-black text-white ${fallbackClassName}">OM</span>`;
          }
        }}
      />
    </span>
  );
}
