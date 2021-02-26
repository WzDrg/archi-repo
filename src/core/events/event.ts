import { compact, filter, isEmpty, reduce } from "fp-ts/Array";
import { fromEquals } from "fp-ts/Eq";
import { flow } from "fp-ts/function";
import { group, map } from "fp-ts/NonEmptyArray";
import { pipe } from "fp-ts/pipeable";
import { none, Option } from "fp-ts/Option";

export enum AggregateType {
    SoftwareSystem,
    Container,
    Component,
    Server,
    Deployment
}

export type AggregateId<T extends AggregateType> = {
    type: T;
    id: string;
}

export const eqAggregateId = (id1: AggregateId<any>, id2: AggregateId<any>) =>
    id1.id === id2.id && id1.type === id2.type;

export interface Aggregate<T extends AggregateType> {
    id: AggregateId<T>;
    timestamp: Date;
}

export interface AggregateEvent<T extends AggregateType> {
    id: AggregateId<T>;
    timestamp: Date;
    apply: (aggregate: Option<Aggregate<T>>) => Option<Aggregate<T>>;
}

export type AggregateCommand<T extends AggregateType> = {
    id: AggregateId<T>;
    execute: (aggregate: Option<Aggregate<T>>) => AggregateEvent<T>[];
}

export const buildAggregate = <T extends AggregateType>(events: AggregateEvent<T>[]) =>
    reduce(none as Option<Aggregate<T>>, (aggregate: Option<Aggregate<T>>, event: AggregateEvent<T>) =>
        event.apply(aggregate))(events);

export const buildAggregates = <T extends AggregateType>(aggregateType: T) =>
    (events: AggregateEvent<any>[]): Aggregate<T>[] =>
        pipe(
            events,
            filter(event => event.id.type === aggregateType),
            e => isEmpty(e) ? []
                : pipe(
                    e,
                    group(fromEquals((e1: AggregateEvent<any>, e2: AggregateEvent<any>) => eqAggregateId(e1.id, e2.id))),
                    map(buildAggregate),
                    compact,
                )
        );

export const applyEvent = <T extends AggregateType>(event: AggregateEvent<T>) =>
    flow(buildAggregate, event.apply);

export const executeCommand = <T extends AggregateType>(command: AggregateCommand<T>) =>
    flow(buildAggregate, command.execute);
