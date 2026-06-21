"use client";

import { useState } from "react";
import { Vehicle } from "@/types";
import InquireSection from "./InquireSection";

const WHATSAPP_NUMBER = "27000000000";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function MobileStickyBar({ vehicle }: { vehicle: Vehicle }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const quickWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} — ${formatPrice(vehicle.price)}`
  )}`;

  return (
    <>
      {/* Sticky bar — mobile only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 leading-none mb-0.5">Price</p>
            <p className="text-lg font-extrabold text-blue-600 leading-tight truncate">
              {formatPrice(vehicle.price)}
            </p>
          </div>
          {vehicle.status === "sold" ? (
            <span className="flex-1 text-center bg-red-100 text-red-600 font-bold text-sm py-3 rounded-xl">
              Sold
            </span>
          ) : (
            <>
              <a
                href={quickWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm shrink-0"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.107 1.523 5.828L.042 23.916a.5.5 0 00.596.61l6.333-1.6A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.028-1.384l-.36-.215-3.732.941.997-3.638-.235-.373A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
                </svg>
                WhatsApp
              </a>
              <button
                onClick={() => setSheetOpen(true)}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm shrink-0"
              >
                Inquire
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom sheet for full inquiry form */}
      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSheetOpen(false)}
          />
          {/* Sheet */}
          <div className="relative bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between rounded-t-3xl">
              <h2 className="font-bold text-slate-900">Inquire About This Vehicle</h2>
              <button
                onClick={() => setSheetOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-slate-500"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <InquireSection vehicle={vehicle} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
