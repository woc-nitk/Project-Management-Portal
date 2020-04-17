const { GraphQLServer } = require("graphql-yoga");
const GQLresolvers = require("./graphql/resolvers");

const server = new GraphQLServer({
	typeDefs: "../schema.graphql",
	resolvers: GQLresolvers.resolvers,
	// context: ({request}) => { console.log("------------");console.log(request.headers || {}); },
	resolverValidationOptions: { requireResolversForResolveType: false },
});

server.start((details) => console.log(`Server running on http://localhost:${details.port}`));

