const juel = require("../index.js");
const Scope = require('../libs/scope/scope.js');

var scope = null;

mocha.setup('bdd');

describe("index.js test", function () {
    it("add templates to juel", function (done) {
        try {
            juel.template.read();

            juel.template.set('scopeShowBtn', '<button click="{{click}}">Show Scope On Console</button>');

            juel.template.set([
                { name: "changeListBtn", html: '<button id="changeListBtn" click="{{ click }}">Change List</button>' },
                { name: "countItem", html: '<li>{{ text }}{{ count ? " - " + count + " Time" + (count > 1 ? "s": "") + " Clicked" : "" }}</li>' },
                { name: "countList", html: '<ul>Clicked Counts {{ todoList.map(addItem) }} NOT: if not clicked, number doesnt show</ul>' }
            ]);

            if (juel.template.get('scopeShowBtn') == '<button click="{{click}}">Show Scope On Console</button>' && juel.template.get('todoList') == '<ul>Click Items {{ todoList.map(addItem) }}</ul>' && juel.template.get('changeListBtn') == '<button id="changeListBtn" click="{{ click }}">Change List</button>')
                done();
            else
                done(new Error('add templates to juel failed.'));
        } catch (err) {
            done(err);
        }
    });

    it("create scope for global", function (done) {
        try {
            var todoList = [
                { id: 1, text: "Item1", count: 0 },
                { id: 2, text: "Item2", count: 0 },
                { id: 3, text: "Item3", count: 0 }
            ];

            scope = juel.scope({
                todoList: todoList
            });

            if (scope instanceof Scope && scope.todoList == todoList && scope.keys.length == 1)
                done();
            else
                done(new Error('create scope for global failed.'));
        } catch (err) {
            done(err);
        }
    });

    it("append template to container and test click", function (done) {
        try {
            function changeList(e) {
                done();
            }

            juel.append("#changeList", 'changeListBtn', {}, {
                click: changeList
            });

            if (document.getElementById('changeList').innerHTML == '<button id="changeListBtn">Change List</button>') {
                document.getElementById('changeListBtn').dispatchEvent(new Event("click"));
            } else
                done(new Error('append template to container failed.'));
        } catch (err) {
            done(err);
        }
    });

    it("append template and create sub template from script in parent template", function (done) {
        try {
            function itemClick(e) {

            }

            juel.append("#todoList", "todoList", scope, {
                addItem: function (todoItem) {
                    return juel.create("todoItem", todoItem, {
                        click: itemClick
                    }).toHTML();
                }
            });

            var output = '<ul>Click Items <li><button>Item1</button></li><li><button>Item2</button></li><li><button>Item3</button></li></ul>';

            if (document.getElementById('todoList').innerHTML == output)
                done();
            else
                done(new Error('append template and create sub template from script in parent template failed.'));
        } catch (err) {
            done(err);
        }
    });

    it("test click for sub template and check scope", function (done) {
        try {
            function itemClick(e) {
                if (this == scope.todoList[0])
                    done();
                else
                    done(new Error('check scope failed.'));
            }

            document.getElementById('todoList').innerHTML = "";

            juel.append("#todoList", "todoList", scope, {
                addItem: function (todoItem) {
                    return juel.create("todoItem", todoItem, {
                        click: itemClick.bind(todoItem)
                    }).toHTML();
                }
            });

            document.querySelector('#todoList li button').dispatchEvent(new Event("click"));
        } catch (err) {
            done(err);
        }
    });

    it("set id for juel instance and check instance with cache", function (done) {
        try {
            function itemClick(e) {

            }

            document.getElementById('todoList').innerHTML = "";

            var instance = juel.append("#todoList", "todoList", scope, {
                addItem: function (todoItem) {
                    return juel.create("todoItem", todoItem, {
                        click: itemClick
                    }).toHTML();
                }
            }).setId("todoList");

            if (instance == juel.get('todoList'))
                done();
            else
                done(new Error('check instance with cache failed.'));
        } catch (err) {
            done(err);
        }
    });

    it("change scope", function (done) {
        try {
            var todoList = [
                { id: 1, text: "Item1", count: 0 },
                { id: 2, text: "Item2", count: 0 },
                { id: 3, text: "Item3", count: 0 },
                { id: 4, text: "Item4", count: 0 },
                { id: 5, text: "Item5", count: 0 }
            ];

            function changeList(e) {
                scope.todoList = todoList;
            }

            function itemClick(e) {

            }

            document.getElementById('changeList').innerHTML = "";
            document.getElementById('todoList').innerHTML = "";

            juel.append("#changeList", 'changeListBtn', {}, {
                click: changeList
            });

            juel.append("#todoList", "todoList", scope, {
                addItem: function (todoItem) {
                    return juel.create("todoItem", todoItem, {
                        click: itemClick
                    }).toHTML();
                }
            });

            var output = '<ul>Click Items <li><button>Item1</button></li><li><button>Item2</button></li><li><button>Item3</button></li><li><button>Item4</button></li><li><button>Item5</button></li></ul>';

            document.getElementById('changeListBtn').dispatchEvent(new Event("click"));

            if (scope.todoList == todoList && document.getElementById('todoList').innerHTML == output)
                done();
            else
                done(new Error('change scope failed.'));
        } catch (err) {
            done(err);
        }
    });

    it("change sub template scope", function (done) {
        try {
            function itemClick(e) {
                this.count += 1;

                var output = '<ul>Clicked Counts <li>Item1 - 1 Time Clicked</li><li>Item2</li><li>Item3</li> NOT: if not clicked, number doesnt show</ul>';
                if (scope.todoList[0].count == 1 && document.getElementById('countList').innerHTML == output)
                    done();
                else
                    done(new Error('change sub template scope failed.'));
            }

            document.getElementById('todoList').innerHTML = "";

            scope = juel.scope({
                todoList: [
                    { id: 1, text: "Item1", count: 0 },
                    { id: 2, text: "Item2", count: 0 },
                    { id: 3, text: "Item3", count: 0 }
                ]
            });


            juel.append("#todoList", "todoList", scope, {
                addItem: function (todoItem) {
                    return juel.create("todoItem", todoItem, {
                        click: itemClick.bind(todoItem)
                    }).toHTML();
                }
            });

            juel.append("#countList", "countList", scope, {
                addItem: function (todoItem) {
                    return juel.create("countItem", todoItem).toHTML();
                }
            });

            document.querySelector('#todoList li button').dispatchEvent(new Event("click"));
        } catch (err) {
            done(err);
        }
    });

    it("check scope to JSON", function (done) {
        try {
            var output = '{"todoList":[{"id":1,"text":"Item1","count":1},{"id":2,"text":"Item2","count":0},{"id":3,"text":"Item3","count":0}]}';
            if (JSON.stringify(scope.toJSON()) == output)
                done();
            else
                done(new Error('check scope to JSON failed.'));
        } catch (err) {
            done(err);
        }
    });

    it("juel container disappears", function (done) {
        try {
            juel.template.set('juelContainer', '<juel>{{ value }}</juel>');

            juel.append("#juelContainerTest", "juelContainer", {
                value: "juelContainerTest"
            });

            if (document.getElementById('juelContainerTest').innerHTML == "juelContainerTest")
                done();
            else
                done(new Error('Fail!'));
        } catch (err) {
            done(err);
        }
    });

    it("juel container and scope change", function (done) {
        try {
            juel.template.set('juelContainer', '<juel>{{ value }}</juel>');

            var scope = juel.scope({
                value: "juelContainerTest"
            });

            juel.append("#juelContainerTest2", "juelContainer", scope);

            scope.value = 'juelContainerTest2';

            if (document.getElementById('juelContainerTest2').innerHTML == "juelContainerTest2")
                done();
            else
                done(new Error('Fail!'));
        } catch (err) {
            done(err);
        }
    });
});

mocha.checkLeaks();
mocha.run();