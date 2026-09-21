"use client";

import { business } from "@/data/business";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div className="hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f3460]">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#e94560]/20 to-[#d4a574]/20 flex items-center justify-center">
          <span className="font-oswald text-4xl font-bold text-white/50">MA</span>
        </div>
      </div>
    </div>
  );
}
