import type { PromptState } from '@promptforgee/core';

export interface PromptRecord {
  id: string; // Typically the slugified name + version
  name: string;
  version: number;
  tags: string[];
  state: PromptState;
  createdAt: string;
  updatedAt: string;
}

export interface RegistryAdapter {
  save(record: PromptRecord): Promise<void>;
  load(name: string, version?: number): Promise<PromptRecord | null>;
  search(query: { tags?: string[]; name?: string }): Promise<PromptRecord[]>;
  getAll(): Promise<PromptRecord[]>;
}
