import { reduce, traverse, map as arrayMap } from "fp-ts/Array";
import { flatten } from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/pipeable";
import { ArchiRepoError } from "./error";
import { AggregateCommand, AggregateEvent, executeCommand } from "./events/event";
import { EventStore, memoryEventStore } from "./events/eventStore";
import { Snapshot, SnapshotId, SnapshotSummary } from "./snapshots/snapshot";
import { createSnapshot } from "./snapshots/snapshotBuilder";
import { snapshotToCommands } from "./snapshots/snapshotCommandBuilder";
import { TaskEither, map, chain, sequenceArray, left, fromOption } from "fp-ts/lib/TaskEither";
import { SnapshotStorage } from "./proxy";

const _executeCommand = (eventStore: EventStore) =>
    (command: AggregateCommand<any>) =>
        pipe(
            eventStore.getEventsById(command.id),
            map(executeCommand(command)),
            chain(eventStore.storeEvents)
        );

const _createSnapshot = (eventStore: EventStore) =>
    (commands: AggregateCommand<any>[]): TaskEither<ArchiRepoError, readonly AggregateEvent<any>[]> =>
        pipe(
            commands,
            reduce(new Array<TaskEither<ArchiRepoError, AggregateEvent<any>[]>>(), (result, command) =>
                result.concat(_executeCommand(eventStore)(command))),
            sequenceArray,
            map(flatten)
        );

const _createSnapshotAt = (storage: SnapshotStorage) =>
    (timestamp: Date): TaskEither<ArchiRepoError, Snapshot> =>
        pipe(
            storage.getSnapshotsBefore(timestamp),
            map(arrayMap(snapshotToCommands)),
            map(flatten),
            chain(_createSnapshot(memoryEventStore())),
            map(createSnapshot(timestamp, "snapshot", ""))
        );

const _updateSnapshot = (storage: SnapshotStorage) =>
    (id: SnapshotId, snapshot: Snapshot) =>
        left(ArchiRepoError.NotImplemented);

const _enableSnapshot = (storage: SnapshotStorage) =>
    (id: SnapshotId) =>
        left(ArchiRepoError.NotImplemented);

const _disableSnapshot = (storage: SnapshotStorage) =>
    (id: SnapshotId) =>
        left(ArchiRepoError.NotImplemented);

const _removeSnapshot = (storage: SnapshotStorage) =>
    (id: SnapshotId) =>
        left(ArchiRepoError.NotImplemented);

const _getAllSnapshots = (storage: SnapshotStorage) =>
    () =>
        left(ArchiRepoError.NotImplemented);

const _getSnapshot = (storage: SnapshotStorage) =>
    (id: SnapshotId) =>
        pipe(
            id,
            storage.getSnapshot,
            chain(fromOption(() => ArchiRepoError.StoredSnapshotNotFound))
        )

export interface CoreServices {
    saveSnapshot: (snapshot: Snapshot) => TaskEither<ArchiRepoError, SnapshotSummary>;
    updateSnapshot: (id: SnapshotId, snapshot: Snapshot) => TaskEither<ArchiRepoError, SnapshotSummary>;
    enableSnapshot: (id: SnapshotId) => TaskEither<ArchiRepoError, SnapshotSummary>;
    disableSnapshot: (id: SnapshotId) => TaskEither<ArchiRepoError, SnapshotSummary>;
    removeSnapshot: (id: SnapshotId) => TaskEither<ArchiRepoError, SnapshotSummary>;
    getAllSnapshots: () => TaskEither<ArchiRepoError, SnapshotSummary[]>;
    getSnapshot: (id: SnapshotId) => TaskEither<ArchiRepoError, Snapshot>;
    newSnapshotAt: (timestamp: Date) => TaskEither<ArchiRepoError, Snapshot>;
}

export const coreServices = (storage: SnapshotStorage): CoreServices => ({
    saveSnapshot: storage.addSnapshot,
    updateSnapshot: _updateSnapshot(storage),
    enableSnapshot: _enableSnapshot(storage),
    disableSnapshot: _disableSnapshot(storage),
    removeSnapshot: _removeSnapshot(storage),
    getAllSnapshots: _getAllSnapshots(storage),
    getSnapshot: _getSnapshot(storage),
    newSnapshotAt: _createSnapshotAt(storage)
});