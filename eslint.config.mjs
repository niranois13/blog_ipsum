import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["dist/**", "node_modules/**", "build/**", "coverage/**"]),
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        plugins: {
            js,
            react: pluginReact,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            prettier: prettierPlugin,
        },
        extends: ["js/recommended"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.browser, ...globals.node },
            parserOptions: {
                ecmaVersion: "latest",
                ecmaFeatures: { jsx: true },
                sourceType: "module",
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            // JS général
            "no-unused-vars": "warn",
            "no-console": "off",
            "react/react-in-jsx-scope": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "prettier/prettier": [
                "error",
                {
                    semi: true,
                    singleQuote: false,
                    tabWidth: 4,
                    trailingComma: "es5",
                    printWidth: 100,
                },
            ],
        },
    },
    pluginReact.configs.flat.recommended,
]);
