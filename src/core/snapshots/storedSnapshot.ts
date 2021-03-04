import { Snapshot } from "./snapshot";

export type StoredSnapshotId = string;

export interface StoredSnapshot {
    id: StoredSnapshotId;
    name: string;
    timestamp: Date;
    snapshot: Snapshot;
    enabled: boolean;
}