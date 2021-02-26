import { isNone, isSome, Option, some } from "fp-ts/Option";
import { Aggregate, AggregateCommand, AggregateEvent, AggregateId, AggregateType } from "./event";

export const serverId = (name: string): AggregateId<AggregateType.Server> =>
({
    type: AggregateType.Server,
    id: name
});

export interface Server extends Aggregate<AggregateType.Server> {
    name: string;
    description: string;
    environment: string;
}

export interface ServerCreated extends AggregateEvent<AggregateType.Server> {
    name: string;
    description: string;
    environment: string;
}

const serverCreated = (timestamp: Date, name: string, description: string, environment: string): ServerCreated =>
({
    timestamp: timestamp,
    id: serverId(name),
    name: name,
    description: description,
    environment: environment,
    apply: (aggregate: Option<Server>): Option<Server> =>
        isNone(aggregate)
            ? some({
                timestamp: timestamp,
                id: serverId(name),
                name: name,
                description: description,
                environment: environment
            })
            : aggregate
});

export const mergeServer = (timestamp: Date, name: string, description: string, environment: string): AggregateCommand<AggregateType> =>
({
    id: serverId(name),
    execute: (aggregate: Option<Server>): AggregateEvent<AggregateType.Server>[] =>
        isNone(aggregate)
            ? [serverCreated(timestamp, name, description, environment)]
            : []
});