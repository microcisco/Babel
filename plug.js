const t = require('babel-types');
const visitor = {
    BinaryExpression(path) {
        const node = path.node;
        let result;
        // 两边都是数字数字
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
            // 将节点表达式替换成result字面量
            path.replaceWith(t.numericLiteral(result));
            let parentPath = path.parentPath;
            // 存在父节点 && 向上遍历父级节点
            parentPath && visitor.BinaryExpression.call(this, parentPath);
        }
    }
};

module.exports = function (babel) {
    return {
        visitor
    };
};