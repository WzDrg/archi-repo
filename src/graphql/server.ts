import { DateTime } from "./dateTimeScalarType";
import { ApolloServer } from "apollo-server";
import { CoreServices } from "../core/coreServices";
import typeDefs from "./typedefs";
import { Snapshot } from "../core";
import { pipe } from "fp-ts/lib/pipeable";
import { getOrElseW } from "fp-ts/Either";

const resolveSnapshot = async (coreServices: CoreServices): Promise<Error | Snapshot> =>
    pipe(
        await coreServices.newSnapshotAt(new Date())(),
        getOrElseW(_ => ({ name: "error", message: "" }))
    );

interface CoreServicesContext {
    coreServices: CoreServices;
}

const resolvers = {
    DateTime: DateTime,
    Query: {
        snapshot: (obj, args, context: CoreServicesContext, info) => resolveSnapshot(context.coreServices)
    }
};

export const createServer = (coreServices: CoreServices) =>
    new ApolloServer({
        resolvers: resolvers,
        typeDefs: typeDefs,
        context: () => ({ coreServices: coreServices })
    });
