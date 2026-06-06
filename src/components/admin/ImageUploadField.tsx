"use client";

import { useRef, useState } from "react";
import { uploadSectionImage } from "@/lib/actions/storage";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 14,
  color: "#111827",
  background: "#fff",
  boxSizing: "border-box",
};

/**
 * Admin image field: shows a preview, a URL text input, and a file upload.
 * Uploads go through the uploadSectionImage Server Action (Admin SDK → Storage
 * path sections/<sectionKey>/…) and the resulting public URL is stored via
 * onChange. Shared by the section editor and the projects banner.
 */
export default function ImageUploadField({
  label,
  value,
  sectionKey,
  onChange,
}: {
  label: string;
  value: string;
  sectionKey: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadSectionImage(sectionKey, formData);
      if (!result.ok) {
        setError(result.error ?? "Upload failed.");
      } else {
        onChange(result.url!);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed — check the browser console for details.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#374151", marginBottom: 8 }}>
        {label}
      </label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          style={{ width: "100%", maxWidth: 360, aspectRatio: "16/9", objectFit: "cover", borderRadius: 6, marginBottom: 10, display: "block" }}
        />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://…"
        style={{ ...inputStyle, fontSize: 13, marginBottom: 8 }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        style={{ fontSize: 13, width: "100%" }}
      />
      {uploading && <p style={{ fontSize: 12, color: "#6b7280", margin: "6px 0 0" }}>Uploading…</p>}
      {error && <p style={{ fontSize: 12, color: "#dc2626", margin: "6px 0 0" }}>{error}</p>}
    </div>
  );
}
