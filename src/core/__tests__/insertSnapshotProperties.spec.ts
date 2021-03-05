import * as fc from "fast-check";
import { pipe } from "fp-ts/pipeable";
import { chain, map } from "fp-ts/TaskEither";
import { memoryStore } from "../../store/memoryStore";
import { CoreServices } from "../coreServices";
import { coreServices } from "../index";
import { snapshotArbitrary } from "./snapshotArbitrary";

describe("Merge snapshot properties", () => {

    let services: CoreServices;

    beforeEach(() => {
        services = coreServices(memoryStore());
    });

    it("should generate an event for each item in the snapshot", () => fc.assert(
        fc.asyncProperty(
            snapshotArbitrary, async (snapshot) => {
                let result = await pipe(
                    snapshot,
                    services.saveSnapshot,
                    map(summary => summary.id),
                    chain(services.getSnapshot)
                )();
                expect(result).toBeRight();
                expect(result).toEqualRight(expect.objectContaining(snapshot));
            }
        ))
    );

});