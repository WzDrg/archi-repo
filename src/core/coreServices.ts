import { reduce } from "fp-ts/Array";
import { IOEither, left, map, chain, sequenceArray } from "fp-ts/IOEither";
import { flatten } from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/pipeable";
import { ArchiRepoError } from "./error";
import { AggregateCommand, AggregateEvent, executeCommand } from "./events/event";
import { EventStore } from "./events/eventStore";
import { Snapshot } from "./snapshots/snapshot";
import { createSnapshot } from "./snapshots/snapshotBuilder";
import { snapshotToCommands } from "./snapshots/snapshotCommandBuilder";

const _executeCommand = (eventStore: EventStore) =>
    (command: AggregateCommand<any>) =>
        pipe(
            eventStore.getEventsById(command.id),
            map(executeCommand(command)),
            chain(eventStore.storeEvents)
        );

const _insertSnapshot = (eventStore: EventStore) =>
    (snapshot: Snapshot): IOEither<ArchiRepoError, readonly AggregateEvent<any>[]> =>
        pipe(
            snapshotToCommands(snapshot),
            reduce(new Array<IOEither<ArchiRepoError, AggregateEvent<any>[]>>(), (result, command) =>
                result.concat(_executeCommand(eventStore)(command))),
            sequenceArray,
            map(flatten)
        );

const _createSnapshotAt = (eventStore: EventStore) =>
    (timestamp: Date, name: string, description: string): IOEither<ArchiRepoError, Snapshot> =>
        pipe(
            eventStore.getEventsBefore(timestamp),
            map(createSnapshot(timestamp, name, description))
        );

export interface CoreServices {
    insertSnapshot: (snapshot: Snapshot) => IOEither<ArchiRepoError, readonly AggregateEvent<any>[]>;
    createSnapshotAt: (timestamp: Date, name: string, description: string) => IOEither<ArchiRepoError, Snapshot>;
}

export const coreServices = (eventStore: EventStore): CoreServices => ({
    insertSnapshot: _insertSnapshot(eventStore),
    createSnapshotAt: _createSnapshotAt(eventStore)
});