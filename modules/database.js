
const keys = require('../config/keys')
const admin = require('firebase-admin');
const moment = require('moment')
const serviceAccount = require(`../config/${keys.firebasePrivateKey}`)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://purchase-slack-command.firebaseio.com"
})

var db = admin.database()
var ref = db.ref("purchase-request")

const savePurchaseRequest = async (userId, item) => {
  const response = await ref.push({
    userId,
    item,
    timestamp: moment().valueOf()
  })
  return response.key
}

const readPurchaseRequest = async key => {
  const snapshot = await ref.child(key).once('value')
  return snapshot.val()
}

const recordPurchaseRequestDecision = async (key,decision) => {
  await ref.child(key).update({
    approved: decision
  })
}

module.exports = {
  savePurchaseRequest,
  readPurchaseRequest,
  recordPurchaseRequestDecision
}