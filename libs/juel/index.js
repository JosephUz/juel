const Juel = require('./juel.js');

module.exports = function (parsered, evaluated) {
    return new Juel(parsered, evaluated);
}