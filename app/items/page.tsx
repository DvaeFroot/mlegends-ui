import { getItems } from "@/lib/api";
import ItemGrid from "@/components/ItemGrid";
import { Item } from "@/lib/types";

export const revalidate = 300;

export default async function ItemsPage() {
  let items: Item[] = [];
  let fetchError: string | null = null;
  try {
    items = await getItems({ limit: 200 });
  } catch (err) {
    fetchError = (err as Error).message;
    console.error("[items page] fetch failed:", fetchError);
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            color: "#e8b84b",
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Items
        </h1>
        <p style={{ color: "#6b7593", fontSize: "13px", marginTop: "4px" }}>
          {items.length} items scraped from Mobile Legends Fandom wiki
        </p>
      </div>
      {fetchError && (
        <div style={{ background: "#e05a2b11", border: "1px solid #e05a2b44", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#e05a2b", fontSize: "13px", fontFamily: "monospace" }}>
          API error: {fetchError}
        </div>
      )}
      <ItemGrid items={items} />
    </div>
  );
}
