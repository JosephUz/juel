function Scope(object) {
    var _this = this;
    this.keys = Object.keys(object);
    this.events = {
        onChange: []
    };

    this.keys.forEach(function (key) {
        var p = '_' + key;
        _this[p] = object[key];
        Object.defineProperty(_this, key, {
            get: function () {
                return _this[p];
            },
            set: function (value) {
                _this[p] = value;
                _this.events.onChange.forEach(function (fn) {
                    fn(key, value);
                });
            }
        });
    });

    this.keys.forEach(function (key) {
        Object.defineProperty(object, key, {
            get: function () {
                return _this[key];
            },
            set: function (value) {
                _this[key] = value;
            }
        });
    })
}

Scope.prototype.onChange = function (fn) {
    this.events.onChange.push(fn);
}

Scope.prototype.toJSON = function toJSON(object) {
    var json = {};
    if (object !== undefined) {
        if (object instanceof Scope) {
            json = object.toJSON();
        } if (object instanceof Array) {
            json = object.map(function (item) {
                return toJSON(item);
            });
        } else if (typeof (object) == "object") {
            Object.keys(object).forEach(function (key) {
                json[key] = toJSON(object[key]);
            });
            Object.getOwnPropertyNames(object).forEach(function (key) {
                json[key] = toJSON(object[key]);
            });
        } else {
            json = object;
        }
    } else if (this instanceof Scope) {
        var _this = this;
        this.keys.forEach(function (key) {
            json[key] = toJSON(_this['_' + key]);
        });
    }
    return json;
}

module.exports = Scope;