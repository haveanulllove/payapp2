import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const distDir = path.join(repoRoot, "dist");
const androidWwwDir = path.join(repoRoot, "app", "src", "main", "assets", "www");

if (!existsSync(distDir)) {
  throw new Error("dist/ not found. Build the web app before syncing Android assets.");
}

await rm(androidWwwDir, { recursive: true, force: true });
await mkdir(androidWwwDir, { recursive: true });
await cp(distDir, androidWwwDir, {
  recursive: true,
  filter: (src) => !src.includes("icon_crops"),
});

console.log(`Synced ${distDir} -> ${androidWwwDir}`);
