import { ApolloServer } from "apollo-server";
import { pipe } from "fp-ts/lib/pipeable";
import { coreServices, memoryEventStore } from "./core";
import { createServer } from "./graphql/server";

const server = pipe(
    memoryEventStore(),
    coreServices,
    createServer
);

server.listen().then(({ url }) => console.log(`Server started at ${url}.`));