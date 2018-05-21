const { sendDm } = require('../modules/slack')
const { readPurchaseRequest, recordPurchaseRequestDecision } = require('../modules/database')

module.exports = app => {
  app.post('/action', async (req, res) => {
    const interactiveMessage = JSON.parse(req.body.payload)
    const requestApproved = interactiveMessage.actions[0].value === 'approved'
    const orginalTextMessage = interactiveMessage.original_message.text
    const key = interactiveMessage.actions[0].name
    // sending the CEO feedback on what they decided
    res.json({
      text: orginalTextMessage,
      attachments: [{
        text: requestApproved ?
          'You *approved* this purchase request' :
          'You *denied* this purchase request'
      }]
    })
    // record decision of CEO in database
    await recordPurchaseRequestDecision( key, requestApproved )

    // read data using key from database (or response)
    var purchaseRequest = await readPurchaseRequest(key)
    const matches = orginalTextMessage.match(/@(.+)>.+\*(.+)\*/)
    const userId = purchaseRequest ? purchaseRequest.userId: matches[2];
    const item = purchaseRequest ? purchaseRequest.item: matches[1];

    // send the orginial purchase requester feedback on the decision
    sendDm(
      userId,
      `Hi! Your purchase request for *${item}* has been *${requestApproved ? 'approved': 'denied'}*.`)
  })
}