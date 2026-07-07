import { getItem, getItems } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Item } from "@/lib/types";
import { ItemCard } from "@/components/ItemCard";
import { RichText } from "@/components/RichText";
import { getStatMeta } from "@/lib/statMeta";

export const revalidate = 300;

const TYPE_COLORS: Record<string, string> = {
  Attack: "#e05a2b",
  Defense: "#4a8fa8",
  Magic: "#9b4fc8",
  Movement: "#27ae60",
  Roaming: "#d4a017",
};

const TIER_LABELS: Record<number, string> = { 1: "I", 2: "II", 3: "III" };

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let item: Item;
  try {
    item = await getItem(slug);
  } catch {
    notFound();
  }

  // Fetch component items for recipe display
  let allItems: Item[] = [];
  try {
    allItems = await getItems({ limit: 200 });
  } catch {
    // not critical
  }

  const componentItems = item.components
    ?.map((c) => allItems.find((i) => i.slug === c.slug))
    .filter(Boolean) as Item[];

  const imageBySlug: Record<string, string | null> = {};
  allItems.forEach((i) => { imageBySlug[i.slug] = i.image_url; });

  const typeColor = item.type ? (TYPE_COLORS[item.type] ?? "#6b7593") : "#6b7593";

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "20px", fontSize: "13px", color: "#6b7593" }}>
        <Link href="/items" style={{ color: "#8b92a8", textDecoration: "none" }}>
          Items
        </Link>
        {" / "}
        <span style={{ color: "#c8d0e0" }}>{item.name}</span>
      </div>

      <div className="detail-grid-sm">
        {/* Left: image + meta */}
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
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="200px"
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
                  ⚔
                </div>
              )}
              {item.tier && (
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "#0c0e15cc",
                    color: "#e8b84b",
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    border: "1px solid #e8b84b44",
                  }}
                >
                  Tier {TIER_LABELS[item.tier] ?? item.tier}
                </div>
              )}
            </div>
            <div style={{ padding: "16px" }}>
              <h1
                style={{
                  color: "#c8d0e0",
                  fontSize: "18px",
                  fontWeight: 700,
                  margin: "0 0 10px",
                }}
              >
                {item.name}
              </h1>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                {item.type && (
                  <span
                    style={{
                      background: `${typeColor}22`,
                      color: typeColor,
                      border: `1px solid ${typeColor}44`,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.type}
                  </span>
                )}
                {item.removed && (
                  <span style={{ background: "#e05a2b22", color: "#e05a2b", border: "1px solid #e05a2b55", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em" }}>
                    REMOVED
                  </span>
                )}
              </div>
              {item.cost && (
                <div
                  style={{
                    color: "#e8b84b",
                    fontSize: "15px",
                    fontWeight: 700,
                  }}
                >
                  {item.cost.toLocaleString()} Gold
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {item.stats && Object.keys(item.stats).length > 0 && (
            <Section title="Bonus Stats">
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {Object.entries(item.stats).map(([key, val]) => (
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
                    <span style={{ color: "#27ae60", fontWeight: 700 }}>
                      +{String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right: passive + recipe */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {(item.passive_name || item.passive_description) && (
            <Section title="Passive">
              {item.passive_name && (
                <div
                  style={{
                    color: "#e8b84b",
                    fontWeight: 700,
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  {item.passive_name}
                </div>
              )}
              {item.passive_description && (
                <p
                  style={{
                    color: "#8b92a8",
                    fontSize: "13px",
                    lineHeight: "1.7",
                    margin: 0,
                  }}
                >
                  <RichText text={item.passive_description} />
                </p>
              )}
            </Section>
          )}

          {componentItems && componentItems.length > 0 && (
            <Section title="Recipe">
              <style>{`.item-card:hover { border-color: #e8b84b55 !important; transform: translateY(-2px); }`}</style>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "10px" }}>
                {componentItems.map((compItem) => (
                  <ItemCard key={compItem.id} item={compItem} imageBySlug={imageBySlug} />
                ))}
              </div>
            </Section>
          )}

          {item.description && !item.passive_description && (
            <Section title="Description">
              <p
                style={{
                  color: "#8b92a8",
                  fontSize: "13px",
                  lineHeight: "1.7",
                  margin: 0,
                }}
              >
                {item.description}
              </p>
            </Section>
          )}
        </div>
      </div>
    </div>
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
