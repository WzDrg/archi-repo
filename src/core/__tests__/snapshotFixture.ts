import { ContainerSnapshot, Snapshot, SoftwareSystemSnapshot } from "..";
import { ComponentSnapshot, ContainerSnapshotKind, DeploymentSnapshot, EnvironmentSnapshot, ServerSnapshot } from "../snapshots/snapshot";

export const createSnapshot = (softwareSystems: SoftwareSystemSnapshot[], environments: EnvironmentSnapshot[]): Snapshot => ({
    name: "name",
    description: "description",
    timestamp: new Date(),
    softwareSystems: softwareSystems,
    environments: environments
});

export const createSoftwareSystem = (containers: ContainerSnapshot[]): SoftwareSystemSnapshot => ({
    name: "software system",
    description: "description of software system",
    containers: containers,
    communications: []
});

export const createContainer = (components: ComponentSnapshot[]): ContainerSnapshot => ({
    name: "container",
    description: "description of container",
    kind: ContainerSnapshotKind.Applicative,
    components: components,
    communications: []
});

export const createComponent = (): ComponentSnapshot => ({
    name: "component",
    description: "description of component",
    communications: []
});

export const createEnvironment = (servers: ServerSnapshot[]): EnvironmentSnapshot => ({
    name: "environment",
    servers: servers
});

export const createServer = (deployments: DeploymentSnapshot[]): ServerSnapshot => ({
    name: "server",
    description: "Description of server",
    deployments: deployments
});

export const createDeployment = (): DeploymentSnapshot => ({
    name: "Deployment",
    description: "Description of deployment"
});