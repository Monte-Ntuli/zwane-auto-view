"use client";

import { useState } from "react";
import Image from "next/image";
import { VehicleImage } from "@/types";

export default function ImageGallery({ images }: { images: VehicleImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) {
    return (
      <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
        <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const sorted = [...images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));

  const prev = () => setActiveIndex((i) => (i === 0 ? sorted.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === sorted.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="space-y-2 sm:space-y-3">
        {/* Main image */}
        <div
          className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={sorted[activeIndex].url}
            alt={`Vehicle photo ${activeIndex + 1}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

          {/* Photo count badge */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
            {activeIndex + 1} / {sorted.length}
          </div>

          {/* Tap-to-expand hint on mobile */}
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 sm:hidden">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Tap to expand
          </div>

          {sorted.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-9 sm:h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                aria-label="Previous photo"
              >
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-9 sm:h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                aria-label="Next photo"
              >
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {sorted.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {sorted.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all ${
                  i === activeIndex
                    ? "border-blue-600"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative w-full max-w-4xl max-h-[85vh] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={sorted[activeIndex].url}
              alt="Full size"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {sorted.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Previous"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Next"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnail strip in lightbox */}
          {sorted.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4">
              {sorted.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? "bg-white w-5" : "bg-white/40"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
