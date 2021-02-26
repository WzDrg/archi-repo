import * as fc from "fast-check";
import { coreServices, memoryEventStore } from "../index";
import { snapshotArbitrary } from "./snapshotArbitrary";

describe("Merge snapshot properties", () => {

    it("should generate an event for each item in the snapshot", () => fc.assert(
        fc.property(
            snapshotArbitrary, (snapshot) => {
                let services = coreServices(memoryEventStore());
                let events = services.insertSnapshot(snapshot)();
                expect(events).toBeRight();
                let result = services.createSnapshotAt(snapshot.timestamp, snapshot.name, snapshot.description)();
                expect(result).toBeRight();
                expect(result).toEqualRight(snapshot);
            }
        ))
    );

});