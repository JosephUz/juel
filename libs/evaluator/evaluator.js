const scopeLib = require('../scope');

function Evaluator(parsered, scope, common) {
    var _this = this;
    this.scope = scopeLib(scope);
    this.common = common;
    this.scripts = parsered.scripts;
    this.params = null;

    this.scope.onChange(function (key, value) {
        _this.refresh(key, value)
    });
}

Evaluator.prototype.refresh = function (key, value) {
    var _this = this;

    this.params = this.scope.keys.map(function (key) {
        return ' var ' + key + ' = scope.' + key + ';';
    }).join(' ');

    if (this.common) {
        this.params = this.params.concat(Object.keys(this.common).map(function (key) {
            return ' var ' + key + ' = common.' + key + ';';
        }).join(' '));
    }

    this.scripts.forEach(function (script) {
        if (!key || script.exist(key))
            script.refresh(_this);
    });

    return this;
}

module.exports = Evaluator;