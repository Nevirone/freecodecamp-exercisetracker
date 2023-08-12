require('dotenv').config()
const express = require('express')
const connectMongo = require('./src/services/connectMongo')
const usersRouter = require('./src/routes/users')

const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

connectMongo()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api/users', usersRouter)

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
