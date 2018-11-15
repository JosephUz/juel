var exports = {};

var juels = {};

exports.set = function (item) {
    juels[item.id] = item;
}

exports.get = function (id) {
    return juels[id];
}

exports.delete = function (id) {
    delete juels[id];
}

exports.clear = function () {
    juels = {};
}

exports.list = function () {
    return Object.keys(juels).map(function (key) {
        return exports.get(key);
    });
}

module.exports = exports;