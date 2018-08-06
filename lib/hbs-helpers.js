const handlebars = require('handlebars')
const util = require('handlebars-utils')
require('handlebars-helpers')({handlebars})

module.exports = async () => {

  handlebars.registerHelper("dump", (val) => {
    return new handlebars.SafeString('<pre>' + JSON.stringify(val, null, 4) + '</pre>')
  })

}