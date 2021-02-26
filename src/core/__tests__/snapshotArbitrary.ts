import * as fc from "fast-check";
import { Arbitrary } from "fast-check";
import { Snapshot, SoftwareSystemSnapshot, ContainerSnapshot, ContainerSnapshotKind } from "..";
import { ComponentSnapshot, EnvironmentSnapshot, ServerSnapshot } from "../snapshots/snapshot";

export const serverArbitrary: Arbitrary<ServerSnapshot> =
    fc.record({
        name: fc.string({ minLength: 5 }),
        description: fc.string(),
        deployments: fc.constant([])
    });

export const environmentArbitrary: Arbitrary<EnvironmentSnapshot> =
    fc.record({
        name: fc.string({ minLength: 5 }),
        servers: fc.array(serverArbitrary)
    });

export const componentArbitrary: Arbitrary<ComponentSnapshot> =
    fc.record({
        name: fc.string({ minLength: 5 }),
        description: fc.string(),
        communications: fc.constant([])
    });

export const containerArbitrary: Arbitrary<ContainerSnapshot> =
    fc.record({
        name: fc.string({ minLength: 5 }),
        description: fc.string(),
        kind: fc.constant(ContainerSnapshotKind.Applicative),
        components: fc.array(componentArbitrary),
        communications: fc.constant([])
    });

export const softwareSystemArbitrary: Arbitrary<SoftwareSystemSnapshot> =
    fc.record({
        name: fc.string({ minLength: 5 }),
        description: fc.string(),
        containers: fc.array(containerArbitrary),
        communications: fc.constant([])
    });

export const snapshotArbitrary: Arbitrary<Snapshot> =
    fc.record({
        timestamp: fc.constant(new Date()),
        name: fc.string({ minLength: 5 }),
        description: fc.string(),
        softwareSystems: fc.array(softwareSystemArbitrary),
        environments: fc.constant([])
    });