const express = require('express')
const {json} = require('body-parser')
const { graphqlHTTP } = require('express-graphql');
const {buildSchema} = require('graphql')


const PORT = process.env.PORT || 3000

const app = express()

app.use(json())

const graphQlSchema = `
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(graphQlSchema),
    rootValue: {
        events: () => {
            return ["20th Concert of Anathema", "Anouncing Batman Vs. Superman", "Anouncing iPhone 13"]
        },
        createEvent: (args) => {
            return args.name
        }
    },
    graphiql: true
}))


app.listen(PORT, () => console.log(`Server is up and running on http://localhost:${PORT}`))