import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "src");
const OUTPUT_FILE = path.join(ROOT, "src", "locales", "pt-BR", "translation.json");
const SOURCE_EXTENSIONS = new Set([".astro", ".ts", ".tsx", ".js", ".jsx"]);

type NestedTranslations = Record<string, NestedTranslations | string>;

const descriptorPattern =
  /t\(\s*\{\s*key:\s*(['"`])((?:\\.|(?!\1)[\s\S])*?)\1\s*,\s*message:\s*(['"`])((?:\\.|(?!\3)[\s\S])*?)\3[\s\S]*?\}\s*(?:,\s*\{[\s\S]*?\})?\)/g;

async function walk(dir: string): Promise<string[]> {
  const files: string[] = [];
  const dirEntries = await readdir(dir, { withFileTypes: true });

  for (const entry of dirEntries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function setNestedValue(target: NestedTranslations, key: string, value: string) {
  const parts = key.split(".");
  let current: NestedTranslations = target;

  for (const part of parts.slice(0, -1)) {
    const existing = current[part];
    if (typeof existing === "string") {
      throw new Error(`Key conflict: "${key}" collides with existing leaf "${part}".`);
    }

    if (!existing) {
      current[part] = {};
    }

    current = current[part] as NestedTranslations;
  }

  const leaf = parts.at(-1);
  if (!leaf) return;

  const existing = current[leaf];
  if (existing && existing !== value) {
    throw new Error(`Duplicate key "${key}" has conflicting default messages.`);
  }

  current[leaf] = value;
}

function decodeQuotedString(value: string) {
  return JSON.parse(`"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`) as string;
}

function sortObject(value: NestedTranslations | string): NestedTranslations | string {
  if (typeof value === "string") return value;

  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, nested]) => [key, sortObject(nested)]),
  );
}

async function main() {
  const files = await walk(SOURCE_DIR);
  const translations: NestedTranslations = {};

  for (const file of files) {
    const contents = await readFile(file, "utf8");

    for (const match of contents.matchAll(descriptorPattern)) {
      const key = decodeQuotedString(match[2]);
      const message = decodeQuotedString(match[4]);
      setNestedValue(translations, key, message);
    }
  }

  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, `${JSON.stringify(sortObject(translations), null, 2)}\n`, "utf8");
}

await main();
