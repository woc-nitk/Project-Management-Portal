const {GraphQLServer} = require("graphql-yoga");
const GQLresolvers = require('./graphql/resolvers');

const server = new GraphQLServer({
	typeDefs: "./graphql/schema.graphql",
	resolvers: GQLresolvers.resolvers,
});

server.start((details) => console.log(`Server running on http://localhost:${details.port}`));

