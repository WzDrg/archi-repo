import { isNone, Option, some } from "fp-ts/Option";
import { Aggregate, AggregateEvent, AggregateId, AggregateType } from "./event";
import { softwareSystemId } from "./softwareSystem";

export const containerId = (id: string): AggregateId<AggregateType.Container> =>
({
    type: AggregateType.Container,
    id: id
});

export enum ContainerKind {
    Applicative,
    Storage
}

export interface Container extends Aggregate<AggregateType.Container> {
    parentId: AggregateId<AggregateType.SoftwareSystem>,
    kind: ContainerKind,
    name: string,
    description: string
};

export interface ContainerCreated extends AggregateEvent<AggregateType.Container> {
    parentId: AggregateId<AggregateType.SoftwareSystem>,
    kind: ContainerKind,
    name: string,
    description: string
}

const containerCreated = (timestamp: Date, kind: ContainerKind, parentName: string, name: string, description: string): ContainerCreated => ({
    id: containerId(name),
    timestamp: timestamp,
    kind: kind,
    parentId: softwareSystemId(parentName),
    name: name,
    description: description,
    apply: (aggregate: Option<Container>): Option<Container> =>
        isNone(aggregate)
            ? some({
                timestamp: timestamp,
                id: containerId(name),
                kind: kind,
                parentId: softwareSystemId(parentName),
                name: name,
                description: description
            })
            : aggregate
});

export const mergeContainer = (timestamp: Date, kind: ContainerKind, parentName: string, name: string, description: string) => ({
    id: containerId(name),
    execute: (aggregate: Option<Aggregate<AggregateType.Container>>) =>
        isNone(aggregate)
            ? [containerCreated(timestamp, kind, parentName, name, description)]
            : []
})

