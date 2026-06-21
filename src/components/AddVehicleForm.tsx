"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MAKES = ["Toyota", "BMW", "Mercedes-Benz", "Volkswagen", "Ford", "Nissan", "Honda", "Hyundai", "Kia", "Audi", "Mazda", "Chevrolet", "Suzuki", "Mitsubishi", "Renault", "Other"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG"];
const TRANSMISSIONS = ["Manual", "Automatic", "Semi-Automatic", "CVT"];
const COLORS = ["White", "Black", "Silver", "Grey", "Blue", "Red", "Green", "Brown", "Orange", "Yellow", "Other"];

export default function AddVehicleForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    price: "",
    mileage: "",
    fuelType: "Petrol",
    transmission: "Manual",
    color: "",
    engine: "",
    description: "",
    featured: false,
  });

  const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.make || !form.model || !form.price || !form.mileage) {
      setError("Please fill in all required fields.");
      return;
    }

    setUploading(true);
    let imageUrls: string[] = [];

    if (previewImages.length > 0) {
      const formData = new FormData();
      previewImages.forEach(({ file }) => formData.append("files", file));

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        setError("Image upload failed. Please try again.");
        setUploading(false);
        return;
      }
      const uploadData = await uploadRes.json();
      imageUrls = uploadData.urls;
    }

    setUploading(false);
    setSubmitting(true);

    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        make: form.make,
        model: form.model,
        year: parseInt(form.year),
        price: parseFloat(form.price),
        mileage: parseInt(form.mileage),
        fuelType: form.fuelType,
        transmission: form.transmission,
        color: form.color || null,
        engine: form.engine || null,
        description: form.description || null,
        featured: form.featured,
        images: imageUrls,
      }),
    });

    setSubmitting(false);

    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError("Failed to save vehicle. Please try again.");
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-3 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const isLoading = uploading || submitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Vehicle Details</h2>
        <p className="text-sm text-slate-500">Fields marked with * are required.</p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Make *</label>
          <select
            value={form.make}
            onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))}
            required
            className={inputClass}
          >
            <option value="">Select Make</option>
            {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Model *</label>
          <input
            type="text"
            value={form.model}
            onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
            required
            placeholder="e.g. Hilux, 3 Series"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Year *</label>
          <input
            type="number"
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            required
            min={1990}
            max={new Date().getFullYear() + 1}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Price (ZAR) *</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
            min={0}
            placeholder="e.g. 250000"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Mileage (km) *</label>
          <input
            type="number"
            value={form.mileage}
            onChange={(e) => setForm((f) => ({ ...f, mileage: e.target.value }))}
            required
            min={0}
            placeholder="e.g. 45000"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Fuel Type</label>
          <select
            value={form.fuelType}
            onChange={(e) => setForm((f) => ({ ...f, fuelType: e.target.value }))}
            className={inputClass}
          >
            {FUEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Transmission</label>
          <select
            value={form.transmission}
            onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))}
            className={inputClass}
          >
            {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Colour</label>
          <select
            value={form.color}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select Colour</option>
            {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Engine</label>
          <input
            type="text"
            value={form.engine}
            onChange={(e) => setForm((f) => ({ ...f, engine: e.target.value }))}
            placeholder="e.g. 2.0L Turbo, 3.0L V6"
            className={inputClass}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={4}
          placeholder="Describe the vehicle condition, features, service history, etc."
          className={inputClass + " resize-none"}
        />
      </div>

      {/* Featured toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
          className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? "bg-blue-600" : "bg-gray-300"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : ""}`} />
        </button>
        <label className="text-sm font-medium text-slate-700 cursor-pointer" onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}>
          Feature this vehicle on homepage
        </label>
      </div>

      {/* Images */}
      <div>
        <label className={labelClass}>Photos</label>
        <div
          className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-400 cursor-pointer transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-slate-500">Click to upload photos</p>
          <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP — First image will be the cover photo</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
            {previewImages.map((img, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                <Image src={img.preview} alt="" fill className="object-cover" sizes="120px" />
                {i === 0 && (
                  <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                    Cover
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="flex-1 border border-gray-200 text-slate-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {uploading ? "Uploading Photos..." : "Saving..."}
            </>
          ) : "Save Vehicle"}
        </button>
      </div>
    </form>
  );
}
