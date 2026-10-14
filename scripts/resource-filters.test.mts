import assert from "node:assert/strict";
import { test } from "node:test";
import { filterResourceFiles, resourceCategories } from "../.vitepress/theme/resource-filters.ts";

const files = [
  { repoId: "COURSE", commit: "a".repeat(40), treeSha: "b".repeat(40), path: "笔记/第一章/复习.pdf", name: "复习.pdf", routeKind: "笔记", size: 12 },
  { repoId: "COURSE", commit: "a".repeat(40), treeSha: "b".repeat(40), path: "试卷/2025/复习.pdf", name: "复习.pdf", routeKind: "试卷", size: 20 },
  { repoId: "COURSE", commit: "a".repeat(40), treeSha: "b".repeat(40), path: "软件/Solver/src/main.py", name: "main.py", routeKind: "软件", size: 30 },
];

test("分类统计来自一级目录，并保留全部文件的计数", () => {
  const counts = Object.fromEntries(resourceCategories(files).map(({ name, count }) => [name, count]));
  assert.deepEqual(counts, { 笔记: 1, 试卷: 1, 软件: 1 });
  assert.deepEqual(resourceCategories([]), []);
});

test("搜索与分类取交集，能区分不同目录中的同名文件", () => {
  assert.deepEqual(filterResourceFiles(files, "  复习  ", "笔记"), [files[0]]);
  assert.deepEqual(filterResourceFiles(files, "2025", "试卷"), [files[1]]);
  assert.deepEqual(filterResourceFiles(files, "第一章", "试卷"), []);
  assert.deepEqual(filterResourceFiles(files, "", ""), files);
});

test("搜索目录和大小写变化时保留原始路径、版本与文件对象", () => {
  const result = filterResourceFiles(files, "solver/SRC", "软件");
  assert.equal(result[0], files[2]);
  assert.equal(result[0].path, "软件/Solver/src/main.py");
  assert.equal(result[0].commit, files[2].commit);
  assert.equal(files.length, 3);
});
