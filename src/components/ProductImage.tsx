"use client";

import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function ProductImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
}: ProductImageProps) {
  if (!src) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#111] to-[#0a0a0a] flex items-center justify-center ${className}`}
        aria-hidden="true"
      >
        <span className="font-oswald text-6xl font-bold text-white/10">MA</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.style.visibility = "hidden";
        }}
      />
    </div>
  );
}
