import { pipe } from "fp-ts/lib/pipeable";
import { some } from "fp-ts/Option";
import { chain, map } from "fp-ts/lib/TaskEither";
import { memoryStore } from "../memoryStore";
import { createSnapshot } from "./snapshotFixture";

describe("Enable and disable snapshots", () => {
    it("should enable newly added snapshot", async () => {
        const storage = memoryStore();
        const result = await storage.addSnapshot(createSnapshot())();
        expect(result).toEqualRight(expect.objectContaining({ enabled: true }));
    });

    it("should disable an existing snapshot", async () => {
        const storage = memoryStore();
        const result = await pipe(
            createSnapshot(),
            storage.addSnapshot,
            map(snapshot => snapshot.id),
            chain(storage.disableSnapshot),
            chain(storage.getSnapshot)
        )();
        expect(result).toEqualRight(some(expect.objectContaining({ enabled: false })));
    });

    it("should enable a disabled snapshot", async () => {
        const storage = memoryStore();
        const result = await pipe(
            createSnapshot(),
            storage.addSnapshot,
            map(snapshot => snapshot.id),
            chain(storage.disableSnapshot),
            chain(storage.enableSnapshot),
            chain(storage.getSnapshot)
        )();
        expect(result).toEqualRight(some(expect.objectContaining({ enabled: true })));
    });
});