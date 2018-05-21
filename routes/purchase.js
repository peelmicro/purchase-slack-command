const { sendDm } = require('../modules/slack')
const { savePurchaseRequest } = require('../modules/database')
const keys = require('../config/keys')

module.exports = app => {
  app.post('/purchase', async (req, res) => {
    const { text, user_id } = req.body;
    res.json({
      text: `Thanks for your puchase request of *${text}*. We will message the CEO now for authorisation.`
    })

    // Save purchase request to database
    const key = await savePurchaseRequest(user_id, text)

    // Send a message to the CEO... asking them to authorise the purchase request
    sendDm(
      keys.ceoMemberId, 
      `Hi! <@${user_id}> would like to order *${text}*.`,
      [
        {
          text: ' Do you authorise this purchase request?',
          callback_id: 'purchase_request',
          actions: [
            {
              name: key,
              text: 'Yes, I approve',
              type: 'button',
              value: 'approved'
            },
            {
              name: key,
              text: 'No',
              type: 'button',
              value: 'declined'
            }
          ]
        }      
      ]
    )
  })
}
