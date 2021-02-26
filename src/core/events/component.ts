import { isNone, Option, some } from "fp-ts/Option";
import { containerId } from "./container";
import { Aggregate, AggregateCommand, AggregateEvent, AggregateId, AggregateType } from "./event"

export const componentId = (componentName: string): AggregateId<AggregateType.Component> =>
    ({ type: AggregateType.Component, id: componentName });

export interface Component extends Aggregate<AggregateType.Component> {
    parentId: AggregateId<AggregateType.Container>;
    name: string;
    description: string;
}

export interface ComponentCreated extends AggregateEvent<AggregateType.Component> {
    parentId: AggregateId<AggregateType.Container>,
    name: string,
    description: string
}

const componentCreated = (timestamp: Date, containerName: string, name: string, description: string): ComponentCreated => ({
    timestamp: timestamp,
    id: componentId(name),
    parentId: containerId(containerName),
    name: name,
    description: description,
    apply: (aggregate: Option<Component>) => isNone(aggregate)
        ? some({
            id: componentId(name),
            parentId: containerId(containerName),
            timestamp: timestamp,
            name: name,
            description: description
        })
        : aggregate
});

export const mergeComponent = (timestamp: Date, containerName: string, name: string, description: string): AggregateCommand<AggregateType.Component> =>
({
    id: componentId(name),
    execute: (aggregate: Option<Component>) => isNone(aggregate)
        ? [componentCreated(timestamp, containerName, name, description)]
        : []
});