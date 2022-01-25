const { bodySchema } = require('./schemas')
const { validateSchema } = require('./utils')
const { ynabTransactions } = require('./network')
const { Transaction, Subtransaction } = require('./models')

exports.extract_ynab = async (req, res) => {
  try {
    validateSchema(req.body, bodySchema)

    const sinceDate = req.body.since_date
    const result = []

    const transactions = await ynabTransactions(sinceDate)
    transactions.forEach((t) => {
      // Check for subtransactions.
      t.subtransactions.forEach((s) => result.push(Subtransaction(s, t)))
      // Skip transactions with subtransactions to avoid duplications.
      if (t.subtransactions.length > 0) {
        return
      }

      // Save transaction.
      result.push(Transaction(t))
    })

    res.status(200).send({ transactions: result })
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}
