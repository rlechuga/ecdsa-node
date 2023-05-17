const express = require('express')
const app = express()
const cors = require('cors')
const port = 3042
const crypto = require('./crypto')

app.use(cors())
app.use(express.json())

const { users } = require('./db')

app.get('/balance/:address', (req, res) => {
  const { address } = req.params
  console.log('server: ', address)
  const { balance, username } = users[address] || {}
  console.log('server: found', address, balance, users[address])
  res.send({ balance, username })
})

app.post('/send', async (req, res) => {
  const { signature, message, publicKey } = req.body
  console.log('signature', JSON.stringify(signature))
  signature.r = BigInt(signature.r)
  signature.s = BigInt(signature.s)
  const messageData = JSON.parse(message)
  const { amount, recipient } = messageData

  const sender = publicKey
  console.log('post', sender, amount)

  if (!users[sender] && !(await crypto.verify(signature, message, publicKey))) {
    res.status(400).send({ message: 'Wrong sender' })
    console.error('Wrong sender')
    return
  }

  console.log('post', sender, recipient, amount)

  setInitialBalance(sender)
  setInitialBalance(recipient)

  if (users[sender].balance < amount) {
    res.status(400).send({ message: 'Not enough funds!' })
  } else {
    users[sender].balance -= amount
    users[recipient].balance += amount
    res.send({ senderBalance: users[sender].balance, recipientBalance: users[recipient].balance })
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})

function setInitialBalance (username) {
  if (!users[username]) {
    users[username].balance = 0
  }
}
