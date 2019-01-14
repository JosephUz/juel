const juel = require('./libs/juel');
const parser = require('./libs/parser');
const evaluator = require('./libs/evaluator');
const template = require('./libs/template');
const cache = require('./libs/cache');
const scope = require('./libs/scope');

var exports = {};

exports.template = template;
exports.cache = cache;
exports.get = cache.get;

exports.append = function (container, name, scope, common) {
    var jueled = null;

    if (container && typeof (container) == "string" && typeof (name) == "string") {
        container = document.querySelector(container);
    } else {
        throw new Error('missing arguments');
    }

    jueled = exports.create(name, scope, common);

    if (jueled.static(container))
        Array.prototype.forEach.call(jueled.toHTML().childNodes, function (item) {
            container.append(item);
        });
    else
        container.append(jueled.toHTML());

    return jueled;
}

exports.create = function (name, scope, common) {
    var parsered = null;
    var evaluated = null;
    var html = null;

    if (typeof (name) == "string" && typeof (scope) == "object" && (!common || typeof (common) == "object")) {
        html = template.get(name);
    } else {
        throw new Error('missing arguments');
    }

    if (!html) {
        throw new Error('empty html');
    }

    parsered = parser(html);

    if (parsered.scripts.length > 0) {
        evaluated = evaluator(parsered, scope, common);
    } else {
        evaluated = null;
    }

    return juel(parsered, evaluated);
}

exports.scope = function (object) {
    if (typeof (object) !== "object") {
        throw new Error('parameter must be an object');
    }
    return scope(object);
}

module.exports = exports;