const axios = require('axios')
const { YNAB_DOMAIN, sharedExpenseCategories } = require('./constants')

exports.extract_ynab = async (req, res) => {
  try {
    const sinceDate = req.body.since_date
    if (sinceDate == null) {
      throw new Error('Missing argument: since_date')
    }

    const result = {
      data: [],
      metaData: {
        numTransactions: 0,
        numSubtransactions: 0
      }
    }

    const httpRes = await axios(config(sinceDate))
    console.log('httpRes: ', httpRes.data.data.transactions)
    httpRes.data.data.transactions.forEach((t) => {
      // Skip deleted transactions.
      if (t.deleted) {
        return
      }

      // Check for subtransactions.
      t.subtransactions.forEach((s) => {
        // Skip deleted subtransactions.
        if (s.deleted) {
          return
        }

        // Ignore subtransactions that are not shared expenses.
        if (sharedExpenseCategories.includes(s.category_id) === false) {
          return
        }

        // Ignore subtransactions that are not expenses (i.e., negative amount).
        if (s.amount >= 0) {
          return
        }

        // Increase subtransaction counter.
        result.metaData.numSubtransactions += 1

        // Save subtransaction.
        result.data.push(newSubtransaction(s, t))
      })
      // Skip transactions with subtransactions to avoid duplications.
      if (t.subtransactions.length > 0) {
        return
      }

      // Ignore transactions that are not shared expenses.
      if (sharedExpenseCategories.includes(t.category_id) === false) {
        return
      }

      // Ignore transactions that are not expenses (i.e., negative amount).
      if (t.amount >= 0) {
        return
      }

      // Increase transaction counter.
      result.metaData.numTransactions += 1

      // Save transaction.
      result.data.push(newTransaction(t))
    })

    res.status(200).send({ transactions: result })
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

function newTransaction(data) {
  return {
    id: data.id,
    date: data.date,
    amount: data.amount,
    payee_id: data.payee_id,
    payee_name: data.payee_name,
    memo: data.memo || '',
    category_name: data.category_name,
    category_id: data.category_id
  }
}

function newSubtransaction(child, parent) {
  return newTransaction({
    id: child.id,
    date: parent.date,
    amount: child.amount,
    payee_id: parent.payee_id,
    payee_name: parent.payee_name,
    memo: `${parent.memo} ${child.memo}`.trim(),
    category_name: child.category_name,
    category_id: child.category_id
  })
}

function config(sinceDate) {
  return {
    method: 'get',
    url: `${YNAB_DOMAIN}/budgets/${process.env.BUDGET_ID}/transactions?since_date=${sinceDate}`,
    headers: { Authorization: `Bearer ${process.env.YNAB_ACCESS_TOKEN}` }
  }
}
