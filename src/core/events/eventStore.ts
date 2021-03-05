import { filter } from "fp-ts/Array";
import { TaskEither, right, map } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/pipeable";
import { ArchiRepoError } from "../error";
import { AggregateEvent, AggregateId, AggregateType } from "./event";

export interface EventStore {
    getAllEvents: () => TaskEither<ArchiRepoError, AggregateEvent<any>[]>;
    getEventsById: <T extends AggregateType>(id: AggregateId<T>) => TaskEither<ArchiRepoError, AggregateEvent<T>[]>;
    getEventsBefore: (timestamp: Date) => TaskEither<ArchiRepoError, AggregateEvent<any>[]>;
    storeEvents: (events: AggregateEvent<any>[]) => TaskEither<ArchiRepoError, AggregateEvent<any>[]>;
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