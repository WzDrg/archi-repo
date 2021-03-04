import { chain, fromEither, TaskEither, map, taskEither, left, right, tryCatch } from "fp-ts/TaskEither";
import { Snapshot, SoftwareSystemSnapshot } from "../core";
import { ArchiRepoError } from "../core/error";
import { SnapshotReader } from "../core/proxy";
import yaml from "js-yaml";
import { pipe } from "fp-ts/pipeable";
import { sequenceT } from "fp-ts/Apply";
import { traverse } from "fp-ts/Array";

const toSoftwareSystem = ([name, description]: [string, string]): SoftwareSystemSnapshot =>
({
    name: name,
    description: description,
    containers: [],
    communications: []
});

const validateName = (name: any): TaskEither<ArchiRepoError, string> =>
    (typeof name === "string" || name instanceof String) && name.length > 3 ? right(name as string) : left(ArchiRepoError.FileReadError);

const validateDescription = (description: any): TaskEither<ArchiRepoError, string> =>
    (typeof description === "string" || description instanceof String) && description.length > 3 ? right(description as string) : left(ArchiRepoError.FileReadError);

const validateDate = (timestamp: any): TaskEither<ArchiRepoError, Date> =>
    (typeof timestamp === "string" || timestamp instanceof String) ? right(new Date(timestamp as string)) : left(ArchiRepoError.FileReadError);

const toSnapshot = ([name, description, timestamp, softwareSystems]: [string, string, Date, SoftwareSystemSnapshot[]]): Snapshot =>
({
    name: name,
    description: description,
    timestamp: timestamp,
    softwareSystems: softwareSystems,
    environments: []
});

const validateSoftwareSystem = (softwareSystem: any): TaskEither<ArchiRepoError, SoftwareSystemSnapshot> =>
    pipe(
        sequenceT(taskEither)(
            validateName(softwareSystem["name"]),
            validateDescription(softwareSystem["description"])
        ),
        map(toSoftwareSystem)
    );

const validateSoftwareSystems = (softwareSystems: any): TaskEither<ArchiRepoError, SoftwareSystemSnapshot[]> =>
    (Array.isArray(softwareSystems))
        ? traverse(taskEither)(validateSoftwareSystem)(softwareSystems)
        : right([]);

const validateSnapshot = (snapshot: any): TaskEither<ArchiRepoError, Snapshot> =>
    pipe(
        sequenceT(taskEither)(
            validateName(snapshot["name"]),
            validateDescription(snapshot["description"]),
            validateDate(snapshot["timestamp"]),
            validateSoftwareSystems(snapshot["softwareSystems"])
        ),
        map(toSnapshot)
    );

const _readSnapshot = (snapshotYaml: string): TaskEither<ArchiRepoError, Snapshot> =>
    pipe(
        tryCatch(() => Promise.resolve(yaml.load(snapshotYaml)), _ => ArchiRepoError.FileReadError),
        chain(validateSnapshot)
    );

const _writeSnapshot = (snapshot: Snapshot): string =>
    yaml.dump(snapshot);

export const snapshotReader = (): SnapshotReader => ({
    readSnapshot: _readSnapshot,
    writeSnapshot: _writeSnapshot
});