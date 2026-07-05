import type { RegistryAdapter, PromptRecord } from '../types';

export class InMemoryAdapter implements RegistryAdapter {
  private records: Map<string, PromptRecord[]> = new Map();

  public async save(record: PromptRecord): Promise<void> {
    const existingVersions = this.records.get(record.name) || [];
    // Ensure we replace if version exact matches (though Registry should bump)
    const index = existingVersions.findIndex((r) => r.version === record.version);
    if (index >= 0) {
      existingVersions[index] = record;
    } else {
      existingVersions.push(record);
      // Keep sorted by version descending
      existingVersions.sort((a, b) => b.version - a.version);
    }
    this.records.set(record.name, existingVersions);
  }

  public async load(name: string, version?: number): Promise<PromptRecord | null> {
    const existingVersions = this.records.get(name);
    if (!existingVersions || existingVersions.length === 0) return null;

    if (version !== undefined) {
      return existingVersions.find((r) => r.version === version) || null;
    }

    // Default to latest version (index 0 due to sort)
    return existingVersions[0];
  }

  public async search(query: { tags?: string[]; name?: string }): Promise<PromptRecord[]> {
    const results: PromptRecord[] = [];

    for (const [name, versions] of this.records.entries()) {
      if (versions.length === 0) continue;
      const latest = versions[0]; // Search typically applies to the latest active version

      let matches = true;

      if (query.name && !name.toLowerCase().includes(query.name.toLowerCase())) {
        matches = false;
      }

      if (matches && query.tags && query.tags.length > 0) {
        const hasAllTags = query.tags.every((t) => latest.tags.includes(t));
        if (!hasAllTags) {
          matches = false;
        }
      }

      if (matches) {
        results.push(latest);
      }
    }

    return results;
  }

  public async getAll(): Promise<PromptRecord[]> {
    const results: PromptRecord[] = [];
    for (const versions of this.records.values()) {
      if (versions.length > 0) {
        results.push(versions[0]);
      }
    }
    return results;
  }
}
