import { getChampion } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SkinsGallery from "@/components/SkinsGallery";
import { RichText, AbilityText } from "@/components/RichText";
import { getStatMeta } from "@/lib/statMeta";

export const revalidate = 300;

const ABILITY_TYPE_COLORS: Record<string, string> = {
  AOE: "#e05a2b", Burst: "#e05a2b", Damage: "#e05a2b",
  CC: "#f59e0b", Slow: "#f59e0b", Debuff: "#f59e0b",
  Buff: "#27ae60", Heal: "#27ae60", Shield: "#27ae60",
  "Reduce DMG": "#27ae60", "CC Immune": "#27ae60", "Death Immune": "#27ae60",
  Invincible: "#27ae60", "Remove CC": "#27ae60",
  Mobility: "#38bdf8", Teleport: "#38bdf8", "Speed Up": "#38bdf8",
  Conceal: "#a78bfa", Morph: "#a78bfa", Summon: "#a78bfa", Attach: "#a78bfa",
};

function TypeTag({ type }: { type: string }) {
  const color = ABILITY_TYPE_COLORS[type] ?? "#8b92a8";
  return (
    <span style={{ background: `${color}1a`, color, border: `1px solid ${color}55`, borderRadius: "3px", padding: "1px 7px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", boxShadow: `0 0 8px ${color}44`, whiteSpace: "nowrap" }}>
      {type}
    </span>
  );
}

const ROLE_COLORS: Record<string, string> = {
  Fighter: "#e05a2b",
  Mage: "#5b7ee5",
  Assassin: "#9b4fc8",
  Marksman: "#d4a017",
  Tank: "#4a8fa8",
  Support: "#27ae60",
};

export default async function ChampionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let champion;
  try {
    champion = await getChampion(slug);
  } catch {
    notFound();
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "20px", fontSize: "13px", color: "#6b7593" }}>
        <Link href="/champions" style={{ color: "#8b92a8", textDecoration: "none" }}>
          Champions
        </Link>
        {" / "}
        <span style={{ color: "#c8d0e0" }}>{champion.name}</span>
      </div>

      <div className="detail-grid">
        {/* Left: portrait + meta */}
        <div>
          <div
            style={{
              background: "#141824",
              border: "1px solid #2a3147",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                aspectRatio: "1",
                background: "#0c0e15",
                position: "relative",
              }}
            >
              {champion.portrait_url ? (
                <Image
                  src={champion.portrait_url}
                  alt={champion.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="240px"
                  unoptimized
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#2a3147",
                    fontSize: "64px",
                  }}
                >
                  ?
                </div>
              )}
            </div>
            <div style={{ padding: "16px" }}>
              <h1
                style={{
                  color: "#e8b84b",
                  fontSize: "20px",
                  fontWeight: 700,
                  margin: "0 0 8px",
                }}
              >
                {champion.name}
              </h1>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                {champion.role?.map((r) => (
                  <RoleBadge key={r} role={r} />
                ))}
              </div>
              {champion.specialty?.length > 0 && (
                <div style={{ color: "#6b7593", fontSize: "12px" }}>
                  {champion.specialty.join(" / ")}
                </div>
              )}
              {champion.release_date && (
                <div style={{ color: "#6b7593", fontSize: "11px", marginTop: "8px" }}>
                  Released: {champion.release_date}
                </div>
              )}
            </div>
          </div>

          {/* Base stats */}
          {champion.base_stats && Object.keys(champion.base_stats).length > 0 && (
            <Section title="Base Stats">
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {Object.entries(champion.base_stats).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      padding: "3px 0",
                      borderBottom: "1px solid #1e2436",
                    }}
                  >
                    <span style={{ color: getStatMeta(key).color, display: "flex", alignItems: "center", gap: "5px" }}>
                      {getStatMeta(key).iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getStatMeta(key).iconUrl!} alt="" width={14} height={14} style={{ objectFit: "contain", flexShrink: 0 }} />
                      ) : (
                        <span style={{ fontSize: "11px", fontFamily: "monospace" }}>{getStatMeta(key).icon}</span>
                      )}
                      {getStatMeta(key).label}
                    </span>
                    <span style={{ color: "#c8d0e0", fontWeight: 600 }}>
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right: spotlight + lore + abilities */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {champion.spotlight_video_id && (
            <Section title="Hero Spotlight">
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "6px", overflow: "hidden" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${champion.spotlight_video_id}`}
                  title={`${champion.name} Hero Spotlight`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>
            </Section>
          )}

          {champion.lore && (
            <Section title="Lore">
              <p
                style={{
                  color: "#8b92a8",
                  fontSize: "13px",
                  lineHeight: "1.7",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {champion.lore}
              </p>
            </Section>
          )}

          {champion.abilities && champion.abilities.length > 0 && (
            <Section title="Abilities">
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {champion.abilities.map((ability, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", gap: "12px" }}
                  >
                    {ability.iconUrl && (
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          flexShrink: 0,
                          borderRadius: "6px",
                          overflow: "hidden",
                          border: "1px solid #2a3147",
                          background: "#0c0e15",
                          position: "relative",
                        }}
                      >
                        <Image
                          src={ability.iconUrl}
                          alt={ability.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="48px"
                          unoptimized
                        />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                        <span style={{ color: "#c8d0e0", fontWeight: 700, fontSize: "14px" }}>
                          {ability.name}
                        </span>
                        {(i === 0 || /passive/i.test(ability.name)) && (
                          <span style={{ background: "#6b759322", color: "#8b92a8", border: "1px solid #6b759355", borderRadius: "3px", padding: "1px 7px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Passive</span>
                        )}
                        {ability.type && <TypeTag type={ability.type} />}
                      </div>
                      <p style={{ color: "#8b92a8", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
                        <AbilityText text={ability.description} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {champion.skins && champion.skins.length > 0 && (
            <Section title={`Skins (${champion.skins.length})`}>
              <SkinsGallery skins={champion.skins} />
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const color = ROLE_COLORS[role] ?? "#6b7593";
  return (
    <span
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {role}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#141824",
        border: "1px solid #2a3147",
        borderRadius: "10px",
        padding: "16px",
      }}
    >
      <h2
        style={{
          color: "#e8b84b",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          margin: "0 0 12px",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
