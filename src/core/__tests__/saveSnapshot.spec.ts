import { right } from "fp-ts/lib/TaskEither";
import { CoreServices } from "../coreServices";
import { coreServices } from "../index";
import { SnapshotStorage } from "../proxy";
import { createSnapshot, createSoftwareSystem } from "./snapshotFixture";

describe("Save snapshot", () => {
    let addSnapshot = jest.fn();
    let services: CoreServices;

    beforeEach(() => {
        let storage: SnapshotStorage = {
            getCount: jest.fn(),
            getSnapshot: jest.fn(),
            addSnapshot: addSnapshot,
            removeSnapshot: jest.fn(),
            enableSnapshot: jest.fn(),
            disableSnapshot: jest.fn(),
            getSnapshotsBefore: jest.fn()
        };
        services = coreServices(storage);
    });

    it("should save a simple snapshot", async () => {
        let softwareSystem = createSoftwareSystem([]);
        let snapshot = createSnapshot([softwareSystem], []);
        let snapshotSummary = { id: "123", name: snapshot.name, timestamp: snapshot.timestamp };
        addSnapshot.mockReturnValueOnce(right(snapshotSummary));
        let result = await services.saveSnapshot(snapshot)();
        expect(result).toEqualRight(snapshotSummary);
    });

});