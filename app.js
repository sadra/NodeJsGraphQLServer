const express = require('express');
const { json } = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(json());

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');
const authGuard = require('./middlewares/authGuard');

app.use(authGuard);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  }),
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.zozvv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useUnifiedTopology: true },
  )
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is up and running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.log(err);
  });
