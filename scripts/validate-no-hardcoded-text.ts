import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const TEMPLATE_DIRECTORIES = [
  path.join(ROOT, "src", "pages"),
  path.join(ROOT, "src", "components"),
  path.join(ROOT, "src", "layouts"),
];

const VISIBLE_ATTRIBUTE_NAMES = ["alt", "aria-label", "placeholder", "title"];

type Finding = {
  file: string;
  line: number;
  snippet: string;
  kind: "text-node" | "attribute";
};

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.name.endsWith(".astro")) {
      files.push(fullPath);
    }
  }

  return files;
}

function lineNumberForIndex(text: string, index: number) {
  return text.slice(0, index).split("\n").length;
}

function stripIgnoredBlocks(template: string) {
  return template
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "");
}

function getTemplateRegion(source: string) {
  if (!source.startsWith("---")) return source;

  const match = source.match(/^---[\s\S]*?\n---\n?/);
  if (!match) return source;
  return source.slice(match[0].length);
}

function collectTextNodeFindings(source: string, file: string): Finding[] {
  const findings: Finding[] = [];
  const template = stripIgnoredBlocks(getTemplateRegion(source));
  const pattern = />\s*([^<>{}]*[A-Za-zÀ-ÿ][^<>{}]*)\s*</g;

  for (const match of template.matchAll(pattern)) {
    const snippet = match[1].trim();
    if (!snippet) continue;
    if (/^&[A-Za-z0-9#]+;$/.test(snippet)) continue;
    const fullMatch = match[0];
    if (fullMatch.includes("t({")) continue;

    findings.push({
      file,
      line: lineNumberForIndex(source, match.index ?? 0),
      snippet,
      kind: "text-node",
    });
  }

  return findings;
}

function collectAttributeFindings(source: string, file: string): Finding[] {
  const findings: Finding[] = [];
  const template = stripIgnoredBlocks(getTemplateRegion(source));
  const attrPattern = new RegExp(
    `\\b(?:${VISIBLE_ATTRIBUTE_NAMES.join("|")})\\s*=\\s*(["'])((?:(?!\\1)[^\\n])*[A-Za-zÀ-ÿ](?:(?!\\1)[^\\n])*)\\1`,
    "g",
  );

  for (const match of template.matchAll(attrPattern)) {
    const fullMatch = match[0];
    if (fullMatch.includes("t({")) continue;

    findings.push({
      file,
      line: lineNumberForIndex(source, match.index ?? 0),
      snippet: fullMatch,
      kind: "attribute",
    });
  }

  return findings;
}

const findings: Finding[] = [];

for (const dir of TEMPLATE_DIRECTORIES) {
  const files = await walk(dir);
  for (const file of files) {
    const source = await readFile(file, "utf8");
    findings.push(...collectTextNodeFindings(source, file));
    findings.push(...collectAttributeFindings(source, file));
  }
}

if (findings.length > 0) {
  console.error(
    "Found hardcoded visible text in Astro templates. Route content through t({ key, message }) first.\n",
  );
  for (const finding of findings) {
    console.error(
      `${path.relative(ROOT, finding.file)}:${finding.line} [${finding.kind}] ${finding.snippet}`,
    );
  }
  process.exit(1);
}
