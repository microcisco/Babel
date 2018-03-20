const babel = require("babel-core");

const result = babel.transform("const result = 1 + 1;",{
    plugins:[
        require("./plug")
    ]
});

console.log(result.code);