"use client";

import { useState } from "react";
import Image from "next/image";
import { Skin } from "@/lib/types";

export default function SkinsGallery({ skins }: { skins: Skin[] }) {
  const [active, setActive] = useState<Skin | null>(null);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" }}>
        {skins.map((skin, i) => (
          <div
            key={i}
            onClick={() => skin.portraitUrl && setActive(skin)}
            style={{ display: "flex", flexDirection: "column", gap: "6px", cursor: skin.portraitUrl ? "pointer" : "default" }}
          >
            <div style={{ aspectRatio: "150/244", position: "relative", borderRadius: "6px", overflow: "hidden", background: "#0c0e15", border: "1px solid #2a3147", transition: "border-color 0.15s" }}
              className="skin-card">
              {skin.portraitUrl ? (
                <Image src={skin.portraitUrl} alt={skin.name} fill style={{ objectFit: "cover" }} sizes="120px" unoptimized />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2a3147", fontSize: "24px" }}>?</div>
              )}
              {skin.tier && (
                <div style={{ position: "absolute", bottom: "4px", left: "4px", background: "#0c0e15cc", color: "#e8b84b", fontSize: "9px", fontWeight: 700, padding: "1px 5px", borderRadius: "3px", border: "1px solid #e8b84b44" }}>
                  {skin.tier}
                </div>
              )}
              {skin.tag && (
                <div style={{ position: "absolute", top: "4px", right: "4px", background: "#9b4fc822", color: "#a78bfa", fontSize: "9px", fontWeight: 700, padding: "1px 5px", borderRadius: "3px", border: "1px solid #a78bfa44" }}>
                  {skin.tag}
                </div>
              )}
            </div>
            <div style={{ color: "#c8d0e0", fontSize: "11px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{skin.name}</div>
            {skin.price && <div style={{ color: "#6b7593", fontSize: "10px" }}>{skin.price}</div>}
          </div>
        ))}
      </div>

      {active && (
        <div
          onClick={() => setActive(null)}
          style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", cursor: "default" }}
          >
            {(active.splashUrl ?? active.portraitUrl) && (
              <Image
                src={active.splashUrl ?? active.portraitUrl!}
                alt={active.name}
                width={active.splashUrl ? 740 : 300}
                height={active.splashUrl ? 416 : 488}
                style={{ borderRadius: "10px", display: "block", boxShadow: "0 16px 64px #000000cc", maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain" }}
                unoptimized
              />
            )}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, #000000cc)", borderRadius: "0 0 10px 10px", padding: "24px 16px 14px" }}>
              <div style={{ color: "#e8b84b", fontWeight: 700, fontSize: "16px" }}>{active.name}</div>
              <div style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap" }}>
                {active.tier && (
                  <span style={{ background: "#e8b84b22", color: "#e8b84b", border: "1px solid #e8b84b44", fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "3px" }}>{active.tier}</span>
                )}
                {active.tag && (
                  <span style={{ background: "#a78bfa22", color: "#a78bfa", border: "1px solid #a78bfa44", fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "3px" }}>{active.tag}</span>
                )}
              </div>
              {active.price && <div style={{ color: "#8b92a8", fontSize: "11px", marginTop: "4px" }}>{active.price}</div>}
            </div>
            <button
              onClick={() => setActive(null)}
              style={{ position: "absolute", top: "8px", right: "8px", background: "#0c0e15cc", border: "1px solid #2a3147", borderRadius: "50%", width: "28px", height: "28px", color: "#8b92a8", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style>{`.skin-card:hover { border-color: #e8b84b55 !important; }`}</style>
    </>
  );
}
