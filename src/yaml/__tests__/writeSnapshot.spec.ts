import { Snapshot } from "../../core";
import { snapshotReader } from "../reader";

const snapshotYaml = `name: snapshot
description: description of snapshot
timestamp: 2021-03-01T00:00:00.000Z
softwareSystems: []
environments: []
`;

describe("Write snapshot", () => {
    it("should convert a snapshot to yaml", () => {
        const snapshot: Snapshot = {
            name: "snapshot",
            description: "description of snapshot",
            timestamp: new Date("2021-03-01"),
            softwareSystems: [],
            environments: []
        };
        const reader = snapshotReader();
        const result = reader.writeSnapshot(snapshot);
        expect(result).toEqual(snapshotYaml);
    });
});