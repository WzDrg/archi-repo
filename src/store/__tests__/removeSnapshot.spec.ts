import { pipe } from "fp-ts/lib/pipeable";
import { chain } from "fp-ts/lib/TaskEither";
import { memoryStore } from "../memoryStore";
import { createSnapshot } from "./snapshotFixture";

describe("Remove a snaphot", () => {
    it("should remove a snapshot from the storage", async () => {
        const storage = memoryStore();
        const result = await pipe(
            createSnapshot(),
            storage.addSnapshot,
            chain(snapshot => storage.removeSnapshot(snapshot.id)),
            chain(_ => storage.getCount()))();
        expect(result).toEqualRight(0);
    });
});