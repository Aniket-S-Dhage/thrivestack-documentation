#!/usr/bin/env node
/**
 * Pages used to be served under /public/ because the repo folder was uploaded to S3 as-is. They now live
 * at the site root (/mcp/introduction.html, not /public/mcp/introduction.html). Old links are still out
 * there (the MCP server's documentation URL, the product UI, llms.txt guides, search results), so this
 * writes a small redirect page at every old /public/... URL.
 *
 * Run from the repo root before the S3 sync (CI does this): node scripts/build-legacy-redirects.js
 * The generated public/ folder is git-ignored; it is never committed.
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(REPO_ROOT, "public");
const SITE = "https://docs.thrivestack.ai";
// Top-level folders that used to live inside public/.
const MOVED_DIRS = ["api", "cited-by", "crm-sync", "customer-success", "marketing", "mcp", "product", "revenue"];

function walkHtml(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) walkHtml(fullPath, files);
        else if (entry.name.endsWith(".html")) files.push(fullPath);
    }
    return files;
}

function redirectPage(newPath) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>This page has moved</title>
    <link rel="canonical" href="${SITE}/${newPath}">
    <meta http-equiv="refresh" content="0; url=/${newPath}">
    <script>location.replace("/${newPath}" + location.search + location.hash);</script>
</head>
<body>
    <p>This page has moved to <a href="/${newPath}">${SITE}/${newPath}</a>.</p>
</body>
</html>
`;
}

let written = 0;
for (const dirName of MOVED_DIRS) {
    const dir = path.join(REPO_ROOT, dirName);
    if (!fs.existsSync(dir)) continue;
    for (const file of walkHtml(dir)) {
        const newPath = path.relative(REPO_ROOT, file).split(path.sep).join("/");
        const stubPath = path.join(OUT_DIR, newPath);
        fs.mkdirSync(path.dirname(stubPath), { recursive: true });
        fs.writeFileSync(stubPath, redirectPage(newPath));
        written += 1;
    }
}
console.log(`Wrote ${written} redirect pages under public/`);
