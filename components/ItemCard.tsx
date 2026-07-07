"use client";

import { useState, useRef } from "react";
import { RichText } from "@/components/RichText";
import { getStatMeta } from "@/lib/statMeta";
import Image from "next/image";
import Link from "next/link";
import { Item } from "@/lib/types";

const TYPE_COLORS: Record<string, string> = {
  Attack: "#e05a2b",
  Defense: "#4a8fa8",
  Magic: "#9b4fc8",
  Movement: "#27ae60",
  Roaming: "#d4a017",
  Jungle: "#27ae60",
  Jungling: "#27ae60",
};

const TIER_LABELS: Record<number, string> = { 1: "I", 2: "II", 3: "III" };

const TOOLTIP_W = 280;

function clampToMouse(mx: number, my: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 10;
  const offsetX = 16;
  const offsetY = 12;
  const estimatedH = 300;

  let left = mx + offsetX;
  if (left + TOOLTIP_W + gap > vw) left = mx - TOOLTIP_W - offsetX;
  left = Math.max(gap, Math.min(left, vw - TOOLTIP_W - gap));

  let top = my + offsetY;
  if (top + estimatedH + gap > vh) top = my - estimatedH - offsetY;
  top = Math.max(gap, top);

  return { top, left };
}

export function ItemCard({
  item,
  imageBySlug = {},
}: {
  item: Item;
  imageBySlug?: Record<string, string | null>;
}) {
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeColor = item.type ? (TYPE_COLORS[item.type] ?? "#6b7593") : "#6b7593";
  const statsEntries = Object.entries(item.stats ?? {}).slice(0, 5);

  const scheduleHide = () => {
    hideTimer.current = setTimeout(() => setTooltipPos(null), 120);
  };
  const cancelHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  return (
    <div
      onMouseEnter={(e) => { if (window.innerWidth <= 768) return; cancelHide(); setTooltipPos(clampToMouse(e.clientX, e.clientY)); }}
      onMouseLeave={scheduleHide}
    >
      {tooltipPos && (
        <div
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          style={{ position: "fixed", top: tooltipPos.top, left: tooltipPos.left, width: TOOLTIP_W, maxHeight: "80vh", overflowY: "auto", background: "#1a2035", border: "1px solid #e8b84b55", borderRadius: "8px", padding: "14px", zIndex: 9999, boxShadow: "0 8px 32px #00000099", cursor: "default" }}
        >
          <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
            {item.tier && (
              <span style={{ background: "#e8b84b22", color: "#e8b84b", border: "1px solid #e8b84b44", padding: "2px 8px", borderRadius: "3px", fontSize: "11px", fontWeight: 700 }}>
                Tier {TIER_LABELS[item.tier] ?? item.tier}
              </span>
            )}
            {item.removed && (
              <span style={{ background: "#e05a2b22", color: "#e05a2b", border: "1px solid #e05a2b55", padding: "2px 8px", borderRadius: "3px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em" }}>
                REMOVED
              </span>
            )}
          </div>
          {item.cost && (
            <div style={{ color: "#e8b84b", fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>{item.cost.toLocaleString()} Gold</div>
          )}
          {statsEntries.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px" }}>
              {statsEntries.map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: getStatMeta(k).color, display: "flex", alignItems: "center", gap: "4px" }}>
                    {getStatMeta(k).iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getStatMeta(k).iconUrl!} alt="" width={12} height={12} style={{ objectFit: "contain", flexShrink: 0 }} />
                    ) : (
                      <span style={{ fontSize: "10px", fontFamily: "monospace" }}>{getStatMeta(k).icon}</span>
                    )}
                    {getStatMeta(k).label}
                  </span>
                  <span style={{ color: "#27ae60", fontWeight: 700 }}>+{String(v)}</span>
                </div>
              ))}
            </div>
          )}
          {item.passive_name && (
            <div style={{ color: "#8b92a8", fontSize: "12px", lineHeight: "1.5" }}>
              <span style={{ color: "#e8b84b", fontStyle: "normal", fontWeight: 700 }}>{item.passive_name}: </span>
              <RichText text={item.passive_description ?? ""} />
            </div>
          )}
          {item.components && item.components.length > 0 && (
            <>
              <div style={{ borderTop: "1px solid #2a3147", margin: "10px 0 8px" }} />
              <div style={{ color: "#6b7593", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>Recipe</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {item.components.map((c) => {
                  const img = imageBySlug[c.slug] ?? null;
                  return (
                    <div key={c.slug} style={{ display: "flex", alignItems: "center", gap: "5px", background: "#0c0e15", border: "1px solid #2a3147", borderRadius: "4px", padding: "3px 7px 3px 4px" }}>
                      {img ? (
                        <div style={{ width: "20px", height: "20px", flexShrink: 0, borderRadius: "3px", overflow: "hidden", position: "relative" }}>
                          <Image src={img} alt={c.name} fill style={{ objectFit: "cover" }} sizes="20px" unoptimized />
                        </div>
                      ) : (
                        <div style={{ width: "20px", height: "20px", flexShrink: 0, borderRadius: "3px", background: "#1a2035", border: "1px solid #2a3147" }} />
                      )}
                      <span style={{ color: "#c8d0e0", fontSize: "11px", whiteSpace: "nowrap" }}>{c.name}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      <Link href={`/items/${item.slug}`} style={{ textDecoration: "none" }}>
        <div className="item-card" style={{ background: "#141824", border: "1px solid #2a3147", borderRadius: "8px", overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s, transform 0.15s" }}>
          <div style={{ aspectRatio: "1", background: "#0c0e15", position: "relative", overflow: "hidden" }}>
            {item.image_url ? (
              <Image src={item.image_url} alt={item.name} fill style={{ objectFit: "cover" }} sizes="120px" unoptimized />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2a3147", fontSize: "28px" }}>⚔</div>
            )}
            {item.tier && (
              <div style={{ position: "absolute", top: "4px", right: "4px", background: "#0c0e15cc", color: "#e8b84b", fontSize: "10px", fontWeight: 700, padding: "1px 5px", borderRadius: "3px", border: "1px solid #e8b84b44" }}>
                {TIER_LABELS[item.tier] ?? item.tier}
              </div>
            )}
            {item.removed && (
              <div style={{ position: "absolute", top: "4px", left: "4px", background: "#e05a2bcc", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "1px 5px", borderRadius: "3px", letterSpacing: "0.04em" }}>
                REMOVED
              </div>
            )}
          </div>
          <div style={{ padding: "7px 8px 8px" }}>
            <div style={{ color: "#c8d0e0", fontSize: "11px", fontWeight: 600, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {item.type && <span style={{ color: typeColor, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{item.type}</span>}
              {item.cost && <span style={{ color: "#e8b84b", fontSize: "10px", fontWeight: 600 }}>{item.cost}g</span>}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
