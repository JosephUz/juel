const HTML = require('html-parse-stringify')
const Script = require('./script.js');
const AST = require('./ast.js');

function Parser(str) {
    this.text = str;
    this.scripts = (this.text.match(new RegExp("(?:{{)(.*?)(?:}})", "ig")) || [])
        .filter(function (item, index, self) { return self.indexOf(item) === index; })
        .map(function (item) { return new Script(item); });
    this.ast = new AST(HTML.parse(this.text)[0], this);
}

Parser.prototype.toHTML = function () {
    return this.ast.toHTML();
}

Parser.prototype.static = function (container) {
    if (this.ast.name == 'juel') {
        this.ast.static = container;
        return true;
    } else {
        return false;
    }
}

module.exports = Parser;