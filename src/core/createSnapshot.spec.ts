import { coreServices, memoryEventStore } from ".";
import { createContainer, createDeployment, createEnvironment, createServer, createSnapshot, createSoftwareSystem } from "./snapshotFixture";

describe("Create a new snapshot", () => {
    it("should build a snapshot with a single software system", () => {
        let softwareSystem = createSoftwareSystem([])
        let snapshot = createSnapshot([softwareSystem], []);
        let services = coreServices(memoryEventStore());
        services.insertSnapshot(snapshot)();
        let result = services.createSnapshotAt(snapshot.timestamp, snapshot.name, snapshot.description)();
        expect(result).toEqualRight(snapshot);
    });

    it("should build a snapshot with a single container", () => {
        let container = createContainer([]);
        let softwareSystem = createSoftwareSystem([container])
        let snapshot = createSnapshot([softwareSystem], []);
        let services = coreServices(memoryEventStore());
        services.insertSnapshot(snapshot)();
        let result = services.createSnapshotAt(snapshot.timestamp, snapshot.name, snapshot.description)();
        expect(result).toEqualRight(snapshot);
    });

    it("should create a new snapshot with a single server", () => {
        let server = createServer([]);
        let environment = createEnvironment([server]);
        let snapshot = createSnapshot([], [environment]);
        let services = coreServices(memoryEventStore());
        services.insertSnapshot(snapshot)();
        let result = services.createSnapshotAt(snapshot.timestamp, snapshot.name, snapshot.description)();
        expect(result).toEqualRight(snapshot);
    });

    it("should create a new snapshot with a single deployment", () => {
        let deployment = createDeployment();
        let server = createServer([deployment]);
        let environment = createEnvironment([server]);
        let snapshot = createSnapshot([], [environment]);
        let services = coreServices(memoryEventStore());
        services.insertSnapshot(snapshot)();
        let result = services.createSnapshotAt(snapshot.timestamp, snapshot.name, snapshot.description)();
        expect(result).toEqualRight(snapshot);
    });
});