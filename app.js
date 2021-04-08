const express = require('express')
const {json} = require('body-parser')
const { graphqlHTTP } = require('express-graphql');
const {buildSchema} = require('graphql')
require('dotenv').config()
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3000

const app = express()

const Event = require('./models/event.model')

app.use(json())

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
            return Event
                .find({})
                .then(events => {
                    return events.map( ev => {
                        return {...ev._doc, _id: ev.id}
                    })
                })
                .catch(err => {
                    throw err
                })
        },
        createEvent: (args) => {
            const {title, description, price, date} = args.eventInput;

            const event = new Event({
                title,
                description,
                price: +price,
                date: new Date(date)
            })

            return event
                .save()
                .then(ev => {
                    return {...ev._doc, _id: ev.id}
                })
                .catch(err => {
                    throw err
                })
        }
    },
    graphiql: true
}))

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.zozvv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
        { useUnifiedTopology: true }
    ).then(() => {
        app.listen(PORT, () => console.log(`Server is up and running on http://localhost:${PORT}`))
    }).catch(err => {
        console.log(err)
    })
