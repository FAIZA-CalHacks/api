require('dotenv').config()

const app = require('./app.js')
const port = process.env.PORT || 8080
app.listen(port, () => {
  if (process.send) {
    process.send('online')
  }
  console.log('Server has started on port ' + port)
})
