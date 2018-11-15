const Juel = require('../juel/juel.js');
const Attribute = require('./attribute.js');

function AST(ast, parsered) {
    var _this = this;
    this.type = ast.type;
    this.content = ast.content;
    this.name = ast.name;
    this.script = ast.script;
    this.parent = ast.parent;
    this.oldHtml = null;
    this.children = [];
    this.attrs = [];

    Object.defineProperties(this, {
        html: {
            get: function () {
                return this._html;
            },
            set: function (value) {
                if (this.script) {
                    this.oldHtml = this._html || [];
                    this._html = Array.prototype.map.call(value.childNodes, function (item) {
                        return item;
                    })
                } else {
                    this._html = value;
                }
            }
        }
    });

    if (ast.script) {
        ast.script.onChange(function () {
            var items = _this.toHTML();
            var last = _this.oldHtml[0];
            if (!last) {
                _this.parent.children.forEach(function (sibling) {
                    if (!sibling.script && !last) {
                        last = sibling.html;
                    }
                    if (sibling == _this)
                        last = null;
                });
            }
            items.forEach(function (item) {
                if (last)
                    last.before(item);
                else
                    _this.parent.html.append(item);
            });
            _this.oldHtml.forEach(function (item) {
                item.remove();
            });
        });
    }

    if (ast.attrs) {
        this.attrs = Object.keys(ast.attrs).map(function (key) {
            var attr = new Attribute(key, ast.attrs[key], parsered);
            attr.parts.forEach(function (part) {
                if (part.script) {
                    part.script.onChange(function () {
                        if (_this.html)
                            _this.setAttribute(attr.key);
                    });
                }
            });
            return attr;
        });
    }

    (ast.children || []).forEach(function (child) {
        if (child.type == "text") {
            parsered.scripts.forEach(function (script) {
                var si = child.content.indexOf(script.original);
                if (si > -1) {
                    var content = child.content.substr(0, si);
                    if (content)
                        _this.children.push(new AST({
                            type: "text",
                            content: content
                        }, parsered));
                    _this.children.push(new AST({
                        type: "script",
                        script: script,
                        parent: _this
                    }, parsered));
                    child.content = child.content.substr(si + script.original.length);
                }
            });

            if (child.content) {
                _this.children.push(new AST({
                    type: "text",
                    content: child.content
                }, parsered));
            }
        } else {
            _this.children.push(new AST(child, parsered));
        }
    });
}

AST.prototype.render = function () {
    var node = null;
    if (this.type == "text") {
        node = document.createTextNode(this.content);
    } else if (this.type == "script") {
        var value = this.script.value;
        node = document.createElement('container');
        if (typeof (value) == "string") {
            node.append(document.createTextNode(value));
        } else if (typeof (value) == "object") {
            if (value instanceof Array) {
                value.forEach(function (item) {
                    if (item instanceof Juel)
                        node.append(item.toHTML());
                    else
                        node.append(item);
                });
            } else if (value instanceof Juel) {
                node.append(value.toHTML());
            } else {
                node.append(value);
            }
        } else {
            node.append(document.createTextNode(value));
        }
    } else {
        node = document.createElement(this.name);
    }
    return node;
}

AST.prototype.setAttribute = function (key) {
    var _this = this;
    this.attrs.forEach(function (attr) {
        if (key == null || attr.key == key) {
            attr.setEvent();
            if (attr.event.key) {
                if (attr.event.oldFn)
                    _this.html.removeEventListener(attr.event.key, attr.event.oldFn);
                if (attr.event.fn)
                    _this.html.addEventListener(attr.event.key, attr.event.fn);
            } else {
                _this.html.setAttribute(attr.key, attr.value());
            }
        }
    });
}

AST.prototype.toHTML = function () {
    var _this = this;
    this.html = this.render();
    this.setAttribute();
    this.children.forEach(function (child) {
        if (child.script) {
            child.toHTML().forEach(function (item) {
                _this.html.append(item);
            });
        } else {
            _this.html.append(child.toHTML());
        }
    });
    return this.html;
}

module.exports = AST;