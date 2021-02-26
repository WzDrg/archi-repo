import { coreServices, memoryEventStore } from "../index";
import { createComponent, createContainer, createDeployment, createEnvironment, createServer, createSnapshot, createSoftwareSystem } from "./snapshotFixture";

describe("Insert snapshot", () => {
    it("should merge a simple snapshot", () => {
        let softwareSystem = createSoftwareSystem([]);
        let snapshot = createSnapshot([softwareSystem], []);
        let events = coreServices(memoryEventStore()).insertSnapshot(snapshot)();
        expect(events).toEqualRight(expect.arrayContaining([expect.objectContaining({ name: softwareSystem.name })]));
    });

    it("should merge a container", () => {
        let container = createContainer([]);
        let softwareSystem = createSoftwareSystem([container]);
        let snapshot = createSnapshot([softwareSystem], []);
        let events = coreServices(memoryEventStore()).insertSnapshot(snapshot)();
        expect(events).toEqualRight(expect.arrayContaining([expect.objectContaining({
            name: container.name
        })]));
    });

    it("should merge a component", () => {
        let component = createComponent();
        let container = createContainer([component]);
        let softwareSystem = createSoftwareSystem([container]);
        let snapshot = createSnapshot([softwareSystem], []);
        let events = coreServices(memoryEventStore()).insertSnapshot(snapshot)();
        expect(events).toEqualRight(expect.arrayContaining([expect.objectContaining({
            name: component.name,
            description: component.description
        })]));
    });

    it("should merge an environment with a server", () => {
        let server = createServer([]);
        let environment = createEnvironment([server]);
        let snapshot = createSnapshot([], [environment]);
        let events = coreServices(memoryEventStore()).insertSnapshot(snapshot)();
        expect(events).toEqualRight(expect.arrayContaining([expect.objectContaining({
            name: server.name,
            description: server.description,
            environment: environment.name
        })]));
    });

    it("should merge a deployment", () => {
        let deployment = createDeployment();
        let server = createServer([deployment]);
        let environment = createEnvironment([server]);
        let snapshot = createSnapshot([], [environment]);
        let events = coreServices(memoryEventStore()).insertSnapshot(snapshot)();
        expect(events).toEqualRight(expect.arrayContaining([expect.objectContaining({
            name: server.name,
            description: server.description,
            environment: environment.name
        })]));
    });
});