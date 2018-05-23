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

    if (approved === undefined && moment().diff(timestamp,"minutes") > 1) {
      purchaseRequestReminders.push({item, userId})
    }
  }

  console.log(`Total reminders to send to CEO are ${purchaseRequestReminders.length}.`)
  if (purchaseRequestReminders.length>0) {
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

setInterval(CheckOnPurchaseRequests, 10 * 1000) // Every 10 seconds
