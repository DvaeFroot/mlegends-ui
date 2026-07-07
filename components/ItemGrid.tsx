"use client";

import { useState, useMemo } from "react";
import { Item } from "@/lib/types";
import { ItemCard } from "@/components/ItemCard";

const TYPE_COLORS: Record<string, string> = {
  Attack: "#e05a2b",
  Defense: "#4a8fa8",
  Magic: "#9b4fc8",
  Movement: "#27ae60",
  Roaming: "#d4a017",
};

const TIER_LABELS: Record<number, string> = { 1: "I", 2: "II", 3: "III" };

export default function ItemGrid({ items }: { items: Item[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [tierFilter, setTierFilter] = useState<number | "">("");

  const imageBySlug = useMemo(() => {
    const rec: Record<string, string | null> = {};
    items.forEach((i) => { rec[i.slug] = i.image_url; });
    return rec;
  }, [items]);

  const allTypes = useMemo(() => {
    const types = new Set<string>();
    items.forEach((i) => i.type && types.add(i.type));
    return Array.from(types).sort();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter && i.type !== typeFilter) return false;
      if (tierFilter !== "" && i.tier !== tierFilter) return false;
      return true;
    });
  }, [items, search, typeFilter, tierFilter]);

  const byTier = useMemo(() => {
    if (tierFilter !== "") return null;
    const map = new Map<number | null, typeof filtered>();
    for (const item of filtered) {
      const t = item.tier ?? null;
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(item);
    }
    return map;
  }, [filtered, tierFilter]);

  const GRID = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "10px" } as const;

  return (
    <div>
      <style>{`.item-card:hover { border-color: #e8b84b55 !important; transform: translateY(-2px); }`}</style>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ background: "#141824", border: "1px solid #2a3147", borderRadius: "6px", color: "#c8d0e0", padding: "8px 14px", fontSize: "14px", outline: "none" }}
        />
        <div className="filter-chips-wrap">
          <div className="filter-chips">
            <FilterChip label="All Types" active={typeFilter === ""} onClick={() => setTypeFilter("")} />
            {allTypes.map((t) => (
              <FilterChip key={t} label={t} active={typeFilter === t} onClick={() => setTypeFilter(t)} color={TYPE_COLORS[t]} />
            ))}
          </div>
        </div>
        <div className="filter-chips-wrap">
          <div className="filter-chips">
            <FilterChip label="All Tiers" active={tierFilter === ""} onClick={() => setTierFilter("")} />
            {[1, 2, 3].map((t) => (
              <FilterChip key={t} label={`Tier ${TIER_LABELS[t]}`} active={tierFilter === t} onClick={() => setTierFilter(t)} />
            ))}
          </div>
        </div>
        <span className="filter-count">{filtered.length} items</span>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: "#6b7593", padding: "80px 0", fontSize: "15px" }}>No items found</div>
      )}

      {byTier ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {[3, 2, 1, null].map((tier) => {
            const group = byTier.get(tier);
            if (!group || group.length === 0) return null;
            const label = tier !== null ? `Tier ${TIER_LABELS[tier] ?? tier}` : "Other";
            return (
              <div key={String(tier)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ color: "#e8b84b", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
                  <div style={{ flex: 1, height: "1px", background: "#2a3147" }} />
                  <span style={{ color: "#6b7593", fontSize: "12px" }}>{group.length}</span>
                </div>
                <div style={GRID}>
                  {group.map((item) => (
                    <ItemCard key={item.id} item={item} imageBySlug={imageBySlug} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={GRID}>
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} imageBySlug={imageBySlug} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color?: string }) {
  const accentColor = color ?? "#e8b84b";
  return (
    <button onClick={onClick} style={{ background: active ? `${accentColor}22` : "#141824", color: active ? accentColor : "#8b92a8", border: `1px solid ${active ? accentColor + "55" : "#2a3147"}`, borderRadius: "4px", padding: "5px 12px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer", textTransform: "uppercase", transition: "all 0.15s" }}>
      {label}
    </button>
  );
}
