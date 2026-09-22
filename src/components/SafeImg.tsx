"use client";

interface SafeImgProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export default function SafeImg({
  src,
  alt,
  className = "",
  fallback = "/logo.svg",
}: SafeImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        if (target.src !== fallback) target.src = fallback;
      }}
    />
  );
}
