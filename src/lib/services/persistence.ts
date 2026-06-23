import fs from 'fs';
import path from 'path';
import { 
  policies as initialPolicies, 
  policyHolders as initialPolicyHolders, 
  beneficiariesData as initialBeneficiaries,
  auditEntries as initialAuditEntries
} from '@/lib/data/mock-data';

// Data directory for persistent storage
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (typeof window === 'undefined') {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignore errors during build
  }
}

// File paths for different data types
const FILES = {
  policies: path.join(DATA_DIR, 'policies.json'),
  policyHolders: path.join(DATA_DIR, 'policyHolders.json'),
  beneficiaries: path.join(DATA_DIR, 'beneficiaries.json'),
  benefits: path.join(DATA_DIR, 'benefits.json'),
  auditEntries: path.join(DATA_DIR, 'auditEntries.json'),
};

// Types for persistence
export interface PersistenceRecord<T> {
  id: string;
  original: T;
  current: T;
  lastModified: string;
  modificationHistory: Array<{
    timestamp: string;
    changes: Partial<T>;
  }>;
}

export interface PersistenceStore<T> {
  records: Record<string, PersistenceRecord<T>>;
  lastUpdated: string;
}

export interface BulkExportData {
  exportedAt: string;
  version: string;
  data: {
    policies: PersistenceStore<unknown> | null;
    policyHolders: PersistenceStore<unknown> | null;
    beneficiaries: PersistenceStore<unknown> | null;
    auditEntries: PersistenceStore<unknown> | null;
  };
}

/**
 * Generic persistence service for file-based storage
 */
export class PersistenceService<T extends { id: string }> {
  private filePath: string;
  private store: PersistenceStore<T>;

  constructor(type: keyof typeof FILES) {
    this.filePath = FILES[type];
    this.store = this.loadStore();
  }

  /**
   * Load store from file or create empty store
   */
  private loadStore(): PersistenceStore<T> {
    try {
      if (typeof window === 'undefined' && fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data);
      }
    } catch {
      // Ignore errors
    }
    return { records: {}, lastUpdated: new Date().toISOString() };
  }

  /**
   * Save store to file
   */
  private saveStore(): void {
    try {
      if (typeof window === 'undefined') {
        this.store.lastUpdated = new Date().toISOString();
        fs.writeFileSync(this.filePath, JSON.stringify(this.store, null, 2), 'utf-8');
      }
    } catch {
      // Ignore errors
    }
  }

  /**
   * Initialize a record with original data
   */
  initializeRecord(item: T): T {
    const id = item.id;
    if (!id) return item;

    if (this.store.records[id]) {
      return this.store.records[id].current;
    }

    this.store.records[id] = {
      id,
      original: JSON.parse(JSON.stringify(item)),
      current: JSON.parse(JSON.stringify(item)),
      lastModified: new Date().toISOString(),
      modificationHistory: [],
    };
    this.saveStore();
    return item;
  }

  /**
   * Initialize multiple records
   */
  initializeRecords(items: T[]): T[] {
    return items.map((item) => this.initializeRecord(item));
  }

  /**
   * Get a record by ID
   */
  getRecord(id: string): T | null {
    const record = this.store.records[id];
    return record ? record.current : null;
  }

  /**
   * Get all records
   */
  getAllRecords(): T[] {
    return Object.values(this.store.records).map((r) => r.current);
  }

  /**
   * Update a record with changes
   */
  updateRecord(id: string, changes: Partial<T>): T | null {
    const record = this.store.records[id];
    if (!record) return null;

    record.current = { ...record.current, ...changes };
    record.lastModified = new Date().toISOString();
    record.modificationHistory.push({
      timestamp: new Date().toISOString(),
      changes,
    });

    this.saveStore();
    return record.current;
  }

  /**
   * Reset a single record to its original state
   */
  resetRecord(id: string): T | null {
    const record = this.store.records[id];
    if (!record) return null;

    record.current = JSON.parse(JSON.stringify(record.original));
    record.lastModified = new Date().toISOString();
    record.modificationHistory.push({
      timestamp: new Date().toISOString(),
      changes: ({ _reset: true } as unknown) as Partial<T>,
    });

    this.saveStore();
    return record.current;
  }

  /**
   * Reset all records to their original states
   */
  resetAllRecords(): void {
    for (const id of Object.keys(this.store.records)) {
      this.resetRecord(id);
    }
  }

  /**
   * Get modification history for a record
   */
  getHistory(id: string): PersistenceRecord<T>['modificationHistory'] | null {
    const record = this.store.records[id];
    return record ? record.modificationHistory : null;
  }

  /**
   * Check if a record has been modified
   */
  isModified(id: string): boolean {
    const record = this.store.records[id];
    if (!record) return false;
    return JSON.stringify(record.original) !== JSON.stringify(record.current);
  }

  /**
   * Get original state of a record
   */
  getOriginal(id: string): T | null {
    const record = this.store.records[id];
    return record ? record.original : null;
  }

  /**
   * Delete a record
   */
  deleteRecord(id: string): boolean {
    if (this.store.records[id]) {
      delete this.store.records[id];
      this.saveStore();
      return true;
    }
    return false;
  }

  /**
   * Add a new record
   */
  addRecord(item: T): T {
    const id = item.id;
    if (!id) {
      throw new Error('Cannot add record without ID');
    }

    this.store.records[id] = {
      id,
      original: JSON.parse(JSON.stringify(item)),
      current: JSON.parse(JSON.stringify(item)),
      lastModified: new Date().toISOString(),
      modificationHistory: [],
    };
    this.saveStore();
    return item;
  }

  /**
   * Get the raw store for export
   */
  getStore(): PersistenceStore<T> {
    return this.store;
  }

  /**
   * Set the store from import
   */
  setStore(store: PersistenceStore<T>): void {
    this.store = store;
    this.saveStore();
  }
}

