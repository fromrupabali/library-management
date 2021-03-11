const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const { graphqlHTTP } = require('express-graphql');

const typeDefs = require('./Api/typeDefs');
const resolvers = require('./Api/resolvers');


app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type ,Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true
});
server.applyMiddleware({app});
app.use(express.static('public'));

// app.use('/graphql', graphqlHTTP({
//     schema: graphqlSchema,
//     rootValue: graphqlResolvers,
//     graphiql: true
// }));

const PORT = process.env.PORT || 4000;
mongoose.connect(
      process.env.mongoURI,
      {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true
        }
    )
app.listen(PORT);
console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);