"use client";

import { useState, useMemo, useRef } from "react";
import { RichText, AbilityText } from "@/components/RichText";
import { getStatMeta } from "@/lib/statMeta";
import Image from "next/image";
import Link from "next/link";
import { Champion } from "@/lib/types";

const ROLE_COLORS: Record<string, string> = {
  Fighter: "#e05a2b",
  Mage: "#5b7ee5",
  Assassin: "#9b4fc8",
  Marksman: "#d4a017",
  Tank: "#4a8fa8",
  Support: "#27ae60",
};

const SPECIALTY_COLORS: Record<string, string> = {
  Burst: "#e05a2b", Damage: "#e05a2b", "Magic Damage": "#e05a2b",
  "Mixed Damage": "#e05a2b", Finisher: "#e05a2b",
  "Crowd Control": "#f59e0b", Control: "#f59e0b",
  Chase: "#38bdf8", Charge: "#38bdf8", Initiator: "#38bdf8",
  Poke: "#a78bfa", Push: "#a78bfa",
  Support: "#27ae60", Regen: "#27ae60", Guard: "#27ae60",
};

function SpecialtyTag({ label }: { label: string }) {
  const color = SPECIALTY_COLORS[label] ?? "#8b92a8";
  return (
    <span style={{ background: `${color}1a`, color, border: `1px solid ${color}55`, borderRadius: "3px", padding: "1px 6px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", boxShadow: `0 0 6px ${color}44`, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

const ABILITY_TYPE_COLORS: Record<string, string> = {
  AOE: "#e05a2b",
  Burst: "#e05a2b",
  Damage: "#e05a2b",
  CC: "#f59e0b",
  Slow: "#f59e0b",
  Debuff: "#f59e0b",
  Buff: "#27ae60",
  Heal: "#27ae60",
  Shield: "#27ae60",
  "Reduce DMG": "#27ae60",
  "CC Immune": "#27ae60",
  "Death Immune": "#27ae60",
  Invincible: "#27ae60",
  "Remove CC": "#27ae60",
  Mobility: "#38bdf8",
  Teleport: "#38bdf8",
  "Speed Up": "#38bdf8",
  Conceal: "#a78bfa",
  Morph: "#a78bfa",
  Summon: "#a78bfa",
  Attach: "#a78bfa",
};

function TypeTag({ type }: { type: string }) {
  const color = ABILITY_TYPE_COLORS[type] ?? "#8b92a8";
  return (
    <span style={{
      background: `${color}1a`,
      color,
      border: `1px solid ${color}55`,
      borderRadius: "3px",
      padding: "0px 5px",
      fontSize: "9px",
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      boxShadow: `0 0 6px ${color}44`,
      whiteSpace: "nowrap",
    }}>
      {type}
    </span>
  );
}

const TOOLTIP_W = 300;

function clampToMouse(mx: number, my: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 10;
  const offsetX = 16;
  const offsetY = 12;
  const estimatedH = 350;

  let left = mx + offsetX;
  if (left + TOOLTIP_W + gap > vw) left = mx - TOOLTIP_W - offsetX;
  left = Math.max(gap, Math.min(left, vw - TOOLTIP_W - gap));

  let top = my + offsetY;
  if (top + estimatedH + gap > vh) top = my - estimatedH - offsetY;
  top = Math.max(gap, top);

  return { top, left };
}

function RoleBadge({ role }: { role: string }) {
  const color = ROLE_COLORS[role] ?? "#6b7593";
  return (
    <span style={{ background: `${color}22`, color, border: `1px solid ${color}44`, padding: "1px 6px", borderRadius: "3px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {role}
    </span>
  );
}

export default function ChampionGrid({ champions }: { champions: Champion[] }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const allRoles = useMemo(() => {
    const roles = new Set<string>();
    champions.forEach((c) => c.role?.forEach((r) => roles.add(r)));
    return Array.from(roles).sort();
  }, [champions]);

  const filtered = useMemo(() => {
    return champions.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (roleFilter && !c.role?.includes(roleFilter)) return false;
      return true;
    });
  }, [champions, search, roleFilter]);

  return (
    <div>
      <style>{`.champion-card:hover { border-color: #e8b84b55 !important; transform: translateY(-2px); }`}</style>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search champions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ background: "#141824", border: "1px solid #2a3147", borderRadius: "6px", color: "#c8d0e0", padding: "8px 14px", fontSize: "14px", outline: "none" }}
        />
        <div className="filter-chips-wrap">
          <div className="filter-chips">
            <FilterChip label="All" active={roleFilter === ""} onClick={() => setRoleFilter("")} />
            {allRoles.map((r) => (
              <FilterChip key={r} label={r} active={roleFilter === r} onClick={() => setRoleFilter(r)} color={ROLE_COLORS[r]} />
            ))}
          </div>
        </div>
        <span className="filter-count">{filtered.length} champions</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
        {filtered.map((champion) => (
          <ChampionCard key={champion.id} champion={champion} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: "#6b7593", padding: "80px 0", fontSize: "15px" }}>No champions found</div>
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

function ChampionCard({ champion }: { champion: Champion }) {
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statsEntries = Object.entries(champion.base_stats ?? {}).slice(0, 4);
  const abilities = champion.abilities ?? [];

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
          style={{ position: "fixed", top: tooltipPos.top, left: tooltipPos.left, width: TOOLTIP_W, maxHeight: "70vh", overflowY: "auto", background: "#1a2035", border: "1px solid #e8b84b55", borderRadius: "8px", padding: "14px", zIndex: 9999, boxShadow: "0 8px 32px #00000099", cursor: "default" }}>
          {champion.specialty?.length > 0 && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
              {champion.specialty.map((s) => <SpecialtyTag key={s} label={s} />)}
            </div>
          )}
          {statsEntries.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "10px" }}>
              {statsEntries.map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: getStatMeta(k).color, display: "flex", alignItems: "center", gap: "4px" }}>
                    {getStatMeta(k).iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getStatMeta(k).iconUrl!} alt="" width={12} height={12} style={{ objectFit: "contain", flexShrink: 0 }} />
                    ) : (
                      <span style={{ fontSize: "10px", fontFamily: "monospace" }}>{getStatMeta(k).icon}</span>
                    )}
                    {getStatMeta(k).label}
                  </span>
                  <span style={{ color: "#c8d0e0", fontWeight: 600 }}>{String(v)}</span>
                </div>
              ))}
            </div>
          )}
          {abilities.length > 0 && (
            <>
              <div style={{ borderTop: "1px solid #2a3147", margin: "8px 0 10px" }} />
              <div style={{ color: "#6b7593", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>Abilities</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {abilities.slice(0, 5).map((ability, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    {ability.iconUrl ? (
                      <div style={{ width: "34px", height: "34px", flexShrink: 0, borderRadius: "5px", overflow: "hidden", border: "1px solid #2a3147", background: "#0c0e15", position: "relative" }}>
                        <Image src={ability.iconUrl} alt={ability.name} fill style={{ objectFit: "cover" }} sizes="34px" unoptimized />
                      </div>
                    ) : (
                      <div style={{ width: "34px", height: "34px", flexShrink: 0, borderRadius: "5px", background: "#0c0e15", border: "1px solid #2a3147", display: "flex", alignItems: "center", justifyContent: "center", color: "#2a3147", fontSize: "14px" }}>?</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" }}>
                        <span style={{ color: "#c8d0e0", fontSize: "13px", fontWeight: 700 }}>{ability.name}</span>
                        {(i === 0 || /passive/i.test(ability.name)) && (
                          <span style={{ background: "#6b759322", color: "#8b92a8", border: "1px solid #6b759355", borderRadius: "3px", padding: "0px 5px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Passive</span>
                        )}
                        {ability.type && <TypeTag type={ability.type} />}
                      </div>
                      <div style={{ color: "#8b92a8", fontSize: "12px", lineHeight: "1.5" }}>
                        <AbilityText text={ability.description} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <Link href={`/champions/${champion.slug}`} style={{ textDecoration: "none" }}>
        <div className="champion-card" style={{ background: "#141824", border: "1px solid #2a3147", borderRadius: "8px", overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s, transform 0.15s" }}>
          <div style={{ aspectRatio: "1", background: "#0c0e15", position: "relative", overflow: "hidden" }}>
            {champion.portrait_url ? (
              <Image src={champion.portrait_url} alt={champion.name} fill style={{ objectFit: "cover" }} sizes="160px" unoptimized />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2a3147", fontSize: "32px" }}>?</div>
            )}
          </div>
          <div style={{ padding: "8px" }}>
            <div style={{ color: "#c8d0e0", fontSize: "13px", fontWeight: 600, marginBottom: "5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {champion.name}
            </div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {champion.role?.slice(0, 2).map((r) => <RoleBadge key={r} role={r} />)}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
