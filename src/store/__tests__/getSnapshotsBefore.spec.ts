import { memoryStore } from "../memoryStore";
import { createSnapshot } from "./snapshotFixture";

describe("Get snapshots before", () => {
    it("should retrieve no snapshots when storage is empty", async () => {
        const storage = memoryStore();
        const result = await storage.getSnapshotsBefore(new Date("2021-03-01"))();
        expect(result).toEqualRight([]);
    });

    it("should retrieve a single snapshot before a given date", async () => {
        const storage = memoryStore();
        const snapshot = { ...createSnapshot([], []), timestamp: new Date("2021-02-01") };
        await storage.addSnapshot(snapshot);
        const result = await storage.getSnapshotsBefore(new Date("2021-03-01"))();
        expect(result).toEqualRight(expect.arrayContaining([expect.objectContaining({ name: snapshot.name })]));
    });
});