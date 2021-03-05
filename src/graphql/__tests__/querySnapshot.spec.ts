import { gql } from "apollo-server";
import { ApolloServerTestClient, createTestClient } from "apollo-server-testing";
import { right } from "fp-ts/IOEither";
import { CoreServices } from "../../core/coreServices";
import { createServer } from "../server";

describe("Query Snapshot", () => {
    let newSnapshotAt = jest.fn();
    let client: ApolloServerTestClient;

    beforeEach(() => {
        const coreServices: CoreServices = {
            saveSnapshot: jest.fn(),
            newSnapshotAt: newSnapshotAt,
            enableSnapshot: jest.fn(),
            disableSnapshot: jest.fn(),
            getAllSnapshots: jest.fn(),
            getSnapshot: jest.fn(),
            removeSnapshot: jest.fn(),
            updateSnapshot: jest.fn()
        }
        const server = createServer(coreServices);
        client = createTestClient(server);
    });

    it("should retrieve a simple snapshot", async () => {
        newSnapshotAt.mockReturnValueOnce(right({
            timestamp: new Date(),
            name: "snapshot",
            description: "Description of the snapshot",
            softwareSystems: [],
            environments: []
        }));
        const querySnapshot = gql`
            query {
                snapshot(timestamp:"2021-02-28") {
                    timestamp
                }
            }
        `;
        const response = await client.query({ query: querySnapshot });
        expect(response.data).toBeDefined();
        expect(response.data.snapshot).toBeDefined();
    });

});