const Validator = require('jsonschema').Validator
const v = new Validator()

module.exports = { validateSchema }

function validateSchema(input, schema) {
  const errors = v.validate(input, schema).errors
  if (errors.length > 0) {
    throw JSON.stringify({ errors: errors.map((e) => e.stack) })
  }
}
