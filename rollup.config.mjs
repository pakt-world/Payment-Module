/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */

import * as path from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { babel } from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import tailwindcss from "tailwindcss";
import pluginTypescript from "@rollup/plugin-typescript";
import pluginCommonjs from "@rollup/plugin-commonjs";
import pluginNodeResolve from "@rollup/plugin-node-resolve";
// import polyfillNode from "rollup-plugin-polyfill-node";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";
import terser from "@rollup/plugin-terser";
import autoprefixer from "autoprefixer";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import analyze from "rollup-plugin-analyzer";
import multiEntry from "@rollup/plugin-multi-entry";
import copy from "rollup-plugin-copy";
import image from "@rollup/plugin-image";
import inject from '@rollup/plugin-inject';
// import peerDepsExternal from "rollup-plugin-peer-deps-external";

/* -------------------------------------------------------------------------- */
/*                            Internal Dependencies                           */
/* -------------------------------------------------------------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgConfigPath = path.resolve("package.json");
const tsconfigPath = path.resolve("tsconfig.json");
const defaultTsConfig = JSON.parse(readFileSync(tsconfigPath, "utf-8"));
const pkg = JSON.parse(readFileSync(pkgConfigPath, "utf-8"));

const isProductionEnvironment = process.env.NODE_ENV === "production";

const moduleName = pkg.name.replace(/^@.*\//, "");

const inputFileName = [
    "src/**/*.ts",
    isProductionEnvironment ? "!src/{test,app}/**/*.tsx" : "src/**/*.tsx",
];

const author = pkg.author;

const bundles = {
    es: "dist/bundle-es",
    cjs: "dist/bundle-cjs",
    browser: "dist/payment-module",
};

const banner = `
  /**
   * ${moduleName}.js 
   * @summary ${pkg.description}
   * @version v${pkg.version}
   * @author  ${author}
   * @license Released under the ${pkg.license} license.
   * @copyright Pakt
   */
`;

const pluginsSetup = (bundle) => ({
    external: ["react", "react-dom", "react-dom/client"],
    plugins: [
        // peerDepsExternal(),
        multiEntry(),
        postcss({
            plugins: [postcssImport(), tailwindcss(), autoprefixer()],
            minimize: true,
        }),
        pluginTypescript({
            ...defaultTsConfig.compilerOptions,
            ...{
                declaration: true,
                emitDeclarationOnly: true,
                outDir: `${bundle}`,
                declarationDir: `${bundle}`,
                exclude: [
                    "node_modules",
                    "dist",
                    ...(isProductionEnvironment
                        ? ["src/test.tsx", "src/app/index.tsx"]
                        : []),
                ],
            },
        }),
        json(),
        image(),
        analyze({
            hideDeps: true,
            summaryOnly: true,
            filter: (module) => {
                // Exclude node_modules from analysis
                return !/node_modules/.test(module.id);
            },
        }),
        babel({
            babelHelpers: "bundled",
            configFile: path.resolve(__dirname, ".babelrc.js"),
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            exclude: "node_modules/**",
        }),
        pluginCommonjs({
            extensions: [".js", ".jsx", ".ts", ".tsx", ".cjs"],
            transformMixedEsModules: true,
        }),
        replace({
            "process.env.NODE_ENV": JSON.stringify(
                isProductionEnvironment ? "production" : "development"
            ),
            preventAssignment: true,
        }),
        // polyfillNode(),
        pluginNodeResolve({
            browser: bundle === bundles.browser ? true : false,
            preferBuiltins: false,
            extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs"],
        }),
        copy({
            targets: [
                { src: "src/assets", dest: `${bundle}` }, // Copy font files to dist
            ],
        }),
        inject({
            Buffer: ['buffer', 'Buffer'], // Polyfill Buffer globally
        }),
    ],
    onwarn(warning, warn) {
        // Suppress warnings related to "use client" directive
        if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" &&
            warning.message.includes('"use client"')
        ) {
            return; // Ignore this specific warning
        }
        warn(warning); // Otherwise, pass the warning along
    },
});

export default [
    // Browser bundle - Runs only in development
    {
        input: inputFileName,
        output: [
            {
                name: moduleName,
                dir: bundles.browser,
                format: "esm",
                sourcemap: "inline",
                banner,
                // preserveModules: true,
                plugins: isProductionEnvironment
                    ? [terser()]
                    : [
                          serve({
                              verbose: true,
                              historyApiFallback: false,
                              host: "0.0.0.0",
                              port: 4234,
                          }),
                          livereload("dist"),
                      ],
            },
        ],
        ...pluginsSetup(bundles.browser),
    },
    // ES module bundle - Runs only in production
    isProductionEnvironment && {
        input: inputFileName,
        output: [
            {
                dir: bundles.es,
                format: "es",
                sourcemap: true,
                preserveModules: true,
                banner,
                exports: "named",
            },
        ],
        ...pluginsSetup(bundles.es),
    },
    // CommonJS bundle - Runs only in production
    isProductionEnvironment && {
        input: inputFileName,
        output: [
            {
                dir: bundles.cjs,
                format: "cjs",
                sourcemap: true,
                preserveModules: true,
                banner,
                exports: "named",
            },
        ],
        ...pluginsSetup(bundles.cjs),
    },
].filter(Boolean);
