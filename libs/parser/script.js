function Script(original) {
    this.original = original;
    this.text = this.original.replace(new RegExp('({{)|(}})', "g"), '').replace(new RegExp('&gt;'), '>').replace(new RegExp('&lt;'), '>');
    this.value = null;
    this.first = false;
    this.events = {
        onChange: []
    };
}

Script.prototype.onChange = function (fn) {
    this.events.onChange.push(fn);
}

Script.prototype.exist = function (key) {
    return this.text.indexOf(key) > -1;
}

Script.prototype.refresh = function (evaluator) {
    var _this = this;

    var value = new Function('scope', 'common', 'original', 'script',
        evaluator.params + ' try { return eval(script); } catch(err) { console.log(err); return ""; }')
        (evaluator.scope, evaluator.common, this.original, this.text);

    if (value != this.value) {
        this.value = value;
        if (this.first)
            this.events.onChange.forEach(function (fn) {
                fn(_this);
            });
        else
            this.first = true;
    }
}

module.exports = Script;