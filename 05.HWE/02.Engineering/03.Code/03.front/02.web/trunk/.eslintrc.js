module.exports = {
    "env": {
        "browser": true,
        "node":true
    },
    //"extends": "eslint:recommended",
    'extends': [
        "eslint:recommended",
        'plugin:react/recommended'
    ],
    "parserOptions": {
        "ecmaVersion": 6, //指定ECMAScript支持的版本，6为ES6
        "sourceType": "module", //指定来源的类型，有两种”script”或”module”
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        }
    },
    "plugins": [
        "react"
    ],
    "parser": "babel-eslint",
    "rules": {
        'no-console': 'off',
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};