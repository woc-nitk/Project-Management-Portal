const { GraphQLServer } = require("graphql-yoga");
const cors = require('cors');
const GQLresolvers = require("./graphql/resolvers");
const auth = require("./config/auth");

const getUser = (request) => {
	const userData = auth.verifyjwt(request.headers.auth);
	return { id: userData.id, type: userData.type };
};

const server = new GraphQLServer({
	typeDefs: "./schema.graphql",
	resolvers: GQLresolvers.resolvers,
	resolverValidationOptions: { requireResolversForResolveType: false },
	context: ({ request }) => {
		return { user: getUser(request) };
	}
});

server.use(cors());
server.start( { playground: null,  port: process.env.PORT || 5000, cors: {
	"origin": "*",
	"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
	"preflightContinue": false,
	"optionsSuccessStatus": 204
  } }, (details) =>
	console.log(`Server listening on port ${details.port}`)
);
