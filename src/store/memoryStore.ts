import { left, right, TaskEither, map, fromOption } from "fp-ts/TaskEither";
import { Snapshot } from "../core";
import { ArchiRepoError } from "../core/error";
import { SnapshotStorage } from "../core/proxy";
import { StoredSnapshot, StoredSnapshotId } from "../core/snapshots/storedSnapshot";
import { v4 as uuidv4 } from "uuid";
import { findFirst, findIndex } from "fp-ts/Array";
import { map as mapOption, Option } from "fp-ts/Option";
import { pipe } from "fp-ts/pipeable";

const _getSnapshotsBefore = (snapshots: StoredSnapshot[]) =>
    (timestamp: Date): TaskEither<ArchiRepoError, StoredSnapshot[]> =>
        left(ArchiRepoError.NotImplemented);

const _addSnapshot = (snapshots: StoredSnapshot[]) =>
    (snapshot: Snapshot): TaskEither<ArchiRepoError, StoredSnapshot> => {
        const result: StoredSnapshot = {
            id: uuidv4(),
            name: snapshot.name,
            timestamp: snapshot.timestamp,
            snapshot: snapshot,
            enabled: true
        };
        snapshots.push(result);
        return right(result);
    }

const _removeSnapshot = (snapshots: StoredSnapshot[]) =>
    (id: StoredSnapshotId): TaskEither<ArchiRepoError, StoredSnapshotId> =>
        pipe(
            right(snapshots),
            map(findIndex((snapshot: StoredSnapshot) => snapshot.id === id)),
            map(mapOption((idx: number) => snapshots.splice(idx, 1))),
            map(_ => id)
        );

const _findSnapshotIdx = (snapshots: StoredSnapshot[]) =>
    (id: StoredSnapshotId): Option<number> =>
        pipe(
            snapshots,
            findIndex((snapshot: StoredSnapshot) => snapshot.id === id));

const _enableSnapshot = (snapshots: StoredSnapshot[]) =>
    (id: StoredSnapshotId): TaskEither<ArchiRepoError, StoredSnapshotId> =>
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
    (id: StoredSnapshotId): TaskEither<ArchiRepoError, StoredSnapshotId> =>
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
    (id: StoredSnapshotId): TaskEither<ArchiRepoError, Option<StoredSnapshot>> =>
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