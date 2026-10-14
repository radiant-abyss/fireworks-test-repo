import type { ResourceFile } from "./resource-tree";

export type SearchableResourceFile = ResourceFile & { repoName?: string };

export function resourceCategory(file: ResourceFile): string {
  return file.path.split("/", 1)[0];
}

export function resourceCategories(files: ResourceFile[]): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const file of files) {
    const category = resourceCategory(file);
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  return Array.from(counts, ([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}

export function filterResourceFiles<T extends SearchableResourceFile>(
  files: T[], query: string, category = "",
): T[] {
  const needle = query.trim().toLowerCase();
  return files.filter((file) =>
    (!category || resourceCategory(file) === category) &&
    (!needle || `${file.name} ${file.path} ${file.repoName ?? ""}`.toLowerCase().includes(needle)),
  );
}
