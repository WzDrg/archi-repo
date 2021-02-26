import { flatten, map } from "fp-ts/Array";
import { pipe } from "fp-ts/pipeable";
import { mergeComponent } from "../events/component";
import { ContainerKind, mergeContainer } from "../events/container";
import { mergeDeployment } from "../events/deployment";
import { AggregateCommand } from "../events/event";
import { mergeServer } from "../events/server";
import { mergeSoftwareSystem } from "../events/softwareSystem";
import { ComponentSnapshot, ContainerSnapshot, ContainerSnapshotKind, DeploymentSnapshot, EnvironmentSnapshot, ServerSnapshot, Snapshot, SoftwareSystemSnapshot } from "./snapshot";

const deploymentsToCommands = (timestamp: Date, serverName: string) =>
    (deployments: DeploymentSnapshot[]) =>
        pipe(
            deployments,
            map(deployment => [mergeDeployment(timestamp, serverName, deployment.name, deployment.description)]),
            flatten
        );

const serversToCommands = (timestamp: Date, environment: string) =>
    (servers: ServerSnapshot[]) =>
        pipe(
            servers,
            map(server => [
                mergeServer(timestamp, server.name, server.description, environment),
                ...deploymentsToCommands(timestamp, server.name)(server.deployments)
            ]),
            flatten
        );

const environmentsToCommands = (timestamp: Date, environments: EnvironmentSnapshot[]) =>
    pipe(
        environments,
        map(env => [...serversToCommands(timestamp, env.name)(env.servers)]),
        flatten
    );

const componentsToCommands = (timestamp: Date, containerName: string) =>
    map((component: ComponentSnapshot) =>
        mergeComponent(timestamp, containerName, component.name, component.description));

const toContainerKind = (kind: ContainerSnapshotKind) =>
    kind === ContainerSnapshotKind.Applicative ? ContainerKind.Applicative : ContainerKind.Storage;

const containersToCommand = (timestamp: Date, softwareSystemName: string) =>
    (containers: ContainerSnapshot[]) =>
        pipe(
            containers,
            map((container: ContainerSnapshot) =>
                [
                    mergeContainer(timestamp, toContainerKind(container.kind), softwareSystemName, container.name, container.description),
                    ...componentsToCommands(timestamp, container.name)(container.components)
                ]),
            flatten
        );

const softwareSystemToCommand = (timestamp: Date) =>
    (softwareSystem: SoftwareSystemSnapshot): AggregateCommand<any>[] =>
        [
            mergeSoftwareSystem(timestamp, softwareSystem.name, softwareSystem.description),
            ...containersToCommand(timestamp, softwareSystem.name)(softwareSystem.containers)
        ];

const softwareSystemsToCommands = (timestamp: Date) =>
    (softwareSystems: SoftwareSystemSnapshot[]) =>
        pipe(
            softwareSystems,
            map(softwareSystemToCommand(timestamp)),
            flatten
        );

export const snapshotToCommands = (snapshot: Snapshot): AggregateCommand<any>[] =>
    [
        ...softwareSystemsToCommands(snapshot.timestamp)(snapshot.softwareSystems),
        ...environmentsToCommands(snapshot.timestamp, snapshot.environments)
    ];

