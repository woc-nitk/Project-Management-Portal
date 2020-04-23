const { GraphQLServer } = require("graphql-yoga");
const GQLresolvers = require("./graphql/resolvers");
const auth = require("./config/auth");

const getUser = (request) => {
	const userData = auth.verifyjwt(request.headers.auth);
	return { id: userData.id, type: userData.type };
};

const server = new GraphQLServer({
	typeDefs: "../schema.graphql",
	resolvers: GQLresolvers.resolvers,
	resolverValidationOptions: { requireResolversForResolveType: false },
	context: ({ request }) => {
		return { user: getUser(request) };
	}
});

const corsConfig = {
	origin: "*",
	exposedHeaders: ["auth", "refresh"],
	allowedHeaders: ["auth", "refresh"],
};

server.start({cors: corsConfig}, (details) =>
	console.log(`Server running on http://localhost:${details.port}`)
);
