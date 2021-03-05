import { Option } from "fp-ts/lib/Option";
import { TaskEither } from "fp-ts/TaskEither";
import { ArchiRepoError } from "./error";
import { Snapshot, SnapshotId, SnapshotSummary, StoredSnapshot } from "./snapshots/snapshot";

export interface SnapshotStorage {
    getCount: () => TaskEither<ArchiRepoError, number>;
    getSnapshot: (id: SnapshotId) => TaskEither<ArchiRepoError, Option<StoredSnapshot>>;
    addSnapshot: (snapshot: Snapshot) => TaskEither<ArchiRepoError, SnapshotSummary>;
    removeSnapshot: (id: SnapshotId) => TaskEither<ArchiRepoError, SnapshotId>;
    enableSnapshot: (id: SnapshotId) => TaskEither<ArchiRepoError, SnapshotId>;
    disableSnapshot: (id: SnapshotId) => TaskEither<ArchiRepoError, SnapshotId>;
    getSnapshotsBefore: (timestamp: Date) => TaskEither<ArchiRepoError, StoredSnapshot[]>;
}