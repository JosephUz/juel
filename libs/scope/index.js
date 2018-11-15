const Scope = require('./scope.js');

module.exports = function (object) {
    if (object instanceof Scope)
        return object;
    else
        return new Scope(object);
};