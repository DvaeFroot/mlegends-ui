import { getScrapeRuns } from "@/lib/api";
import Link from "next/link";
import { ScrapeRun } from "@/lib/types";

export const revalidate = 60;

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  success: { bg: "#27ae6022", color: "#27ae60" },
  partial: { bg: "#d4a01722", color: "#d4a017" },
  failed: { bg: "#e05a2b22", color: "#e05a2b" },
  running: { bg: "#5b7ee522", color: "#5b7ee5" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function duration(start: string, end: string | null) {
  if (!end) return "—";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default async function HistoryPage() {
  let runs: ScrapeRun[] = [];
  try {
    runs = await getScrapeRuns({ limit: 50 });
  } catch {
    // API unreachable
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
          Scrape History
        </h1>
        <p style={{ color: "#6b7593", fontSize: "13px", marginTop: "4px" }}>
          Log of all champion and item scrape runs
        </p>
      </div>

      {runs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#6b7593",
            padding: "80px 0",
            fontSize: "15px",
          }}
        >
          No scrape runs yet
        </div>
      ) : (
        <div
          style={{
            background: "#141824",
            border: "1px solid #2a3147",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #2a3147",
                  background: "#0c0e15",
                }}
              >
                {[
                  "Resource",
                  "Status",
                  "Scraped",
                  "Created",
                  "Updated",
                  "Duration",
                  "Started",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#6b7593",
                    }}
                  >
                    {h}
                  </th>
                ))}
                <th style={{ width: "40px" }} />
              </tr>
            </thead>
            <tbody>
              {runs.map((run, i) => {
                const sc = STATUS_COLORS[run.status] ?? STATUS_COLORS.failed;
                return (
                  <tr
                    key={run.id}
                    style={{
                      borderBottom:
                        i < runs.length - 1 ? "1px solid #1e2436" : "none",
                      transition: "background 0.1s",
                    }}
                    className="history-row"
                  >
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#c8d0e0",
                        fontSize: "13px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {run.resource_type}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.color}44`,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#8b92a8",
                        fontSize: "13px",
                      }}
                    >
                      {run.records_scraped ?? "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#27ae60",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {run.records_created != null ? `+${run.records_created}` : "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#5b7ee5",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {run.records_updated != null ? `~${run.records_updated}` : "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#6b7593",
                        fontSize: "12px",
                      }}
                    >
                      {duration(run.started_at, run.completed_at)}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#6b7593",
                        fontSize: "12px",
                      }}
                    >
                      {formatDate(run.started_at)}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <Link
                        href={`/history/${run.id}`}
                        style={{
                          color: "#e8b84b",
                          fontSize: "12px",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <style>{`.history-row:hover { background: #1e2436 !important; }`}</style>
        </div>
      )}
    </div>
  );
}
