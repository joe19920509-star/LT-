/**
 * 可选：根据下方数组批量生成 content/articles/*.md
 * 用法：编辑 articles 数组后运行  node scripts/write-initial-md.mjs
 * （当前为空；演示英文稿已移除，请直接手写 md 或使用后台。）
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dir = path.join(root, "content/articles");

/** @type {{ slug: string; title: string; category: string; dek: string; excerpt: string; publishedAt: string; body: string }[]} */
const articles = [];

function fm(a) {
  const front = `---
title: ${JSON.stringify(a.title)}
slug: ${JSON.stringify(a.slug)}
category: ${JSON.stringify(a.category)}
dek: ${JSON.stringify(a.dek)}
excerpt: ${JSON.stringify(a.excerpt)}
publishedAt: ${JSON.stringify(a.publishedAt)}
---
`;
  return front + "\n" + a.body.trim() + "\n";
}

if (articles.length === 0) {
  console.log("articles 数组为空，未写入任何文件。");
  process.exit(0);
}

fs.mkdirSync(dir, { recursive: true });
for (const a of articles) {
  fs.writeFileSync(path.join(dir, `${a.slug}.md`), fm(a), "utf8");
}
console.log("Wrote", articles.length, "markdown articles to", dir);
