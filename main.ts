import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One-line forecast for a city that doesn't exist.
// The forecast line is the whole entry: keep it exactly as written,
// no trailing newline, no extra whitespace, and never longer than
// the 140-character limit for this competition.
const line =
  "Tomorrow in Nowhere City: sunny with a chance of Tuesdays. " +
  "Expect delays on the invisible line and umbrella-optional rain.";

// Fail fast if the line ever drifts past the limit or picks up a newline.
if (line.length > 140) {
  throw new Error(`Forecast line is ${line.length} characters, over the 140 limit`);
}
if (line.includes("\n") || line !== line.trim()) {
  throw new Error("Forecast line must be a single line with no surrounding whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

// Only ever write into the harness output directory, never the repo.
const target = join(outDir, "entry.txt");
writeFileSync(target, line, "utf8");

// Read it back and make sure what landed on disk is byte-for-byte the line.
const written = readFileSync(target, "utf8");
if (written !== line) {
  throw new Error("entry.txt does not match the forecast line exactly");
}
if (written.endsWith("\n")) {
  throw new Error("entry.txt must not end with a trailing newline");
}
console.log(`Wrote ${written.length} characters to ${target}`);
