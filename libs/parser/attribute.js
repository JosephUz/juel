function Attribute(key, value, parsered, script) {
    var _this = this;

    this.key = key;
    this._value = value;
    this.script = script;
    this.parsered = parsered;
    this.parts = [];
    this.event = {
        key: null,
        fn: null,
        oldFn: null
    };

    if (key) {
        parsered.scripts.forEach(function (script) {
            var scr = _this._value.indexOf(script.original);
            if (scr > -1) {
                var value = _this._value.substr(0, scr);
                if (value)
                    _this.parts.push(new Attribute(null, value));
                _this.parts.push(new Attribute(null, value, null, script));
                _this._value = _this._value.substr(scr + script.original.length);
            }
        });
    }
}

Attribute.prototype.value = function () {
    var value = "";
    if (this.parts.length) {
        this.parts.forEach(function (attr) {
            if (attr.script) {
                value += attr.script.value.toString();
            } else {
                value += attr._value;
            }
        });
        value += this._value;
    } else {
        value = this._value;
    }
    return value;
}

Attribute.prototype.setEvent = function () {
    if (this.parts.length == 1 &&
        typeof (this.parts[0].script.value) == "function") {
        this.event.key = this.key;
        this.event.oldFn = this.fn;
        this.event.fn = this.parts[0].script.value;
    } else {
        this.oldFn = this.fn;
        this.fn = null;
    }
}



module.exports = Attribute;