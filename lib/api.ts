import { Champion, Item, ScrapeRun, ChangeRecord } from "./types";

async function apiFetch<T>(path: string): Promise<T> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";
  const API_KEY = process.env.API_KEY ?? "";
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-api": API_KEY },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API ${res.status} for ${path} (key=${API_KEY ? "set" : "MISSING"})`);
  return res.json();
}

export async function getChampions(params?: {
  role?: string;
  specialty?: string;
  limit?: number;
}): Promise<Champion[]> {
  const p = new URLSearchParams();
  if (params?.role) p.set("role", params.role);
  if (params?.specialty) p.set("specialty", params.specialty);
  p.set("limit", String(params?.limit ?? 200));
  return apiFetch<Champion[]>(`/champions?${p}`);
}

export async function getChampion(slug: string): Promise<Champion> {
  return apiFetch<Champion>(`/champions/${slug}`);
}

export async function getItems(params?: {
  type?: string;
  tier?: number;
  limit?: number;
}): Promise<Item[]> {
  const p = new URLSearchParams();
  if (params?.type) p.set("type", params.type);
  if (params?.tier) p.set("tier", String(params.tier));
  p.set("limit", String(params?.limit ?? 200));
  return apiFetch<Item[]>(`/items?${p}`);
}

export async function getItem(slug: string): Promise<Item> {
  return apiFetch<Item>(`/items/${slug}`);
}

export async function getScrapeRuns(params?: {
  resource_type?: string;
  status?: string;
  limit?: number;
}): Promise<ScrapeRun[]> {
  const p = new URLSearchParams();
  if (params?.resource_type) p.set("resource_type", params.resource_type);
  if (params?.status) p.set("status", params.status);
  p.set("limit", String(params?.limit ?? 50));
  return apiFetch<ScrapeRun[]>(`/history?${p}`);
}

export async function getScrapeRun(id: string): Promise<ScrapeRun> {
  return apiFetch<ScrapeRun>(`/history/${id}`);
}

export async function getScrapeRunChanges(id: string): Promise<ChangeRecord[]> {
  return apiFetch<ChangeRecord[]>(`/history/${id}/changes`);
}
