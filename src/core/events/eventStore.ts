import { filter } from "fp-ts/Array";
import { IOEither, right, map } from "fp-ts/IOEither";
import { pipe } from "fp-ts/pipeable";
import { ArchiRepoError } from "../error";
import { AggregateEvent, AggregateId, AggregateType } from "./event";

export interface EventStore {
    getAllEvents: () => IOEither<ArchiRepoError, AggregateEvent<any>[]>;
    getEventsById: <T extends AggregateType>(id: AggregateId<T>) => IOEither<ArchiRepoError, AggregateEvent<T>[]>;
    getEventsBefore: (timestamp: Date) => IOEither<ArchiRepoError, AggregateEvent<any>[]>;
    storeEvents: (events: AggregateEvent<any>[]) => IOEither<ArchiRepoError, AggregateEvent<any>[]>;
}

const _getAllEvents = (events: AggregateEvent<any>[]) =>
    () =>
        right(events);

const _getEventsById = (events: AggregateEvent<any>[]) =>
    <T extends AggregateType>(id: AggregateId<T>) =>
        pipe(
            right(events),
            map(filter(e => e.id === id))
        );

const _getEventsBefore = (events: AggregateEvent<any>[]) =>
    (timestamp: Date) =>
        pipe(
            right(events),
            map(filter(e => e.timestamp.getTime() <= timestamp.getTime()))
        );

const _storeEvents = (events: AggregateEvent<any>[]) =>
    (new_events: AggregateEvent<any>[]) =>
        pipe(
            events.push(...new_events),
            _ => right(events)
        );

export const memoryEventStore = (): EventStore => {
    let events = new Array<AggregateEvent<any>>();
    return {
        getAllEvents: _getAllEvents(events),
        getEventsById: _getEventsById(events),
        getEventsBefore: _getEventsBefore(events),
        storeEvents: _storeEvents(events)
    }
}