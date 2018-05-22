/* 
This script checks each purchase request every x minutes

And if a decision on the purchase request has not been made 
AND 
Y minutes has passed since it was first requested,
then remind the CEO of that colecction of purchase requests.
*/

const moment = require('moment')
const {readAllPurchaseRequests} = require('./modules/database')
const {sendDm} = require('./modules/slack')
const keys = require('./config/keys')

const CheckOnPurchaseRequests = async () => {
  const purchaseRequests = await readAllPurchaseRequests()

  const purchaseRequestReminders = [];

  for (let key of Object.keys(purchaseRequests)) {
    const { timestamp, approved, item, userId } = purchaseRequests[key]

    if (approved === undefined && moment().diff(timestamp,"minutes") > 240) {
      purchaseRequestReminders.push({item, userId})
      // console.log(
      //   `The purchase for ${item} was made ${moment().diff(timestamp,"minutes")} minutes ago, `
      //   +`and the CEO ${approved === undefined ? 'has not decided about': approved ? 'approved': 'denied'} this.`
      // )
    }
  }

  if (purchaseRequestReminders.length>0) {
    // console.log('These are the purchase requets that we need to remind the CEO of')
    // console.log(purchaseRequestReminders)    
    sendDm(
      keys.ceoMemberId,
      'Hi! Here are the purshases requests that still need a decision from you.',
      purchaseRequestReminders.map(purchaseRequest => ({
        text: `*${purchaseRequest.item}* requested by <@${purchaseRequest.userId}>.`
      }))
    )  
  }
}

CheckOnPurchaseRequests()
