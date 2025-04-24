import { defineConfig } from 'vite';
import { resolve } from 'path'
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from 'tailwindcss'; // Import tailwindcss
import autoprefixer from 'autoprefixer'; // Import autoprefixer
import postcssImport from 'postcss-import'; // Import postcss-import

// Replicate __dirname behavior in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get module name and version (optional, for banner or output naming)
// Consider using import assertions once stable, or stick to fs/readFileSync if needed.
// import pkg from './package.json' assert { type: 'json' }; // Example with import assertion
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const moduleName = pkg.name.replace(/^@.*\//, '');
const author = pkg.author;
const version = pkg.version;
const license = pkg.license;
const description = pkg.description;

const banner = `
  /**
   * ${moduleName}.js
   * @summary ${description}
   * @version v${version}
   * @author  ${author}
   * @license Released under the ${license} license.
   * @copyright Pakt
   */
`;

export default defineConfig(({ command, mode }) => {
    const isProduction = mode === 'production';

    return {
        plugins: [
            react({
                // Use babel configuration defined in .babelrc.js
                babel: {
                    configFile: true,
                },
            }),
            dts({
                // Specify the entry root and output directory for declaration files
                entryRoot: resolve(__dirname, 'src'),
                outDir: resolve(__dirname, 'dist/types'),
                // outDir: ['dist/bundle-es', 'dist/bundle-cjs'],
                // Use the tsconfig file
                tsconfigPath: './tsconfig.json',
                // Exclude test and app files in production, similar to Rollup config
                exclude: ['node_modules/**','src/**/*.test.ts', 'src/**/*.spec.ts', 'src/test.tsx', 'src/app/index.tsx'],
                // exclude: [
                //     'node_modules/**',
                //     'dist/**',
                //     ...(isProduction ? ['src/test.tsx', 'src/app/index.tsx'] : []),
                //     // Add other necessary excludes if any
                // ],
                insertTypesEntry: true, // Optional: Creates a single types entry point
                copyDtsFiles: false, // Let dts handle consolidation
            }),
            // Only include analyzer in production builds or when specifically requested
            isProduction && visualizer({
                filename: 'dist/stats.html', // Output analysis file
                open: false, // Don't open automatically
                gzipSize: true,
                brotliSize: true,
            }),
            viteStaticCopy({
                 targets: [
                     {
                        src: 'src/assets/*', // Copy contents of assets
                        dest: 'assets' // Relative to respective output dirs (dist/bundle-es/assets, dist/bundle-cjs/assets)
                     }
                 ]
            }),
        ].filter(Boolean), // Filter out falsy values like visualizer in dev mode
        css: {
             postcss: {
                 plugins: [
                    postcssImport(),
                    tailwindcss(), // Use the imported tailwindcss
                    autoprefixer(), // Use the imported autoprefixer
                 ],
             },
         },
        build: {
            outDir: 'dist', // Base output directory
            sourcemap: true,
            minify: isProduction ? 'esbuild' : false, // Minify only in production
            lib: {
                // Could also be a dictionary or array of multiple entry points.
                entry: path.resolve(__dirname, 'src/index.ts'), // Adjust entry point as needed
                name: moduleName, // Global variable name for UMD build (if used)
                formats: ['es', 'cjs'], // Output formats
                fileName: (format) => `payment-module.${format}.js`,
                // fileName: (format) => {
                //     // Custom function to place files in format-specific subdirectories
                //     if (format === 'es') return `bundle-es/${moduleName}.js`;
                //     if (format === 'cjs') return `bundle-cjs/${moduleName}.cjs`;
                //     return `${moduleName}.js`; // Default fallback
                // },
            },
            rollupOptions: {
                // Make sure to externalize deps that shouldn't be bundled
                // into your library
                external: ['react', 'react-dom', 'react-dom/client'],
                output: {
                    // Provide global variables to use in the UMD build
                    // for externalized deps (if UMD format is added)
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                        'react-dom/client': 'ReactDOMClient',
                    },
                    // Preserve module structure for ES and CJS formats
                    // preserveModules: true, // Keep module structure
                    // preserveModulesRoot: 'src', // Root for preserved modules
                    banner: banner,
                    exports: 'named', // Ensure named exports are used
                    // Adjust asset file names to land in the assets subfolder within each bundle dir
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name && assetInfo.name.endsWith('css') ) {
                            return "styles.css"; // Place css directly in bundle folder
                        }
                        // Place other assets like fonts/images in an assets subfolder
                        return `assets/[name]-[hash].[ext]`;
                    },
                },
                 // Suppress warnings related to "use client" directive
                onwarn(warning, warn) {
                    if (
                        warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
                        warning.message.includes('"use client"')
                    ) {
                        return; // Ignore this specific warning
                    }
                    // Suppress preserveModules warning for CSS files if needed
                    // Vite often handles CSS differently, but keep this in mind if warnings appear
                    if (warning.code === 'PRESERVE_MODULES_CONFLICT_WITH_CSS' && isProduction) {
                         return;
                    }
                     // Suppress warnings about empty chunks if they arise, often from type generation
                    if (warning.code === 'EMPTY_CHUNK') {
                       return;
                    }
                    // Add check to ignore empty CSS chunk warnings often caused by PostCSS processing
                    if (warning.code === 'EMPTY_BUNDLE') {
                         // Check if the warning is about an empty CSS chunk likely from PostCSS
                         // This condition might need adjustment based on the exact warning message/structure
                        if (warning.message.includes('.css')) {
                             return; // Ignore empty CSS chunk warnings
                        }
                    }
                    warn(warning); // Pass other warnings along
                },
            },
            // Target environments (optional, defaults are usually fine)
            // target: 'esnext',
        },
        // Development server configuration (replacing serve and livereload)
        server: {
            host: '0.0.0.0',
            port: 4234, // Match the old port
        },
        // Define global constants like process.env.NODE_ENV
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode),
        },
        resolve: {
            alias: {
                // Replicate tsconfig paths
                '@': path.resolve(__dirname, './src'),
            },
        },
    };
}); 