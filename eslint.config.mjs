import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                // Browser globals
                window: "readonly",
                document: "readonly",
                console: "readonly",
                fetch: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                localStorage: "readonly",
                sessionStorage: "readonly",
                navigator: "readonly",
                // Node globals
                process: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                module: "readonly",
                require: "readonly",
                Buffer: "readonly",
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "off", // TypeScript handles this
        },
    },
    {
        ignores: [
            ".next/**",
            "node_modules/**",
            "*.config.js",
            "*.config.mjs",
        ],
    },
];
