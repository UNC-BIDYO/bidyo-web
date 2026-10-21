// Turns design/tokens.json (exported from the BIDYO design system) into
// src/styles/tokens.css. Run: npm run tokens
import { readFileSync, writeFileSync } from "node:fs";

const t = JSON.parse(readFileSync(new URL("../design/tokens.json", import.meta.url), "utf8"));
const themes = t.color.themes.map((th) => th.id);
const first = themes[0];

const resolve = (v) => (v.startsWith("{") ? `var(--${v.slice(1, -1)})` : v);
const valueFor = (tok, theme) =>
  typeof tok.value === "string" ? (theme === first ? tok.value : null) : tok.value[theme] ?? null;

let css = "/* BIDYO — generated from design/tokens.json by scripts/sync-tokens.mjs. Do not edit. */\n\n";

for (const theme of themes) {
  const sel = theme === first ? `:root,\n[data-theme="${theme}"]` : `[data-theme="${theme}"]`;
  css += `${sel} {\n  color-scheme: ${theme === "dark" ? "dark" : "light"};\n`;
  for (const tok of t.color.tokens) {
    const v = valueFor(tok, theme);
    if (v) css += `  --${tok.name}: ${resolve(v)};\n`;
  }
  for (const tok of t.shadow?.tokens ?? []) {
    const v = valueFor(tok, theme);
    if (v) css += `  --${tok.name}: ${v};\n`;
  }
  css += "}\n\n";
}

css += ":root {\n";
for (const fam of ["spacing", "radius"]) for (const tok of t[fam].tokens) css += `  --${tok.name}: ${tok.value};\n`;
css += "}\n\n";

const px = (v) => (typeof v === "number" ? `${v}px` : v);
for (const g of t.type.groups) {
  for (const s of g.styles) {
    const fam = s.family ?? g.family;
    css += `.type-${s.name} {\n  font-family: var(--font-${fam});\n  font-size: ${px(s.fontSize)};\n  line-height: ${s.lineHeight};\n  font-weight: ${s.fontWeight};\n`;
    if (s.letterSpacing) css += `  letter-spacing: ${s.letterSpacing};\n`;
    if (["label", "meta"].includes(s.name)) css += "  text-transform: uppercase;\n";
    css += "}\n";
  }
}

writeFileSync(new URL("../src/styles/tokens.css", import.meta.url), css);
console.log("tokens.css written");
