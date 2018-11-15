var exports = {};

var templates = {};

exports.set = function (name, html) {
    if (typeof (name) == "object" && name instanceof Array) {
        name.forEach(function (item) {
            exports.set(item.name, item.html);
        });
    } else if (typeof (name) == "string" && typeof (html) == "string") {
        templates[name] = html;
    } else if (!name) {
        throw new Error('missing arguments');
    }
}

exports.read = function () {
    var nodes = document.querySelectorAll('[juel]');
    Array.prototype.forEach.call(nodes, function (node) {
        exports.set(node.getAttribute("juel"), node.innerHTML.trim());
        node.remove();
    });
}

exports.get = function (name) {
    return templates[name] || '';
}

module.exports = exports;