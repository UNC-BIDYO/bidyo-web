// BIDYO roadmap tracker: .github/roadmap.json → GitHub labels, milestones and issues.
//
//   npm run roadmap:md                 regenerate ROADMAP.md (no GitHub needed)
//   npm run roadmap:seed -- --dry-run  show what would be created
//   npm run roadmap:seed               create everything on GitHub (needs the GitHub CLI: gh auth login)
//   npm run roadmap:seed -- --repo uncbidyo/bidyo-web
//
// Safe to re-run: existing labels, milestones and issues (matched by title) are left alone.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("..", import.meta.url);
const roadmap = JSON.parse(readFileSync(new URL(".github/roadmap.json", root), "utf8"));
const args = process.argv.slice(2);
const cmd = args[0];
const dryRun = args.includes("--dry-run");
const repoArg = args.includes("--repo") ? args[args.indexOf("--repo") + 1] : null;

if (cmd === "md") writeMarkdown();
else if (cmd === "seed") seed();
else {
  console.log("Usage: node scripts/roadmap.mjs <md|seed> [--dry-run] [--repo owner/name]");
  process.exit(1);
}

function writeMarkdown() {
  let md = "# BIDYO roadmap\n\n";
  md += "Generated from `.github/roadmap.json` by `npm run roadmap:md`. Live progress is on GitHub → **Issues → Milestones**.\n\n";
  md += "Legend: ✅ done · ⬜ open · 🙋 needs Kurt (account, decision or content)\n\n";
  for (const m of roadmap.milestones) {
    const items = roadmap.issues.filter((i) => i.milestone === m.title);
    const done = items.filter((i) => i.state === "closed").length;
    md += `## ${m.title} (${done}/${items.length})\n\n${m.description}\n\n`;
    for (const i of items) {
      const mark = i.state === "closed" ? "✅" : "⬜";
      const kurt = i.labels.includes("needs-kurt") ? " 🙋" : "";
      const areas = i.labels.filter((l) => l.startsWith("area:")).map((l) => `\`${l.slice(5)}\``).join(" ");
      md += `- ${mark} ${i.title}${kurt} ${areas}\n`;
    }
    md += "\n";
  }
  writeFileSync(new URL("ROADMAP.md", root), md);
  console.log("ROADMAP.md written");
}

function gh(argv, input) {
  return execFileSync("gh", argv, {
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    // No shell: arguments contain "&" and spaces. gh.exe is found on PATH on Windows too.
  });
}

function api(method, path, body) {
  const argv = ["api", "-X", method, path, "-H", "Accept: application/vnd.github+json"];
  if (body) argv.push("--input", "-");
  const out = gh(argv, body ? JSON.stringify(body) : undefined);
  return out.trim() ? JSON.parse(out) : null;
}

function list(path) {
  // gh --paginate concatenates pages; --slurp wraps them in one array
  const out = gh(["api", "--paginate", "--slurp", path]);
  return JSON.parse(out).flat();
}

function seed() {
  try {
    gh(["--version"]);
  } catch {
    console.error("GitHub CLI not found. Install it from https://cli.github.com and run: gh auth login");
    process.exit(1);
  }

  const repo =
    repoArg ?? JSON.parse(gh(["repo", "view", "--json", "nameWithOwner"])).nameWithOwner;
  console.log(`Repository: ${repo}${dryRun ? "  (dry run, nothing will be created)" : ""}\n`);

  // Labels
  const existingLabels = new Set(list(`repos/${repo}/labels?per_page=100`).map((l) => l.name));
  for (const l of roadmap.labels) {
    if (existingLabels.has(l.name)) continue;
    console.log(`+ label      ${l.name}`);
    if (!dryRun) api("POST", `repos/${repo}/labels`, l);
  }

  // Milestones
  const milestoneNo = new Map(
    list(`repos/${repo}/milestones?state=all&per_page=100`).map((m) => [m.title, m.number]),
  );
  for (const m of roadmap.milestones) {
    if (milestoneNo.has(m.title)) continue;
    console.log(`+ milestone  ${m.title}`);
    if (!dryRun) milestoneNo.set(m.title, api("POST", `repos/${repo}/milestones`, m).number);
  }

  // Issues (pull requests are excluded from the title match)
  const existingIssues = new Set(
    list(`repos/${repo}/issues?state=all&per_page=100`)
      .filter((i) => !i.pull_request)
      .map((i) => i.title),
  );
  let created = 0;
  for (const i of roadmap.issues) {
    if (existingIssues.has(i.title)) continue;
    console.log(`+ issue      [${i.milestone}] ${i.title}${i.state === "closed" ? " (closed)" : ""}`);
    created++;
    if (dryRun) continue;
    const issue = api("POST", `repos/${repo}/issues`, {
      title: i.title,
      body: i.body,
      labels: i.labels,
      milestone: milestoneNo.get(i.milestone),
    });
    if (i.state === "closed") {
      api("PATCH", `repos/${repo}/issues/${issue.number}`, { state: "closed", state_reason: "completed" });
    }
  }

  console.log(`\nDone. ${created} issue(s) ${dryRun ? "would be created" : "created"}.`);
  console.log(`See https://github.com/${repo}/milestones`);
}
