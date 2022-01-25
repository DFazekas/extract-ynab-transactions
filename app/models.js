module.exports = {
  Transaction,
  Subtransaction
}

function Transaction(data) {
  return {
    id: data.id,
    date: data.date,
    amount: data.amount,
    memo: data.memo || '',
    category_name: data.category_name,
    category_id: data.category_id
  }
}

function Subtransaction(child, parent) {
  return Transaction({
    id: child.id,
    date: parent.date,
    amount: child.amount,
    memo: `${parent.memo} ${child.memo}`.trim(),
    category_name: child.category_name,
    category_id: child.category_id
  })
}
