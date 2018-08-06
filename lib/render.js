const hb = require('handlebars')
const fs = require('fs')
const path = require('path')

module.exports = (tplName, data) => {
	let tpl
	if (!global.templates[tplName]) {
    let src = fs.readFileSync(path.resolve(__dirname, '..', 'templates', `${tplName}.hbs`), 'utf8')
    tpl = hb.compile(src)
    global.templates[tplName] = tpl
	} else {
		tpl = global.templates[tplName]
	}
	return tpl(data)
}
