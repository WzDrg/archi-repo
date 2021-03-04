import { createSnapshot } from "./snapshotFixture"
import { memoryStore } from "../memoryStore";

describe("Add snapshot", () => {

    it("should add a new snapshot to an empty store", async () => {
        const store = memoryStore();
        const snapshot = createSnapshot();
        const result = await store.addSnapshot(snapshot)();
        expect(result).toEqualRight(expect.objectContaining({ snapshot: snapshot, timestamp: snapshot.timestamp }));
        const snapshotCount = await store.getCount()();
        expect(snapshotCount).toEqualRight(1);
    });
});