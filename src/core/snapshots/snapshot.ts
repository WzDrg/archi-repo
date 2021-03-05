export type SnapshotId = string;

export interface SnapshotSummary {
    id: SnapshotId;
    name: string;
    timestamp: Date;
    enabled: boolean;
}
export interface StoredSnapshot extends Snapshot {
    id: SnapshotId;
    enabled: boolean;
}

export interface Snapshot {
    name: string,
    description: string,
    timestamp: Date;
    softwareSystems: SoftwareSystemSnapshot[];
    environments: EnvironmentSnapshot[];
}

interface Communication {
    name: string,
    description: string,
    target: SoftwareSystemSnapshot | ContainerSnapshot | ComponentSnapshot
}

export interface SoftwareSystemSnapshot {
    name: string,
    description: string,
    containers: ContainerSnapshot[];
    communications: Communication[];
}

export enum ContainerSnapshotKind {
    Applicative,
    Storage
}

export interface ContainerSnapshot {
    name: string,
    description: string,
    kind: ContainerSnapshotKind;
    components: ComponentSnapshot[];
    communications: Communication[];
}

export interface ComponentSnapshot {
    name: string,
    description: string,
    communications: Communication[];
}


export interface EnvironmentSnapshot {
    name: string,
    servers: ServerSnapshot[];
}

export interface ServerSnapshot {
    name: string,
    description: string,
    deployments: DeploymentSnapshot[];
}

export interface DeploymentSnapshot {
    name: string,
    description: string,

}