/**
 * Holds a userId-indexed Map of LinkedLists of Tx (Transactions),
 * and a txId-indexed Map of Tx. Represents data state
 * for the API.
 */

class Store {
  constructor() {
    this.userMap = new Map()
    this.txMap = new Map()
  }

  /**
   * Takes Tx info, creates in appropriate user list. Returns false on failure.
   * @param {number} userId 
   * @param {string} merchant 
   * @param {string} price 
   * @param {string} purchaseDate 
   * @param {number} txId 
   * @returns {boolean}
   */
  addTx(userIdString, merchant, price, purchaseDate, txIdString) {
    let userId = parseInt(userIdString, 10)
    if (userId === NaN) return false
    
    let txId = parseInt(txIdString, 10)
    if (txId === NaN) return false

    if (!this.validateTx(txId)) return false
    if (!userId || typeof userId !== 'number' || !merchant || !price ||
       !purchaseDate || !txId || typeof txId !== 'number') return false

    let tx = new Tx(userId, merchant, price, purchaseDate, txId)

    if(!this.userMap.has(userId)) {
      this.userMap.set(userId, new TxList())
    }

    this.userMap.get(userId).add(tx)
    this.txMap[txId] = true

    return true
  }

  /**
   * Returns the user's most frequently visited merchants
   * @param {number} userId 
   */
  getUserMerchants(userIdString) {
    let userId = parseInt(userIdString, 10)
    if (userId === NaN) return null
    let userTxList = this.userMap.get(userId)
    if(userTxList) {
      return userTxList.getFrequentMerchants()
    } else {
      return null
    }
  }

  /**
   * Ensures txId is unique
   * @param {number} txId 
   */
  validateTx(txId) {
    return (!this.txMap[txId])
  }
}

/**
 * Represents one transaction
 */
class Tx {
  constructor(userId, merchant, price, purchaseDate, txId) {
    this.userId = userId
    this.merchant = merchant
    this.price = price
    this.purchaseDate = purchaseDate
    this.id = txId
    this.next = null
  }

  toString() {
    return this.userId + ", " + this.merchant + ", " + this.price + ", " + this.purchaseDate + ", " + this.id
  }
}

/**
 * Represents a merchant, and number of a user's transactions
 */
class MerchantFrequency {
  constructor(name) {
    this.name = name
    this.count = 1
  }
}

/**
 * Merchant-indexed map of linked lists to hold transactions within MerchantMap.txList
 */
class TxList {
  constructor() {
    this.head = null
    this.merchants = {}
    this.size = 0
  }

  /**
   * Adds a Tx to the front of the list
   * @param {Tx} node 
   */
  add(node) {
    if (!this.head) {
      this.head = node
    } else {
      node.next = this.head
      this.head = node
    }
    this.size++

    if (this.merchants[node.merchant]) {
      this.merchants[node.merchant].count++
    } else {
      this.merchants[node.merchant] = new MerchantFrequency(node.merchant)
    }

  }

  /**
   * Returns the number of transactions.
   */
  getSize() {
    return this.size;
  }
  
  /**
   * Returns the three top merchants.
   */
  getFrequentMerchants() {
    if (this.getSize() < 5) return null
    var result = [null, null, null]
    for(var m in this.merchants) {
      for(var i = 0; i < 3; i++) {
        if (result[i] === null || this.merchants[m].count > result[i].count) {
          result.splice(i, 0, this.merchants[m])
          break;
        }
      }
    }

    let merchants = []
    for (var j = 0; j < 3; j++) {
      if (result[j]) merchants[j] = result[j].name
    }
    return merchants
  }
}

module.exports = { Store }