import { getScrapeRun, getScrapeRunChanges } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  success: { bg: "#27ae6022", color: "#27ae60" },
  partial: { bg: "#d4a01722", color: "#d4a017" },
  failed: { bg: "#e05a2b22", color: "#e05a2b" },
  running: { bg: "#5b7ee522", color: "#5b7ee5" },
};

const CHANGE_COLORS: Record<string, string> = {
  created: "#27ae60",
  updated: "#5b7ee5",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function duration(start: string, end: string | null) {
  if (!end) return "Still running";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} seconds`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default async function ScrapeRunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let run, changes;
  try {
    [run, changes] = await Promise.all([
      getScrapeRun(id),
      getScrapeRunChanges(id),
    ]);
  } catch {
    notFound();
  }

  const sc = STATUS_COLORS[run.status] ?? STATUS_COLORS.failed;

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "20px", fontSize: "13px", color: "#6b7593" }}>
        <Link href="/history" style={{ color: "#8b92a8", textDecoration: "none" }}>
          History
        </Link>
        {" / "}
        <span style={{ color: "#c8d0e0", fontFamily: "monospace", fontSize: "12px" }}>
          {run.id.slice(0, 8)}…
        </span>
      </div>

      {/* Run summary */}
      <div
        style={{
          background: "#141824",
          border: "1px solid #2a3147",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "20px",
        }}
      >
        <StatBlock label="Resource" value={run.resource_type} capitalize />
        <div>
          <div style={{ color: "#6b7593", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
            Status
          </div>
          <span
            style={{
              background: sc.bg,
              color: sc.color,
              border: `1px solid ${sc.color}44`,
              padding: "3px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {run.status}
          </span>
        </div>
        <StatBlock label="Records Scraped" value={run.records_scraped ?? "—"} />
        <StatBlock label="Created" value={run.records_created != null ? `+${run.records_created}` : "—"} color="#27ae60" />
        <StatBlock label="Updated" value={run.records_updated != null ? `~${run.records_updated}` : "—"} color="#5b7ee5" />
        <StatBlock label="Duration" value={duration(run.started_at, run.completed_at)} />
        <StatBlock label="Started" value={formatDate(run.started_at)} />
        {run.completed_at && (
          <StatBlock label="Completed" value={formatDate(run.completed_at)} />
        )}
      </div>

      {run.error_message && (
        <div
          style={{
            background: "#e05a2b11",
            border: "1px solid #e05a2b44",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "24px",
            color: "#e05a2b",
            fontSize: "13px",
            fontFamily: "monospace",
          }}
        >
          {run.error_message}
        </div>
      )}

      {/* Changes table */}
      <div
        style={{
          background: "#141824",
          border: "1px solid #2a3147",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #2a3147",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: "#e8b84b",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Changes ({changes.length})
          </span>
        </div>
        {changes.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7593", fontSize: "13px" }}>
            No changes recorded
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0c0e15" }}>
                {["Slug", "Type", "Change", "Changed Fields"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "9px 14px",
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
              </tr>
            </thead>
            <tbody>
              {changes.map((change, i) => (
                <tr
                  key={change.id}
                  style={{
                    borderTop: "1px solid #1e2436",
                  }}
                  className="change-row"
                >
                  <td style={{ padding: "10px 14px" }}>
                    <Link
                      href={`/${run.resource_type}/${change.resource_slug}`}
                      style={{
                        color: "#c8d0e0",
                        fontSize: "13px",
                        textDecoration: "none",
                        fontFamily: "monospace",
                      }}
                    >
                      {change.resource_slug.replace(/_/g, " ")}
                    </Link>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#8b92a8", fontSize: "12px", textTransform: "capitalize" }}>
                    {change.resource_type}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span
                      style={{
                        color: CHANGE_COLORS[change.change_type] ?? "#6b7593",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {change.change_type}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    {change.changed_fields?.length ? (
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {change.changed_fields.map((f) => (
                          <span
                            key={f}
                            style={{
                              background: "#1e2436",
                              color: "#8b92a8",
                              padding: "1px 6px",
                              borderRadius: "3px",
                              fontSize: "10px",
                              fontFamily: "monospace",
                            }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: "#3d4d6a", fontSize: "12px" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <style>{`.change-row:hover { background: #1e2436 !important; }`}</style>
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  color,
  capitalize,
}: {
  label: string;
  value: string | number;
  color?: string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          color: "#6b7593",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: color ?? "#c8d0e0",
          fontSize: "15px",
          fontWeight: 700,
          textTransform: capitalize ? "capitalize" : undefined,
        }}
      >
        {value}
      </div>
    </div>
  );
}
