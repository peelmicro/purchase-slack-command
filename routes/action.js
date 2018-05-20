const {
  sendDm
} = require('../modules/slack')

module.exports = app => {
  app.post('/action', async (req, res) => {
    const interactiveMessage = JSON.parse(req.body.payload)
    const requestApproved = interactiveMessage.actions[0].value === 'approved'
    const orginalTextMessage = interactiveMessage.original_message.text

    // sending the CEO feedback on what they decided
    res.json({
      text: orginalTextMessage,
      attachments: [{
        text: requestApproved ?
          'You *approved* this purchase request' :
          'You *denied* this purchase request'
      }]
    })

    // send the orginial purchase requester feedback on the decision
    const matches = orginalTextMessage.match(/@(.+)>.+\*(.+)\*/)
    sendDm(
      matches[1],
      `Hi! Your purchase request for *${matches[2]}* has been *${requestApproved ? 'approved': 'denied'}*.`)
  })
}