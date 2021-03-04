import { Snapshot } from "../../core";
import { snapshotReader } from "../reader";

const snapshotYaml = `
name: "snapshot"
description: "Description of the snapshot"
timestamp: "2021-03-01"
softwareSystems: 
environments:
`;

const snapshotYamlWithSoftwareSystems = `
name: "snapshot2"
description: "Description of snapshot 2"
timestamp: "2021-03-02"
softwareSystems:
- name: "SoftwareSystem"
  description: "Description of software system"
environments:
`;

describe("read snapshot", () => {
    it("should read a snapshot file", async () => {
        const snapshot: Snapshot = {
            name: "snapshot",
            description: "Description of the snapshot",
            timestamp: new Date("2021-03-01"),
            softwareSystems: [],
            environments: []
        }
        const reader = snapshotReader();
        const result = await reader.readSnapshot(snapshotYaml)();
        expect(result).toEqualRight(snapshot);
    });

    it("should read a snapshot file", async () => {
        const snapshot: Snapshot = {
            name: "snapshot2",
            description: "Description of snapshot 2",
            timestamp: new Date("2021-03-02"),
            softwareSystems: [
                {
                    name: "SoftwareSystem",
                    description: "Description of software system",
                    containers: [],
                    communications: []
                }
            ],
            environments: []
        }
        const reader = snapshotReader();
        const result = await reader.readSnapshot(snapshotYamlWithSoftwareSystems)();
        expect(result).toEqualRight(snapshot);
    });

});