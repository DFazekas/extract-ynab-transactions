const axios = require('axios')
const { YNAB_DOMAIN } = require('./constants')

module.exports = { ynabTransactions }

async function ynabTransactions(sinceDate) {
  const httpRes = await axios(config(sinceDate))
  console.log('httpRes: ', httpRes.data.data.transactions)
  return httpRes.data.data.transactions
}

function config(sinceDate) {
  return {
    method: 'GET',
    url: `${YNAB_DOMAIN}/budgets/${process.env.BUDGET_ID}/transactions?since_date=${sinceDate}`,
    headers: { Authorization: `Bearer ${process.env.YNAB_ACCESS_TOKEN}` }
  }
}
