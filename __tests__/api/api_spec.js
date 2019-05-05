const frisby = require('frisby');

it('tx/POST should return a status of 400 when input is invalid',
function() {
  return frisby.post('http://localhost:3000/tx', {
    'user-id': 1,
    'purchase-date': '2019-01-01T22:45:40',
    'tx-id': 100,
  })
  .expect('status', 400)
})

it('tx/POST should return a status of 201 Created',
  function() {
    return frisby.post('http://localhost:3000/tx', {
      'user-id': 1,
      'merchant': 'Bartell Drugs',
      'price': '5.78',
      'purchase-date': '2019-01-01T22:45:40',
      'tx-id': 100,
    })
    .expect('status', 201)
})

it('tx/:user GET should return an error message when less than 5 transactions',
function() {
  return frisby.get('http://localhost:3000/user/76')
  .expect('status', 400)
})

it('tx/:user GET should return an error message when invalid user id entered',
function() {
  return frisby.get('http://localhost:3000/user/clearlywrong')
  .expect('status', 400)
})

it('tx/:user GET should return [Bartell Drugs, Flying Pie Pizza, Albertsons] for user 1',
function() {
  return frisby.get('http://localhost:3000/user/1')
  .expect('status', 200)
  .expect('json', '?', 'Bartell Drugs')
  .expect('json', '?', 'Flying Pie Pizza')
  .expect('json', '?', 'Albertsons')
})

it('tx/:user GET should return [Bartell Drugs, Safeway] for user 2',
function() {
  return frisby.get('http://localhost:3000/user/2')
  .expect('json', '?', 'Bartell Drugs')
  .expect('json', '?', 'Safeway')
})

it('tx/:user GET should return 400: "Error - Too few transactions" for user 3',
function() {
  return frisby.get('http://localhost:3000/user/3')
  .expect('status', 400)
  .expect('bodyContains', 'Error - Too few transactions')
})



