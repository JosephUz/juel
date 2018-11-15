const Parser = require('./parser.js');

module.exports = function (str) {
    return new Parser(str);
};