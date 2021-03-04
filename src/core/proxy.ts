import { Option } from "fp-ts/lib/Option";
import { TaskEither } from "fp-ts/TaskEither";
import { ArchiRepoError } from "./error";
import { Snapshot } from "./snapshots/snapshot";
import { StoredSnapshot, StoredSnapshotId } from "./snapshots/storedSnapshot";

export interface SnapshotReader {
    readSnapshot: (snapshotYaml: string) => TaskEither<ArchiRepoError, Snapshot>;
    writeSnapshot: (snapshot: Snapshot) => string;
}

export interface SnapshotStorage {
    getCount: () => TaskEither<ArchiRepoError, number>;
    getSnapshot: (id: StoredSnapshotId) => TaskEither<ArchiRepoError, Option<StoredSnapshot>>;
    addSnapshot: (snapshot: Snapshot) => TaskEither<ArchiRepoError, StoredSnapshot>;
    removeSnapshot: (id: StoredSnapshotId) => TaskEither<ArchiRepoError, StoredSnapshotId>;
    enableSnapshot: (id: StoredSnapshotId) => TaskEither<ArchiRepoError, StoredSnapshotId>;
    disableSnapshot: (id: StoredSnapshotId) => TaskEither<ArchiRepoError, StoredSnapshotId>;
    getSnapshotsBefore: (timestamp: Date) => TaskEither<ArchiRepoError, StoredSnapshot[]>;
}