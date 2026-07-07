import { getChampions } from "@/lib/api";
import ChampionGrid from "@/components/ChampionGrid";
import { Champion } from "@/lib/types";

export const revalidate = 300;

export default async function ChampionsPage() {
  let champions: Champion[] = [];
  let fetchError: string | null = null;
  try {
    champions = await getChampions({ limit: 200 });
  } catch (err) {
    fetchError = (err as Error).message;
    console.error("[champions page] fetch failed:", fetchError);
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
          Champions
        </h1>
        <p style={{ color: "#6b7593", fontSize: "13px", marginTop: "4px" }}>
          {champions.length} heroes scraped from Mobile Legends Fandom wiki
          {fetchError ? ` | ERROR: ${fetchError}` : ""}</p>
      </div>
      {fetchError && (
        <div style={{ background: "#e05a2b11", border: "1px solid #e05a2b44", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#e05a2b", fontSize: "13px", fontFamily: "monospace" }}>
          API error: {fetchError}
        </div>
      )}
      <ChampionGrid champions={champions} />
    </div>
  );
}
