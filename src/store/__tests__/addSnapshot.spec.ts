import { memoryStore } from "../memoryStore";
import { createSnapshot } from "./snapshotFixture";

describe("Add snapshot", () => {

    it("should add a new snapshot to an empty store", async () => {
        const store = memoryStore();
        const snapshot = createSnapshot([], []);
        const result = await store.addSnapshot(snapshot)();
        expect(result).toEqualRight(expect.objectContaining({
            name: snapshot.name
        }));
        const snapshotCount = await store.getCount()();
        expect(snapshotCount).toEqualRight(1);
    });
});