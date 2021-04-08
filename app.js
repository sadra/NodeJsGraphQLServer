const express = require('express')
const {json} = require('body-parser')
const { graphqlHTTP } = require('express-graphql');
const {buildSchema} = require('graphql')


const PORT = process.env.PORT || 3000

const app = express()

app.use(json())

const events = []

const graphQlSchema = `
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
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
            return events
        },
        createEvent: (args) => {
            const {title, description, price, date} = args.eventInput;

            const event = {
                _id: new Date().getTime(),
                title,
                description,
                price: +price,
                date
            }

            events.push(event)

            return event
        }
    },
    graphiql: true
}))


app.listen(PORT, () => console.log(`Server is up and running on http://localhost:${PORT}`))