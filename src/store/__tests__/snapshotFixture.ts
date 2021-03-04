import { Snapshot } from "../../core";

export const createSnapshot = (): Snapshot => ({
    name: "name",
    description: "description",
    timestamp: new Date(),
    softwareSystems: [],
    environments: []
});
