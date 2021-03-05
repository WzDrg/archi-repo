import { pipe } from "fp-ts/lib/pipeable";
import { some } from "fp-ts/Option";
import { chain, map } from "fp-ts/lib/TaskEither";
import { memoryStore } from "../memoryStore";

describe("Enable and disable snapshots", () => {
    it("should enable newly added snapshot", async () => {
        const storage = memoryStore();
        const result = await storage.addSnapshot("snapshot", "...", new Date(), "...")();
        expect(result).toEqualRight(expect.objectContaining({ enabled: true }));
    });

    it("should disable an existing snapshot", async () => {
        const storage = memoryStore();
        const result = await pipe(
            storage.addSnapshot("snapshot", "description", new Date(), "..."),
            map(snapshot => snapshot.id),
            chain(storage.disableSnapshot),
            chain(storage.getSnapshot)
        )();
        expect(result).toEqualRight(some(expect.objectContaining({ enabled: false })));
    });

    it("should enable a disabled snapshot", async () => {
        const storage = memoryStore();
        const result = await pipe(
            storage.addSnapshot("snapshot", "...", new Date(), "..."),
            map(snapshot => snapshot.id),
            chain(storage.disableSnapshot),
            chain(storage.enableSnapshot),
            chain(storage.getSnapshot)
        )();
        expect(result).toEqualRight(some(expect.objectContaining({ enabled: true })));
    });
});