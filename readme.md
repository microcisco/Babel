Babel插件Demo
==

简述
====
Babel 是 JavaScript 编译器，更确切地说是源码到源码的编译器，通常也叫做“转换编译器（transpiler）”。 意思是说你为 Babel 提供一些 JavaScript 代码，Babel 更改这些代码，然后返回给你新生成的代码。  
所以呢我们可以在转换的时候将代码进行一些优化处理。简单来说Babel解析成AST，然后插件更改AST，最后由Babel输出代码那么Babel的插件模块需要你暴露一个function，function内返回visitor

代码
====
```js
const t = require('babel-types');
const visitor = {
    BinaryExpression(path) {
        const node = path.node;
        let result;
        if (t.isNumericLiteral(node.left) && t.isNumericLiteral(node.right)) {
            switch (node.operator) {
                case "+":
                    result = node.left.value + node.right.value;
                    break;
                case "-":
                    result = node.left.value - node.right.value;
                    break;
                case "*":
                    result = node.left.value * node.right.value;
                    break;
                case "/":
                    result = node.left.value / node.right.value;
                    break;
                default:
                    break;
            }
        }
        if (result !== void 0) {
            path.replaceWith(t.numericLiteral(result));
            let parentPath = path.parentPath;
            parentPath && visitor.BinaryExpression.call(this, parentPath);
        }
    }
};
module.exports = function (babel) {
    return {
        visitor
    };
};
```
Javascript实现Javascript解析器
==
这里比较关键的部分生成AST是用babylon这个模块生成的，自己写的话简单的没问题，完美的话还是需要蛮多精力的，另外呢这里还有许多坑没填，比如变量作用域啊，变量提升啊等等，这只是一个demo，后面有时间我会慢慢完善。
```js
const babylon = require("babylon");

//节点处理者
const Handler = {
    File(node, scope) {
        evaluate(node.program, scope);
    },
    Program(node, scope) {
        for(let exec of node.body) {
            evaluate(exec, scope);
        }
    },
    ExpressionStatement(node, scope) {
        evaluate(node.expression, scope);
    },
    CallExpression(node, scope) {
        //参数
        let params = [];
        for(let param of node.arguments) {
            params.push(Handler.NumericLiteral(param));
        }
        //函数体
        let func = evaluate(node.callee, scope);
        //执行
        func.apply(null, params);
    },
    MemberExpression(node, scope) {
        const {object, property} = node;
        let objectValue = evaluate(object, scope);
        let propertyValue = property.name;
        let func = objectValue[propertyValue];
        return func.bind(objectValue);
    },
    //获取变量值
    Identifier(node, scope) {
        return scope[node.name];
    },
    NumericLiteral(node, scope) {
        return node.value;
    }

};

//执行入口
function evaluate(node, scope) {
    let handler = Handler[node.type];
    if (!handler) {
        throw `no ${node.type} type handler`;
    }
    return handler(node, scope);
}

//执行代码
const code = 'console.log("hello world")';
// 解析AST语法树
const ast = babylon.parse(code);
// 需要传入执行上下文
evaluate(ast, {console});
```