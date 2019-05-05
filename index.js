const express        = require('express')
const bodyParser     = require('body-parser')
const data           = require('./data')
const csv            = require('csvtojson');

const app            = express()
const port           = 3000

app.use(bodyParser.json())

require('./api')(app, data)


// Read sample data
async function read() {
  let jsonArray = await csv({noheader: true, headers: ['user-id','merchant','unknown','price','purchase-date','tx-id']})
  .fromFile('./coding_challenge_data.csv')
  for (var i = 0; i < jsonArray.length; i++) {
    data.store.addTx(
      jsonArray[i]['user-id'], 
      jsonArray[i]['merchant'], 
      jsonArray[i]['price'], 
      jsonArray[i]['purchase-date'], 
      jsonArray[i]['tx-id']
    )
  }
  return
}

// Init app
read().then(() => {
  app.listen(port)    
})

