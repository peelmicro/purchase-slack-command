const express = require('express')
const bodyParser = require('body-parser')
const {sendDm} = require('./modules/slack')
const keys = require('./config/keys')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.post('/purchase', async (req, res) => {
  const { text, user_id } = req.body;
  res.json({
    text: `Thanks for your puchase request of *${text}*. We will message the CEO now for authorisation.`
  })

  sendDm(
    keys.ceoMemberId, 
    `Hi! <@${user_id}> would like to order *${text}*. Do you authorise this purchase request?`
  )
})

const PORT = 9647

app.listen(PORT, () => {
  console.log(`Slack bot server has started on port ${PORT}!`)
})