"use client";

import { useState } from "react";
import { Vehicle } from "@/types";

const WHATSAPP_NUMBER = "27000000000"; // Replace with your actual WhatsApp number

export default function InquireSection({ vehicle }: { vehicle: Vehicle }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    `Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} listed for R${vehicle.price.toLocaleString("en-ZA")}. Please provide more details.`
  );
  const [submitted, setSubmitted] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in the *${vehicle.year} ${vehicle.make} ${vehicle.model}* (ID: ${vehicle.id.slice(0, 8)}) listed at *R${vehicle.price.toLocaleString("en-ZA")}*.\n\nName: ${name || "Not provided"}\nPhone: ${phone || "Not provided"}\n\n${message}`
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }, 300);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-base font-bold text-slate-900 mb-1">Interested in this car?</h2>
      <p className="text-xs text-slate-500 mb-4">Fill in your details and we&#39;ll connect via WhatsApp.</p>

      {vehicle.status === "sold" ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
          <p className="text-red-600 font-semibold text-sm">This vehicle has been sold.</p>
          <p className="text-slate-500 text-xs mt-1">Browse our other available listings.</p>
        </div>
      ) : submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <svg className="w-10 h-10 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-700 font-semibold text-sm">Opening WhatsApp...</p>
          <p className="text-slate-500 text-xs mt-1">We&#39;ll get back to you shortly!</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-3 text-xs text-blue-600 underline"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.107 1.523 5.828L.042 23.916a.5.5 0 00.596.61l6.333-1.6A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.028-1.384l-.36-.215-3.732.941.997-3.638-.235-.373A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
            </svg>
            Inquire via WhatsApp
          </button>
        </form>
      )}

      {/* Quick WhatsApp direct */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} - R${vehicle.price.toLocaleString("en-ZA")}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-500 hover:text-green-600 flex items-center justify-center gap-1 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.107 1.523 5.828L.042 23.916a.5.5 0 00.596.61l6.333-1.6A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
          Quick chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
