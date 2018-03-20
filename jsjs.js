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