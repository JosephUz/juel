juel
==================

For rendering html element from javascript object using by html template in client-side.


## Installation

```shell
$ npm install juel
```

## Usage

```html

<!DOCTYPE html>
<html lang="tr">

<head>
    <meta charset="utf-8" />
</head>

<body>
    <noscript>Your browser does not support JavaScript!</noscript>

    <ul id="changeList"></ul>

    <div id="todoList"></div>

    <div id="countList"></div>

    <ul id="showScope"></ul>

    <template juel="todoList">
        <ul>Click Items {{ todoList.map(addItem) }}</ul>
    </template>

    <template juel="todoItem">
        <li><button click="{{ click }}">{{ text }}</button></li>
    </template>

    <script src="./index.build.min.js"></script>
</body>

</html>

```

### index.js file

```javascript

const juel = require('juel');

// for update global scope
function changeList(e) {
    scope.todoList = [
        { id: 1, text: "Item1", count: 0 },
        { id: 2, text: "Item2", count: 0 },
        { id: 3, text: "Item3", count: 0 },
        { id: 4, text: "Item4", count: 0 },
        { id: 5, text: "Item5", count: 0 }
    ];
}

// for update sub template element scope
function itemClick(e) {
    this.count += 1;
}

// write scope to console
function showScope(e) {
    console.log(JSON.stringify(this.toJSON()));
}

// create global scope to apply changes to the DOM
// scope objects created as a global variable are meant to be used in multiple juel
// all juel objects create the scope object if you create the scope
var scope = juel.scope({
    todoList: [
        { id: 1, text: "Item1", count: 0 },
        { id: 2, text: "Item2", count: 0 },
        { id: 3, text: "Item3", count: 0 }
    ]
});

// to read templates written to DOM
juel.template.read();

// single and multiple templates can be added from within the script
juel.template.set('scopeShowBtn', '<button click="{{click}}">Show Scope On Console</button>');
juel.template.set([
    { name: "changeListBtn", html: '<button id="changeListBtn" click="{{ click }}">Change List</button>' },
    { name: "countItem", html: '<li>{{ text }}{{ count ? " - " + count + " Time" + (count > 1 ? "s": "") + " Clicked" : "" }}</li>' },
    { name: "countList", html: '<ul>Clicked Counts {{ todoList.map(addItem) }} NOT: if not clicked, number doesnt show</ul>' }
]);


// add a single template into DOM
juel.append("#changeList", 'changeListBtn', {}, {
    click: changeList
});


// multiple sub templates for scope in template can be added to DOM
// the only difference should be create instead of append and output should be HTML
var todoListJuel = juel.append("#todoList", "todoList", scope, {
    addItem: function (todoItem) {
        return juel.create("todoItem", todoItem, {
            click: itemClick.bind(todoItem)
        }).toHTML();
    }
}).setId("todoList");
// juel.get via setId function to access the juel object
console.log(todoListJuel == juel.get("todoList"));


// you can create more than one juel for the same scope object and change the two juel objects via scope
var countListJuel = juel.append("#countList", "countList", scope, {
    addItem: function (todoItem) {
        return juel.create("countItem", todoItem).toHTML();
    }
}).setId('countList');
// juel.get via setId function to access the juel object
console.log(countListJuel == juel.get("todoList"));

// translate scope object into json type
juel.append('#showScope', 'scopeShowBtn', {}, {
    click: showScope.bind(scope)
});

```

### index.build.js file

index.build.js file is generated from index.js with libraries like browserify or babel or parcel or webpack.

### [Build Sample][]

[Build Sample]: https://github.com/JosephUz/juel/tree/master/gulpfile.js


## Examples

### [Basic Usage][]

This example shows the most basic way of usage.

[Basic Usage]: https://github.com/JosephUz/juel/tree/master/examples/basic/index.html


License
-------

This software is free to use under the JosephUz. See the [LICENSE file][] for license text and copyright information.


[LICENSE file]: https://github.com/JosephUz/juel/blob/master/LICENSE