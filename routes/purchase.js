const {sendDm} = require('../modules/slack')
const keys = require('../config/keys')

module.exports = app => {
  app.post('/purchase', async (req, res) => {
    const { text, user_id } = req.body;
    res.json({
      text: `Thanks for your puchase request of *${text}*. We will message the CEO now for authorisation.`
    })

    sendDm(
      keys.ceoMemberId, 
      `Hi! <@${user_id}> would like to order *${text}*.`,
      [
        {
          text: ' Do you authorise this purchase request?',
          callback_id: 'purchase_request',
          actions: [
            {
              name: 'auth_button',
              text: 'Yes, I approve',
              type: 'button',
              value: 'approved'
            },
            {
              name: 'auth_button',
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