// Helper to load persisted data or return fallback
export function loadPersistedData<T extends { id: string }>(type: keyof typeof FILES, fallbackData: T[]): T[] {
  try {
    if (typeof window === 'undefined' && fs.existsSync(FILES[type])) {
      const store: PersistenceStore<T> = JSON.parse(fs.readFileSync(FILES[type], 'utf-8'));
      if (store.records && Object.keys(store.records).length > 0) {
        return Object.values(store.records).map(r => r.current);
      }
    }
  } catch {
    // Ignore file read errors
  }
  return fallbackData;
}

// Helper to convert array to persistence store format
function arrayToStore<T extends { id: string }>(items: T[]): PersistenceStore<T> {
  const records: Record<string, PersistenceRecord<T>> = {};
  for (const item of items) {
    records[item.id] = {
      id: item.id,
      original: JSON.parse(JSON.stringify(item)),
      current: JSON.parse(JSON.stringify(item)),
      lastModified: new Date().toISOString(),
      modificationHistory: [],
    };
  }
  return {
    records,
    lastUpdated: new Date().toISOString(),
  };
}

// Export functions for bulk operations
export function exportAllData(): BulkExportData {
  const readFileOrFallback = <T extends { id: string }>(filePath: string, fallbackData: T[]): PersistenceStore<T> | null => {
    try {
      if (typeof window === 'undefined' && fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch {
      // Ignore file read errors
    }
    // Return mock data as fallback if no persisted data exists
    if (fallbackData && fallbackData.length > 0) {
      return arrayToStore(fallbackData);
    }
    return null;
  };

  return {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    data: {
      policies: readFileOrFallback(FILES.policies, initialPolicies as { id: string }[]),
      policyHolders: readFileOrFallback(FILES.policyHolders, initialPolicyHolders as { id: string }[]),
      beneficiaries: readFileOrFallback(FILES.beneficiaries, initialBeneficiaries as { id: string }[]),
      auditEntries: readFileOrFallback(FILES.auditEntries, initialAuditEntries as { id: string }[]),
    },
  };
}

export function importAllData(data: BulkExportData): { success: boolean; imported: Record<string, number> } {
  const imported: Record<string, number> = {};

  try {
    if (typeof window === 'undefined') {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (data.data.policies) {
        fs.writeFileSync(FILES.policies, JSON.stringify(data.data.policies, null, 2), 'utf-8');
        imported.policies = Object.keys(data.data.policies.records || {}).length;
      }

      if (data.data.policyHolders) {
        fs.writeFileSync(FILES.policyHolders, JSON.stringify(data.data.policyHolders, null, 2), 'utf-8');
        imported.policyHolders = Object.keys(data.data.policyHolders.records || {}).length;
      }

      if (data.data.beneficiaries) {
        fs.writeFileSync(FILES.beneficiaries, JSON.stringify(data.data.beneficiaries, null, 2), 'utf-8');
        imported.beneficiaries = Object.keys(data.data.beneficiaries.records || {}).length;
      }

      if (data.data.auditEntries) {
        fs.writeFileSync(FILES.auditEntries, JSON.stringify(data.data.auditEntries, null, 2), 'utf-8');
        imported.auditEntries = Object.keys(data.data.auditEntries.records || {}).length;
      }
    }

    return { success: true, imported };
  } catch {
    return { success: false, imported };
  }
}

export function clearAllData(): void {
  try {
    if (typeof window === 'undefined') {
      for (const file of Object.values(FILES)) {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }
    }
  } catch {
    // Ignore
  }
}

// Singleton instances
export const policiesPersistence = new PersistenceService<{ id: string }>('policies');
export const policyHoldersPersistence = new PersistenceService<{ id: string }>('policyHolders');
export const beneficiariesPersistence = new PersistenceService<{ id: string }>('beneficiaries');
export const benefitsPersistence = new PersistenceService<{ id: string }>('benefits');
export const auditEntriesPersistence = new PersistenceService<{ id: string }>('auditEntries');
