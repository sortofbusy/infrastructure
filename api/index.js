module.exports = function(app, data) {
  app.post('/tx', (req, res) => {
    let b = req.body
    let result = data.store.addTx(b['user-id'], b['merchant'], b['price'], b['purchase-date'], b['tx-id'])
    if(result) {
      res.status(201).send("Success")
      return
    }
    res.status(400).send("Error - Invalid transaction")
  })

  app.get('/user/:userId', (req, res) => {
    let result = data.store.getUserMerchants(req.params.userId)
    if(result) {
      res.status(200).send(result)
      return
    }
    res.status(400).send("Error - Too few transactions")
  })
}