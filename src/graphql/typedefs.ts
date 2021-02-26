import { gql } from "apollo-server";

export default gql`
    scalar DateTime

    type Deployment {
        name: String!
        description: String!
    }

    type Environment {
        name: String!
        deployments: [Deployment]
    }

    type Container {
        name: String!
        description: String!
    }

    type SoftwareSystem {
        name: String!
        description: String!
    }

    type Snapshot {
        timestamp: DateTime
        name: String!
        description: String!
        softwareSystems: [SoftwareSystem]
    }

    type Query {
        snapshot(timestamp:DateTime): Snapshot
    }
`;