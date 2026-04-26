import { readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SUPPORTED_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".json",
  ".jsonc",
  ".json5",
  ".md",
  ".mdx",
  ".yml",
  ".yaml",
  ".toml",
]);

const IGNORE_DIRECTORIES = new Set([".git", ".astro", "dist", "node_modules"]);

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (IGNORE_DIRECTORIES.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (SUPPORTED_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(path.relative(ROOT, fullPath));
    }
  }

  return files;
}

const mode = process.argv.includes("--check") ? "--check" : "--write";
const files = await walk(ROOT);

if (files.length === 0) process.exit(0);

const proc = Bun.spawn(["oxfmt", mode, ...files], {
  cwd: ROOT,
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});

process.exit(await proc.exited);
