const juel = require('../../index.js');

function changeList(e) {
    scope.todoList = [
        { id: 1, text: "Item1", count: 0 },
        { id: 2, text: "Item2", count: 0 },
        { id: 3, text: "Item3", count: 0 },
        { id: 4, text: "Item4", count: 0 },
        { id: 5, text: "Item5", count: 0 }
    ];
}

function itemClick(e) {
    this.count += 1;
}

function showScope(e) {
    console.log(JSON.stringify(this.toJSON()));
}

var scope = juel.scope({
    todoList: [
        { id: 1, text: "Item1", count: 0 },
        { id: 2, text: "Item2", count: 0 },
        { id: 3, text: "Item3", count: 0 }
    ]
});



juel.template.read();

juel.template.set('scopeShowBtn', '<button click="{{click}}">Show Scope On Console</button>');

juel.template.set([
    { name: "changeListBtn", html: '<button id="changeListBtn" click="{{ click }}">Change List</button>' },
    { name: "countItem", html: '<li>{{ text }}{{ count ? " - " + count + " Time" + (count > 1 ? "s": "") + " Clicked" : "" }}</li>' },
    { name: "countList", html: '<ul>Clicked Counts {{ todoList.map(addItem) }} NOT: if not clicked, number doesnt show</ul>' }
]);



juel.append("#changeList", 'changeListBtn', {}, {
    click: changeList
});



var todoListJuel = juel.append("#todoList", "todoList", scope, {
    addItem: function (todoItem) {
        return juel.create("todoItem", todoItem, {
            click: itemClick.bind(todoItem)
        }).toHTML();
    }
}).setId("todoList");

console.log(todoListJuel == juel.get("todoList"));


var countListJuel = juel.append("#countList", "countList", scope, {
    addItem: function (todoItem) {
        return juel.create("countItem", todoItem).toHTML();
    }
}).setId('countList');

console.log(countListJuel == juel.get("todoList"));



juel.append('#showScope', 'scopeShowBtn', {}, {
    click: showScope.bind(scope)
});