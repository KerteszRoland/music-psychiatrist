import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { AnalysisResult, RecentAnalysisSummary, SongInfo, StoredAnalysis } from "@/lib/types";

const RECENT_LIMIT = 20;
const DATA_DIR = path.join(process.cwd(), ".data");

function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function songSlug(artist: string, title: string): string {
  return `${artist}--${title}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function readJson<T>(key: string): Promise<T | null> {
  if (hasBlobStorage()) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: key, limit: 10 });
    const blob = blobs.find((entry) => entry.pathname === key);
    if (!blob) return null;
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  }

  const filePath = path.join(DATA_DIR, key);
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  const body = JSON.stringify(value, null, 2);

  if (hasBlobStorage()) {
    const { put } = await import("@vercel/blob");
    await put(key, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  const filePath = path.join(DATA_DIR, key);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, body, "utf8");
}

function toSummary(stored: StoredAnalysis): RecentAnalysisSummary {
  return {
    id: stored.id,
    artist: stored.song.artist,
    title: stored.song.title,
    createdAt: stored.createdAt,
  };
}

async function readRecentIndex(): Promise<RecentAnalysisSummary[]> {
  return (await readJson<RecentAnalysisSummary[]>("recent.json")) ?? [];
}

async function writeRecentIndex(entries: RecentAnalysisSummary[]): Promise<void> {
  await writeJson("recent.json", entries.slice(0, RECENT_LIMIT));
}

export async function findStoredAnalysisBySong(
  song: SongInfo,
): Promise<StoredAnalysis | null> {
  const slug = songSlug(song.artist, song.title);
  const mapping = await readJson<{ id: string }>(`songs/${slug}.json`);
  if (!mapping?.id) return null;
  return getStoredAnalysis(mapping.id);
}

export async function getStoredAnalysis(id: string): Promise<StoredAnalysis | null> {
  return readJson<StoredAnalysis>(`analyses/${id}.json`);
}

export async function getRecentAnalyses(): Promise<RecentAnalysisSummary[]> {
  return readRecentIndex();
}

export async function saveAnalysis(result: AnalysisResult): Promise<StoredAnalysis> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const stored: StoredAnalysis = { ...result, id, createdAt };
  const slug = songSlug(result.song.artist, result.song.title);

  await writeJson(`analyses/${id}.json`, stored);
  await writeJson(`songs/${slug}.json`, { id });

  const recent = await readRecentIndex();
  const summary = toSummary(stored);
  const withoutDuplicate = recent.filter((entry) => entry.id !== id);
  await writeRecentIndex([summary, ...withoutDuplicate]);

  return stored;
}
