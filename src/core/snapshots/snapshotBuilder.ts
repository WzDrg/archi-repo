import { filter, isEmpty, map } from "fp-ts/Array";
import { groupBy } from "fp-ts/NonEmptyArray";
import { toArray } from "fp-ts/Record";
import { pipe } from "fp-ts/pipeable";
import { Component } from "../events/component";
import { Container, ContainerKind } from "../events/container";
import { AggregateEvent, AggregateType, buildAggregates } from "../events/event";
import { Server } from "../events/server";
import { SoftwareSystem } from "../events/softwareSystem";
import { ComponentSnapshot, ContainerSnapshot, ContainerSnapshotKind, DeploymentSnapshot, EnvironmentSnapshot, ServerSnapshot, Snapshot, SoftwareSystemSnapshot } from "./snapshot";
import { Deployment } from "../events/deployment";

export const createSnapshot = (timestamp: Date, name: string, description: string) =>
    (events: AggregateEvent<any>[]): Snapshot =>
        pipe(
            events,
            buildAggregatesCache,
            cache =>
            ({
                timestamp: timestamp,
                name: name,
                description: description,
                softwareSystems: map(toSoftwareSystemSnapshot(cache.containers, cache.components))(cache.softwareSystems),
                environments: toEnvironmentSnapshot(cache.servers, cache.deployments)
            }));

const buildAggregatesCache = (events: AggregateEvent<any>[]) =>
({
    softwareSystems: buildAggregates(AggregateType.SoftwareSystem)(events) as SoftwareSystem[],
    containers: buildAggregates(AggregateType.Container)(events) as Container[],
    components: buildAggregates(AggregateType.Component)(events) as Component[],
    servers: buildAggregates(AggregateType.Server)(events) as Server[],
    deployments: buildAggregates(AggregateType.Deployment)(events) as Deployment[]
});

const toSoftwareSystemSnapshot = (containers: Container[], components: Component[]) =>
    (softwareSystem: SoftwareSystem): SoftwareSystemSnapshot =>
    ({
        name: softwareSystem.name,
        description: softwareSystem.description,
        containers: pipe(
            containers,
            filter(container => container.parentId.id == softwareSystem.name),
            map(toContainerSnapshot(components))),
        communications: []
    });

const toContainerSnapshot = (components: Component[]) =>
    (container: Container): ContainerSnapshot =>
    ({
        name: container.name,
        description: container.description,
        kind: container.kind == ContainerKind.Applicative ? ContainerSnapshotKind.Applicative : ContainerSnapshotKind.Storage,
        components: pipe(
            components,
            filter(component => component.parentId.id == container.name),
            map(toComponentSnapshot)
        ),
        communications: []
    });

const toComponentSnapshot = (component: Component): ComponentSnapshot =>
({
    name: component.name,
    description: component.description,
    communications: []
});

const toEnvironmentSnapshot = (servers: Server[], deployments: Deployment[]): EnvironmentSnapshot[] =>
    isEmpty(servers)
        ? []
        : pipe(
            servers,
            groupBy(server => server.environment),
            toArray,
            map(([env, servers]) => ({
                name: env,
                servers: map(toServerSnapshot(deployments))(servers)
            }))
        );

const toServerSnapshot = (deployments: Deployment[]) =>
    (server: Server): ServerSnapshot =>
    ({
        name: server.name,
        description: server.description,
        deployments: pipe(
            deployments,
            filter(deployment => deployment.parentId.id === server.name),
            map(toDeployment)
        )
    });

const toDeployment = (deployment: Deployment): DeploymentSnapshot =>
({
    name: deployment.name,
    description: deployment.description
})