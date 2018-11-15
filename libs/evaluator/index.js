const Evaluator = require('./evaluator.js');

module.exports = function (parsered, scope, common) {
    return new Evaluator(parsered, scope, common).refresh();
};