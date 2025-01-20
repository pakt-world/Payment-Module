const { resolve } = require('node:path');

const dir =  __dirname
const cwd = process.cwd()

// VS Code ESLint extension sets `cwd` as project root and running the `lint`
// or base `turbo lint` command will the `cwd` to app directory. We need to
// append the app directory for VS Code ESLint extension to detect and
// properly parse the Typescript configuration (`tsconfig.node.json`)
// const project_dir = cwd.endsWith(dir) ? process.cwd() : `${cwd}/${dir}`
const project_dir = cwd.endsWith(dir) ? process.cwd() : `${dir}`
const project = resolve(project_dir, 'tsconfig.json')


module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "plugin:react/recommended",
        "prettier",
        "airbnb",
        "airbnb-typescript",
        "airbnb/hooks",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
        "plugin:react/jsx-runtime",
        "plugin:@tanstack/query/recommended",
        "eslint:recommended",
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    overrides: [],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
        // project: "./tsconfig.json",
        project
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
        "react/jsx-props-no-spreading": "off",
        "no-undef": "off",
        "no-nested-ternary": "off",
        "import/extensions": "off",
        "no-underscore-dangle": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "no-plusplus": "off",
        "import/prefer-default-export": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-misused-promises": "off", // Event handlers such as onClick, onSubmit, etc., are expected to be void functions, meaning they should not return anything. However, it seems passing a function that returns a Promise to one of these event handlers triggers this error.
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/unbound-method": "off", // Avoid referencing unbound methods which may cause unintentional scoping of `this`.If your function does not access `this`, you can annotate it with `this: void`, or consider using an arrow function instead.
        "react/function-component-definition": [
            2,
            {
                "namedComponents": [
                    "function-declaration",
                    "function-expression",
                    "arrow-function",
                ],
            },
        ],
        "react/require-default-props": "off",
        "import/no-extraneous-dependencies": "off",
        // Bad rules to disable
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "consistent-return": "off",
        "react/no-array-index-key": "off",
        "no-useless-escape": "off",
        // Temporary rules
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/non-nullable-type-assertion-style": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/lines-between-class-members": "off",
        "@typescript-eslint/no-throw-literal": "off",
    },
    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            node: {
                extensions: [".js", ".ts", ".tsx"],
            },
        },
    },
    ignorePatterns: ["**/*.scss"],
};
