import { right, TaskEither, map, fromOption } from "fp-ts/TaskEither";
import { ArchiRepoError } from "../core/error";
import { SnapshotStorage } from "../core/proxy";
import { v4 as uuidv4 } from "uuid";
import { findFirst, findIndex, filter } from "fp-ts/Array";
import { map as mapOption, Option } from "fp-ts/Option";
import { pipe } from "fp-ts/pipeable";
import { Snapshot, SnapshotId, SnapshotSummary, StoredSnapshot } from "../core/snapshots/snapshot";

const _getSnapshotsBefore = (snapshots: StoredSnapshot[]) =>
    (timestamp: Date): TaskEither<ArchiRepoError, StoredSnapshot[]> =>
        pipe(
            snapshots,
            filter(snapshot => snapshot.timestamp.getTime() <= timestamp.getTime()),
            right
        );

const _addSnapshot = (snapshots: StoredSnapshot[]) =>
    (snapshot: Snapshot): TaskEither<ArchiRepoError, SnapshotSummary> => {
        const result: StoredSnapshot = {
            id: uuidv4(),
            enabled: true,
            ...snapshot
        };
        snapshots.push(result);
        return right({
            id: result.id,
            name: result.name,
            description: result.description,
            enabled: result.enabled,
            timestamp: result.timestamp
        });
    }

const _removeSnapshot = (snapshots: StoredSnapshot[]) =>
    (id: SnapshotId): TaskEither<ArchiRepoError, SnapshotId> =>
        pipe(
            right(snapshots),
            map(findIndex((snapshot: StoredSnapshot) => snapshot.id === id)),
            map(mapOption((idx: number) => snapshots.splice(idx, 1))),
            map(_ => id)
        );

const _findSnapshotIdx = (snapshots: StoredSnapshot[]) =>
    (id: SnapshotId): Option<number> =>
        pipe(
            snapshots,
            findIndex((snapshot: StoredSnapshot) => snapshot.id === id));

const _enableSnapshot = (snapshots: StoredSnapshot[]) =>
    (id: SnapshotId): TaskEither<ArchiRepoError, SnapshotId> =>
        pipe(
            _findSnapshotIdx(snapshots)(id),
            fromOption<ArchiRepoError>(() => ArchiRepoError.StoredSnapshotNotFound),
            map(idx => {
                snapshots[idx] = Object.assign(snapshots[idx], { enabled: true });
                return id;
            }),
            map(_ => id)
        );

const _disableSnapshot = (snapshots: StoredSnapshot[]) =>
    (id: SnapshotId): TaskEither<ArchiRepoError, SnapshotId> =>
        pipe(
            _findSnapshotIdx(snapshots)(id),
            fromOption<ArchiRepoError>(() => ArchiRepoError.StoredSnapshotNotFound),
            map(idx => {
                snapshots[idx] = Object.assign(snapshots[idx], { enabled: false });
                return id;
            }),
            map(_ => id)
        );

const _getSnapshot = (snapshots: StoredSnapshot[]) =>
    (id: SnapshotId): TaskEither<ArchiRepoError, Option<StoredSnapshot>> =>
        pipe(
            right(snapshots),
            map(findFirst(snapshot => snapshot.id === id))
        );

export const memoryStore = (): SnapshotStorage => {
    let snapshots: StoredSnapshot[] = [];
    return {
        getCount: () => right(snapshots.length),
        getSnapshot: _getSnapshot(snapshots),
        getSnapshotsBefore: _getSnapshotsBefore(snapshots),
        addSnapshot: _addSnapshot(snapshots),
        removeSnapshot: _removeSnapshot(snapshots),
        enableSnapshot: _enableSnapshot(snapshots),
        disableSnapshot: _disableSnapshot(snapshots),
    };
}