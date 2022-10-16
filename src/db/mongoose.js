const mongoose = require('mongoose')

mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to MongoDB')
  }
)

const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => {
  console.log('Connected to database')
})
