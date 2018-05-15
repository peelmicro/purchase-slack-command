const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.post('/purchase', (req, res) => {
  console.log(req.body);
  res.send('OK!')
})

const PORT = 9647

app.listen(PORT, () => {
  console.log(`Slack bot server has started on port ${PORT}!`)
})