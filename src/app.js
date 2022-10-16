const express = require('express')
require('./db/mongoose.js')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const usersRouter = require('./routers/users')
const postsRouter = require('./routers/content/posts')
const commentsRouter = require('./routers/content/comments')
const answersRouter = require('./routers/content/answers')
const investmentsRouter = require('./routers/financial/investments')
const offersRouter = require('./routers/financial/offers')

const app = express()
app.use(express.json({ limit: '5mb' })) // allow bigger file transfers
app.use(express.urlencoded({ limit: '5mb', extended: true })) // allow bigger file transfers
app.use(cors({ 'Access-Control-Allow-Origin': '*' }))
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
)

app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/answers', answersRouter)
app.use('/api/investments', investmentsRouter)
app.use('/api/offers', offersRouter)

module.exports = app
