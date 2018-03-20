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
