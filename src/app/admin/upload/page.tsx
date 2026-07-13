"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "Drama",
    category: "new",
    access: "free",
    priceRwf: "",
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<"idle" | "uploading" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  /** Asks our API for a presigned URL, then PUTs the file straight to R2/S3 - the
   *  file's bytes never pass through our own Next.js server. */
  async function uploadFile(file: File, kind: "video" | "poster") {
    const presignRes = await fetch(
      `/api/admin/upload-url?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&kind=${kind}`
    );
    if (!presignRes.ok) throw new Error("Could not get an upload URL.");
    const { uploadUrl, publicUrl } = await presignRes.json();

    const putRes = await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
    if (!putRes.ok) throw new Error("Upload to storage failed.");
    return publicUrl as string;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      let videoUrl: string | undefined;
      let posterUrl: string | undefined;

      if (videoFile) {
        setProgress("uploading");
        videoUrl = await uploadFile(videoFile, "video");
      }
      if (posterFile) {
        posterUrl = await uploadFile(posterFile, "poster");
      }

      setProgress("saving");
      const res = await fetch("/api/admin/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          priceRwf: form.priceRwf ? Number(form.priceRwf) : undefined,
          isVip: form.access === "subscription",
          isPpv: form.access === "ppv",
          videoUrl,
          posterUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not publish title.");
      }

      setProgress("done");
      setTimeout(() => router.push("/admin"), 1000);
    } catch (err: any) {
      setProgress("error");
      setError(err.message);
    }
  }

  return (
    <div className="px-4 md:px-10 py-8 max-w-xl">
      <h1 className="font-display text-2xl mb-6">Ohereza Firime Nshya</h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <Field label="Title">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
        </Field>
        <Field label="Description">
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Genre">
            <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="input">
              {["Drama", "Action", "Comedy", "Documentary", "Romance", "Musical"].map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
              {["trending", "new", "original", "action", "drama", "documentary", "comedy"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Access Type">
            <select value={form.access} onChange={(e) => setForm({ ...form, access: e.target.value })} className="input">
              <option value="free">Free</option>
              <option value="subscription">VIP / Subscription</option>
              <option value="ppv">Pay-Per-View</option>
            </select>
          </Field>
          {form.access === "ppv" && (
            <Field label="Price (RWF)">
              <input type="number" value={form.priceRwf} onChange={(e) => setForm({ ...form, priceRwf: e.target.value })} className="input" />
            </Field>
          )}
        </div>

        <Field label="Video file (.mp4)">
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="text-sm" />
        </Field>
        <Field label="Poster image">
          <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files?.[0] || null)} className="text-sm" />
        </Field>

        {error && <p className="text-terracotta text-sm">{error}</p>}

        <button
          type="submit"
          disabled={progress === "uploading" || progress === "saving"}
          className="flex items-center justify-center gap-2 bg-gold text-bg font-bold rounded-md py-2.5 mt-2 disabled:opacity-50"
        >
          <UploadCloud size={16} />
          {progress === "uploading" ? "Uploading video..." : progress === "saving" ? "Publishing..." : progress === "done" ? "Published!" : "Shyiraho Firime"}
        </button>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          background: #1b1610;
          border: 1px solid #3a2f22;
          border-radius: 6px;
          padding: 9px 10px;
          color: #f5efe6;
          font-size: 13px;
          outline: none;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-muted mb-1">{label}</span>
      {children}
    </label>
  );
}
