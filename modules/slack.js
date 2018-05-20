const axios = require('axios')
const keys = require('../config/keys')

const sendDm = async (userId, message, attachments) => {
  try {
    const conversationResponse = await axios.post('https://slack.com/api/conversations.open', 
      {
        users: userId
      },
      {
        headers: {
          'Authorization': `Bearer ${keys.slackBotToken}`
        }
      }
    )
    const postResponse = await axios.post('https://slack.com/api/chat.postMessage', 
      {
        channel: conversationResponse.data.channel.id,
        text: message,
        attachments: JSON.stringify(attachments)
      },
      {
        headers: {
          'Authorization': `Bearer ${keys.slackBotToken}`
        }
      }
    )  
    return postResponse.data
  } catch (error) {
    throw error
  }
}

module.exports = {
  sendDm
}