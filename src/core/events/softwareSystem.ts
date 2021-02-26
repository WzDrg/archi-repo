import { isNone, Option, some } from "fp-ts/Option";
import { Aggregate, AggregateCommand, AggregateEvent, AggregateId, AggregateType } from "./event";

export const softwareSystemId = (id: string): AggregateId<AggregateType.SoftwareSystem> => ({
    type: AggregateType.SoftwareSystem,
    id: id
})

export interface SoftwareSystem extends Aggregate<AggregateType.SoftwareSystem> {
    name: string;
    description: string;
}

export type SoftwareSystemCreated = AggregateEvent<AggregateType.SoftwareSystem> & {
    name: string;
    description: string;
}

const softwareSystemCreated = (timestamp: Date, name: string, description: string): SoftwareSystemCreated =>
({
    timestamp: timestamp,
    id: softwareSystemId(name),
    name: name,
    description: "",
    apply: (aggregate: Option<SoftwareSystem>) =>
        isNone(aggregate)
            ? some({
                timestamp: timestamp,
                id: softwareSystemId(name),
                name: name,
                description: description,
                containers: [],
                communications: []
            }) : aggregate
});

export const mergeSoftwareSystem = (timestamp: Date, name: string, description: string): AggregateCommand<AggregateType.SoftwareSystem> =>
({
    id: softwareSystemId(name),
    execute: (aggregate: Option<SoftwareSystem>) =>
        isNone(aggregate)
            ? [softwareSystemCreated(timestamp, name, description)]
            : [],
});