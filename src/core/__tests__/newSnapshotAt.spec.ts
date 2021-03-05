import { coreServices, memoryEventStore } from "..";
import { memoryStore } from "../../store/memoryStore";
import { createContainer, createDeployment, createEnvironment, createServer, createSnapshot, createSoftwareSystem } from "./snapshotFixture";

describe("Create a new snapshot", () => {
    it("should build a snapshot with a single software system", async () => {
        let softwareSystem = createSoftwareSystem([])
        let snapshot = createSnapshot([softwareSystem], []);
        let services = coreServices(memoryStore());
        await services.saveSnapshot(snapshot)();
        let result = await services.newSnapshotAt(snapshot.timestamp)();
        expect(result).toEqualRight(expect.objectContaining({
            timestamp: snapshot.timestamp,
            softwareSystems: snapshot.softwareSystems,
            environments: snapshot.environments
        }));
    });

    it("should build a snapshot with a single container", async () => {
        let container = createContainer([]);
        let softwareSystem = createSoftwareSystem([container])
        let snapshot = createSnapshot([softwareSystem], []);
        let services = coreServices(memoryStore());
        await services.saveSnapshot(snapshot)();
        let result = await services.newSnapshotAt(snapshot.timestamp)();
        expect(result).toEqualRight(expect.objectContaining({
            timestamp: snapshot.timestamp,
            softwareSystems: snapshot.softwareSystems,
            environments: snapshot.environments
        }));
    });

    it("should create a new snapshot with a single server", async () => {
        let server = createServer([]);
        let environment = createEnvironment([server]);
        let snapshot = createSnapshot([], [environment]);
        let services = coreServices(memoryStore());
        await services.saveSnapshot(snapshot)();
        let result = await services.newSnapshotAt(snapshot.timestamp)();
        expect(result).toEqualRight(expect.objectContaining({
            timestamp: snapshot.timestamp,
            softwareSystems: snapshot.softwareSystems,
            environments: snapshot.environments
        }));
    });

    it("should create a new snapshot with a single deployment", async () => {
        let deployment = createDeployment();
        let server = createServer([deployment]);
        let environment = createEnvironment([server]);
        let snapshot = createSnapshot([], [environment]);
        let services = coreServices(memoryStore());
        await services.saveSnapshot(snapshot)();
        let result = await services.newSnapshotAt(snapshot.timestamp)();
        expect(result).toEqualRight(expect.objectContaining({
            timestamp: snapshot.timestamp,
            softwareSystems: snapshot.softwareSystems,
            environments: snapshot.environments
        }));
    });
});