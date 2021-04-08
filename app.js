const express = require('express')
const {json} = require('body-parser')

const PORT = process.env.PORT || 3000

const app = express()

app.use(json())



app.listen(PORT, () => console.log(`Server is up and running on http://localhost:${PORT}`))