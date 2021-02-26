import { isNone, Option, some } from "fp-ts/Option";
import { Aggregate, AggregateCommand, AggregateEvent, AggregateId, AggregateType } from "./event";
import { serverId } from "./server";

export const deploymentId = (name: string): AggregateId<AggregateType.Deployment> => ({
    type: AggregateType.Deployment,
    id: name
});

export interface Deployment extends Aggregate<AggregateType.Deployment> {
    name: string;
    description: string;
    parentId: AggregateId<AggregateType.Server>;
}

export interface DeploymentCreated extends AggregateEvent<AggregateType.Deployment> {
    name: string;
    description: string;
    parentId: AggregateId<AggregateType.Server>;
}

const deploymentCreated = (timestamp: Date, serverName: string, name: string, description: string): DeploymentCreated => ({
    timestamp: timestamp,
    id: deploymentId(name),
    parentId: serverId(serverName),
    name: name,
    description: description,
    apply: (aggregate: Option<Deployment>): Option<Deployment> =>
        isNone(aggregate)
            ? some({
                timestamp: timestamp,
                id: deploymentId(name),
                parentId: serverId(serverName),
                name: name,
                description: description
            })
            : aggregate
});

export const mergeDeployment = (timestamp: Date, serverName: string, name: string, description: string): AggregateCommand<AggregateType.Deployment> =>
({
    id: deploymentId(name),
    execute: (aggregate: Option<Deployment>): AggregateEvent<AggregateType.Deployment>[] =>
        isNone(aggregate)
            ? [deploymentCreated(timestamp, serverName, name, description)]
            : []
});