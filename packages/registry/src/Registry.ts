import { Prompt } from '@promptforgee/core';
import type { PromptState } from '@promptforgee/core';
import type { RegistryAdapter, PromptRecord } from './types';
import { InMemoryAdapter } from './adapters/InMemoryAdapter';

export class PromptRegistry {
  private adapter: RegistryAdapter;

  constructor(adapter?: RegistryAdapter) {
    this.adapter = adapter || new InMemoryAdapter();
  }

  /**
   * Saves a prompt state to the registry.
   * If a prompt with the same name exists, it automatically increments the version.
   */
  public async save(
    name: string,
    state: PromptState | Prompt,
    tags: string[] = [],
  ): Promise<PromptRecord> {
    const extractedState = state instanceof Prompt ? state.getState() : state;

    // Check existing versions to bump
    const existing = await this.adapter.load(name);
    const version = existing ? existing.version + 1 : 1;

    const now = new Date().toISOString();
    const record: PromptRecord = {
      id: `${name.toLowerCase().replace(/\s+/g, '-')}-v${version}`,
      name,
      version,
      tags,
      state: extractedState,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };

    await this.adapter.save(record);
    return record;
  }

  /**
   * Loads a specific version of a prompt. If no version is specified, returns the latest.
   */
  public async load(name: string, version?: number): Promise<Prompt | null> {
    const record = await this.adapter.load(name, version);
    if (!record) return null;

    return Prompt.fromState(record.state);
  }

  /**
   * Searches the registry by tags or name.
   */
  public async search(query: { tags?: string[]; name?: string }): Promise<PromptRecord[]> {
    return this.adapter.search(query);
  }

  /**
   * Exports the entire registry to a serialized JSON string.
   */
  public async exportToJSON(): Promise<string> {
    const allRecords = await this.adapter.getAll();
    return JSON.stringify(allRecords, null, 2);
  }

  /**
   * Imports a serialized JSON array of PromptRecords.
   */
  public async importFromJSON(json: string): Promise<void> {
    const records: PromptRecord[] = JSON.parse(json);
    for (const record of records) {
      await this.adapter.save(record);
    }
  }
}
