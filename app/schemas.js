/**
 * The schema for the expected request body object.
 */
const bodySchema = {
  type: 'object',
  properties: {
    since_date: {
      type: 'string',
      format: 'date',
      required: true
    }
  }
}

module.exports = { bodySchema }
