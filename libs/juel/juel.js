const cache = require('../cache');

function Juel(parsered, evaluated) {
    this.id = null;
    this.parsered = parsered;
    this.evaluated = evaluated;

    Object.defineProperties(this, {
        scope: {
            get: function () {
                return this.evaluated.scope;
            }
        }
    });
}

Juel.prototype.toHTML = function () {
    return this.parsered.toHTML();
}

Juel.prototype.setId = function (id) {
    this.id = id;
    cache.set(this);
    return this;
}

module.exports = Juel;