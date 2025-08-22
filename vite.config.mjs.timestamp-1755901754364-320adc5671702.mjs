// vite.config.mjs
import { defineConfig } from "file:///Users/beardkoda/Documents/projects/pakt/suite/pay-mod/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import react from "file:///Users/beardkoda/Documents/projects/pakt/suite/pay-mod/node_modules/@vitejs/plugin-react/dist/index.js";
import dts from "file:///Users/beardkoda/Documents/projects/pakt/suite/pay-mod/node_modules/vite-plugin-dts/dist/index.mjs";
import { visualizer } from "file:///Users/beardkoda/Documents/projects/pakt/suite/pay-mod/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { viteStaticCopy } from "file:///Users/beardkoda/Documents/projects/pakt/suite/pay-mod/node_modules/vite-plugin-static-copy/dist/index.js";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "file:///Users/beardkoda/Documents/projects/pakt/suite/pay-mod/node_modules/@tailwindcss/vite/dist/index.mjs";
import cssInjectedByJsPlugin from "file:///Users/beardkoda/Documents/projects/pakt/suite/pay-mod/node_modules/vite-plugin-css-injected-by-js/dist/esm/index.js";
import { readFileSync } from "fs";
var __vite_injected_original_import_meta_url = "file:///Users/beardkoda/Documents/projects/pakt/suite/pay-mod/vite.config.mjs";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var pkg = JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));
var moduleName = pkg.name.replace(/^@.*\//, "");
var author = pkg.author;
var version = pkg.version;
var license = pkg.license;
var description = pkg.description;
var banner = `
  /**
   * ${moduleName}.js
   * @summary ${description}
   * @version v${version}
   * @author  ${author}
   * @license Released under the ${license} license.
   * @copyright Pakt
   */
`;
var vite_config_default = defineConfig(({ command, mode }) => {
  const isProduction = mode === "production";
  return {
    plugins: [
      tailwindcss(),
      cssInjectedByJsPlugin(),
      react({
        // Use babel configuration defined in .babelrc.js
        babel: {
          configFile: true
        }
      }),
      dts({
        // Specify the entry root and output directory for declaration files
        entryRoot: resolve(__dirname, "src"),
        outDir: resolve(__dirname, "dist/types"),
        // outDir: ['dist/bundle-es', 'dist/bundle-cjs'],
        // Use the tsconfig file
        tsconfigPath: "./tsconfig.json",
        // Exclude test and app files in production, similar to Rollup config
        exclude: ["node_modules/**", "src/**/*.test.ts", "src/**/*.spec.ts", "src/test.tsx", "src/app/index.tsx"],
        // exclude: [
        //     'node_modules/**',
        //     'dist/**',
        //     ...(isProduction ? ['src/test.tsx', 'src/app/index.tsx'] : []),
        //     // Add other necessary excludes if any
        // ],
        insertTypesEntry: true,
        // Optional: Creates a single types entry point
        copyDtsFiles: false
        // Let dts handle consolidation
      }),
      // Only include analyzer in production builds or when specifically requested
      isProduction && visualizer({
        filename: "dist/stats.html",
        // Output analysis file
        open: false,
        // Don't open automatically
        gzipSize: true,
        brotliSize: true
      }),
      viteStaticCopy({
        targets: [
          {
            src: "src/assets/*",
            // Copy contents of assets
            dest: "assets"
            // Relative to respective output dirs (dist/bundle-es/assets, dist/bundle-cjs/assets)
          }
        ]
      })
    ].filter(Boolean),
    // Filter out falsy values like visualizer in dev mode
    // CSS processing is now handled by PostCSS config file with @tailwindcss/postcss
    // No need to configure postcss plugins here for Tailwind v4
    build: {
      outDir: "dist",
      // Base output directory
      sourcemap: true,
      minify: isProduction ? "esbuild" : false,
      // Minify only in production
      lib: {
        // Could also be a dictionary or array of multiple entry points.
        entry: path.resolve(__dirname, "src/index.ts"),
        // Adjust entry point as needed
        name: moduleName,
        // Global variable name for UMD build (if used)
        formats: ["es", "cjs"],
        // Output formats
        fileName: (format) => `payment-module.${format}.js`
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
        external: ["react", "react-dom", "react-dom/client"],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps (if UMD format is added)
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "react-dom/client": "ReactDOMClient"
          },
          // Preserve module structure for ES and CJS formats
          // preserveModules: true, // Keep module structure
          // preserveModulesRoot: 'src', // Root for preserved modules
          banner,
          exports: "named",
          // Ensure named exports are used
          // Adjust asset file names to land in the assets subfolder within each bundle dir
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith("css")) {
              return "styles.css";
            }
            return `assets/[name]-[hash].[ext]`;
          }
        },
        // Suppress warnings related to "use client" directive
        onwarn(warning, warn) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes('"use client"')) {
            return;
          }
          if (warning.code === "PRESERVE_MODULES_CONFLICT_WITH_CSS" && isProduction) {
            return;
          }
          if (warning.code === "EMPTY_CHUNK") {
            return;
          }
          if (warning.code === "EMPTY_BUNDLE") {
            if (warning.message.includes(".css")) {
              return;
            }
          }
          warn(warning);
        }
      }
      // Target environments (optional, defaults are usually fine)
      // target: 'esnext',
    },
    // Development server configuration (replacing serve and livereload)
    server: {
      host: "0.0.0.0",
      port: 4234
      // Match the old port
    },
    // Define global constants like process.env.NODE_ENV
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode)
    },
    resolve: {
      alias: {
        // Replicate tsconfig paths
        "@": path.resolve(__dirname, "./src")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2JlYXJka29kYS9Eb2N1bWVudHMvcHJvamVjdHMvcGFrdC9zdWl0ZS9wYXktbW9kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYmVhcmRrb2RhL0RvY3VtZW50cy9wcm9qZWN0cy9wYWt0L3N1aXRlL3BheS1tb2Qvdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9iZWFyZGtvZGEvRG9jdW1lbnRzL3Byb2plY3RzL3Bha3Qvc3VpdGUvcGF5LW1vZC92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInO1xuaW1wb3J0IHsgdml0ZVN0YXRpY0NvcHkgfSBmcm9tICd2aXRlLXBsdWdpbi1zdGF0aWMtY29weSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJztcbmltcG9ydCBjc3NJbmplY3RlZEJ5SnNQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tY3NzLWluamVjdGVkLWJ5LWpzJ1xuLy8gVGFpbHdpbmQgdjQgYW5kIFBvc3RDU1MgaW1wb3J0cyBhcmUgbm8gbG9uZ2VyIG5lZWRlZCBpbiBWaXRlIGNvbmZpZ1xuLy8gc2luY2Ugd2UncmUgdXNpbmcgdGhlIGRlZGljYXRlZCBAdGFpbHdpbmRjc3MvcG9zdGNzcyBwbHVnaW5cblxuLy8gUmVwbGljYXRlIF9fZGlybmFtZSBiZWhhdmlvciBpbiBFUyBtb2R1bGVzXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG4vLyBSZWFkIHBhY2thZ2UuanNvbiB0byBnZXQgbW9kdWxlIG5hbWUgYW5kIHZlcnNpb24gKG9wdGlvbmFsLCBmb3IgYmFubmVyIG9yIG91dHB1dCBuYW1pbmcpXG4vLyBDb25zaWRlciB1c2luZyBpbXBvcnQgYXNzZXJ0aW9ucyBvbmNlIHN0YWJsZSwgb3Igc3RpY2sgdG8gZnMvcmVhZEZpbGVTeW5jIGlmIG5lZWRlZC5cbi8vIGltcG9ydCBwa2cgZnJvbSAnLi9wYWNrYWdlLmpzb24nIGFzc2VydCB7IHR5cGU6ICdqc29uJyB9OyAvLyBFeGFtcGxlIHdpdGggaW1wb3J0IGFzc2VydGlvblxuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuY29uc3QgcGtnID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3BhY2thZ2UuanNvbicpLCAndXRmLTgnKSk7XG5jb25zdCBtb2R1bGVOYW1lID0gcGtnLm5hbWUucmVwbGFjZSgvXkAuKlxcLy8sICcnKTtcbmNvbnN0IGF1dGhvciA9IHBrZy5hdXRob3I7XG5jb25zdCB2ZXJzaW9uID0gcGtnLnZlcnNpb247XG5jb25zdCBsaWNlbnNlID0gcGtnLmxpY2Vuc2U7XG5jb25zdCBkZXNjcmlwdGlvbiA9IHBrZy5kZXNjcmlwdGlvbjtcblxuY29uc3QgYmFubmVyID0gYFxuICAvKipcbiAgICogJHttb2R1bGVOYW1lfS5qc1xuICAgKiBAc3VtbWFyeSAke2Rlc2NyaXB0aW9ufVxuICAgKiBAdmVyc2lvbiB2JHt2ZXJzaW9ufVxuICAgKiBAYXV0aG9yICAke2F1dGhvcn1cbiAgICogQGxpY2Vuc2UgUmVsZWFzZWQgdW5kZXIgdGhlICR7bGljZW5zZX0gbGljZW5zZS5cbiAgICogQGNvcHlyaWdodCBQYWt0XG4gICAqL1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuICAgIGNvbnN0IGlzUHJvZHVjdGlvbiA9IG1vZGUgPT09ICdwcm9kdWN0aW9uJztcblxuICAgIHJldHVybiB7XG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgIHRhaWx3aW5kY3NzKCksXG4gICAgICAgICAgICBjc3NJbmplY3RlZEJ5SnNQbHVnaW4oKSxcbiAgICAgICAgICAgIHJlYWN0KHtcbiAgICAgICAgICAgICAgICAvLyBVc2UgYmFiZWwgY29uZmlndXJhdGlvbiBkZWZpbmVkIGluIC5iYWJlbHJjLmpzXG4gICAgICAgICAgICAgICAgYmFiZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnRmlsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBkdHMoe1xuICAgICAgICAgICAgICAgIC8vIFNwZWNpZnkgdGhlIGVudHJ5IHJvb3QgYW5kIG91dHB1dCBkaXJlY3RvcnkgZm9yIGRlY2xhcmF0aW9uIGZpbGVzXG4gICAgICAgICAgICAgICAgZW50cnlSb290OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgICAgICAgICAgICAgIG91dERpcjogcmVzb2x2ZShfX2Rpcm5hbWUsICdkaXN0L3R5cGVzJyksXG4gICAgICAgICAgICAgICAgLy8gb3V0RGlyOiBbJ2Rpc3QvYnVuZGxlLWVzJywgJ2Rpc3QvYnVuZGxlLWNqcyddLFxuICAgICAgICAgICAgICAgIC8vIFVzZSB0aGUgdHNjb25maWcgZmlsZVxuICAgICAgICAgICAgICAgIHRzY29uZmlnUGF0aDogJy4vdHNjb25maWcuanNvbicsXG4gICAgICAgICAgICAgICAgLy8gRXhjbHVkZSB0ZXN0IGFuZCBhcHAgZmlsZXMgaW4gcHJvZHVjdGlvbiwgc2ltaWxhciB0byBSb2xsdXAgY29uZmlnXG4gICAgICAgICAgICAgICAgZXhjbHVkZTogWydub2RlX21vZHVsZXMvKionLCdzcmMvKiovKi50ZXN0LnRzJywgJ3NyYy8qKi8qLnNwZWMudHMnLCAnc3JjL3Rlc3QudHN4JywgJ3NyYy9hcHAvaW5kZXgudHN4J10sXG4gICAgICAgICAgICAgICAgLy8gZXhjbHVkZTogW1xuICAgICAgICAgICAgICAgIC8vICAgICAnbm9kZV9tb2R1bGVzLyoqJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgJ2Rpc3QvKionLFxuICAgICAgICAgICAgICAgIC8vICAgICAuLi4oaXNQcm9kdWN0aW9uID8gWydzcmMvdGVzdC50c3gnLCAnc3JjL2FwcC9pbmRleC50c3gnXSA6IFtdKSxcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gQWRkIG90aGVyIG5lY2Vzc2FyeSBleGNsdWRlcyBpZiBhbnlcbiAgICAgICAgICAgICAgICAvLyBdLFxuICAgICAgICAgICAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsIC8vIE9wdGlvbmFsOiBDcmVhdGVzIGEgc2luZ2xlIHR5cGVzIGVudHJ5IHBvaW50XG4gICAgICAgICAgICAgICAgY29weUR0c0ZpbGVzOiBmYWxzZSwgLy8gTGV0IGR0cyBoYW5kbGUgY29uc29saWRhdGlvblxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAvLyBPbmx5IGluY2x1ZGUgYW5hbHl6ZXIgaW4gcHJvZHVjdGlvbiBidWlsZHMgb3Igd2hlbiBzcGVjaWZpY2FsbHkgcmVxdWVzdGVkXG4gICAgICAgICAgICBpc1Byb2R1Y3Rpb24gJiYgdmlzdWFsaXplcih7XG4gICAgICAgICAgICAgICAgZmlsZW5hbWU6ICdkaXN0L3N0YXRzLmh0bWwnLCAvLyBPdXRwdXQgYW5hbHlzaXMgZmlsZVxuICAgICAgICAgICAgICAgIG9wZW46IGZhbHNlLCAvLyBEb24ndCBvcGVuIGF1dG9tYXRpY2FsbHlcbiAgICAgICAgICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBicm90bGlTaXplOiB0cnVlLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB2aXRlU3RhdGljQ29weSh7XG4gICAgICAgICAgICAgICAgIHRhcmdldHM6IFtcbiAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogJ3NyYy9hc3NldHMvKicsIC8vIENvcHkgY29udGVudHMgb2YgYXNzZXRzXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0OiAnYXNzZXRzJyAvLyBSZWxhdGl2ZSB0byByZXNwZWN0aXZlIG91dHB1dCBkaXJzIChkaXN0L2J1bmRsZS1lcy9hc3NldHMsIGRpc3QvYnVuZGxlLWNqcy9hc3NldHMpXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICBdLmZpbHRlcihCb29sZWFuKSwgLy8gRmlsdGVyIG91dCBmYWxzeSB2YWx1ZXMgbGlrZSB2aXN1YWxpemVyIGluIGRldiBtb2RlXG4gICAgICAgIC8vIENTUyBwcm9jZXNzaW5nIGlzIG5vdyBoYW5kbGVkIGJ5IFBvc3RDU1MgY29uZmlnIGZpbGUgd2l0aCBAdGFpbHdpbmRjc3MvcG9zdGNzc1xuICAgICAgICAvLyBObyBuZWVkIHRvIGNvbmZpZ3VyZSBwb3N0Y3NzIHBsdWdpbnMgaGVyZSBmb3IgVGFpbHdpbmQgdjRcbiAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIG91dERpcjogJ2Rpc3QnLCAvLyBCYXNlIG91dHB1dCBkaXJlY3RvcnlcbiAgICAgICAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgICAgICAgIG1pbmlmeTogaXNQcm9kdWN0aW9uID8gJ2VzYnVpbGQnIDogZmFsc2UsIC8vIE1pbmlmeSBvbmx5IGluIHByb2R1Y3Rpb25cbiAgICAgICAgICAgIGxpYjoge1xuICAgICAgICAgICAgICAgIC8vIENvdWxkIGFsc28gYmUgYSBkaWN0aW9uYXJ5IG9yIGFycmF5IG9mIG11bHRpcGxlIGVudHJ5IHBvaW50cy5cbiAgICAgICAgICAgICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLCAvLyBBZGp1c3QgZW50cnkgcG9pbnQgYXMgbmVlZGVkXG4gICAgICAgICAgICAgICAgbmFtZTogbW9kdWxlTmFtZSwgLy8gR2xvYmFsIHZhcmlhYmxlIG5hbWUgZm9yIFVNRCBidWlsZCAoaWYgdXNlZClcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJ2VzJywgJ2NqcyddLCAvLyBPdXRwdXQgZm9ybWF0c1xuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiAoZm9ybWF0KSA9PiBgcGF5bWVudC1tb2R1bGUuJHtmb3JtYXR9LmpzYCxcbiAgICAgICAgICAgICAgICAvLyBmaWxlTmFtZTogKGZvcm1hdCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vICAgICAvLyBDdXN0b20gZnVuY3Rpb24gdG8gcGxhY2UgZmlsZXMgaW4gZm9ybWF0LXNwZWNpZmljIHN1YmRpcmVjdG9yaWVzXG4gICAgICAgICAgICAgICAgLy8gICAgIGlmIChmb3JtYXQgPT09ICdlcycpIHJldHVybiBgYnVuZGxlLWVzLyR7bW9kdWxlTmFtZX0uanNgO1xuICAgICAgICAgICAgICAgIC8vICAgICBpZiAoZm9ybWF0ID09PSAnY2pzJykgcmV0dXJuIGBidW5kbGUtY2pzLyR7bW9kdWxlTmFtZX0uY2pzYDtcbiAgICAgICAgICAgICAgICAvLyAgICAgcmV0dXJuIGAke21vZHVsZU5hbWV9LmpzYDsgLy8gRGVmYXVsdCBmYWxsYmFja1xuICAgICAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0byBleHRlcm5hbGl6ZSBkZXBzIHRoYXQgc2hvdWxkbid0IGJlIGJ1bmRsZWRcbiAgICAgICAgICAgICAgICAvLyBpbnRvIHlvdXIgbGlicmFyeVxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1kb20vY2xpZW50J10sXG4gICAgICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFByb3ZpZGUgZ2xvYmFsIHZhcmlhYmxlcyB0byB1c2UgaW4gdGhlIFVNRCBidWlsZFxuICAgICAgICAgICAgICAgICAgICAvLyBmb3IgZXh0ZXJuYWxpemVkIGRlcHMgKGlmIFVNRCBmb3JtYXQgaXMgYWRkZWQpXG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWN0OiAnUmVhY3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3JlYWN0LWRvbSc6ICdSZWFjdERPTScsXG4gICAgICAgICAgICAgICAgICAgICAgICAncmVhY3QtZG9tL2NsaWVudCc6ICdSZWFjdERPTUNsaWVudCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vIFByZXNlcnZlIG1vZHVsZSBzdHJ1Y3R1cmUgZm9yIEVTIGFuZCBDSlMgZm9ybWF0c1xuICAgICAgICAgICAgICAgICAgICAvLyBwcmVzZXJ2ZU1vZHVsZXM6IHRydWUsIC8vIEtlZXAgbW9kdWxlIHN0cnVjdHVyZVxuICAgICAgICAgICAgICAgICAgICAvLyBwcmVzZXJ2ZU1vZHVsZXNSb290OiAnc3JjJywgLy8gUm9vdCBmb3IgcHJlc2VydmVkIG1vZHVsZXNcbiAgICAgICAgICAgICAgICAgICAgYmFubmVyOiBiYW5uZXIsXG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHM6ICduYW1lZCcsIC8vIEVuc3VyZSBuYW1lZCBleHBvcnRzIGFyZSB1c2VkXG4gICAgICAgICAgICAgICAgICAgIC8vIEFkanVzdCBhc3NldCBmaWxlIG5hbWVzIHRvIGxhbmQgaW4gdGhlIGFzc2V0cyBzdWJmb2xkZXIgd2l0aGluIGVhY2ggYnVuZGxlIGRpclxuICAgICAgICAgICAgICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFzc2V0SW5mby5uYW1lICYmIGFzc2V0SW5mby5uYW1lLmVuZHNXaXRoKCdjc3MnKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJzdHlsZXMuY3NzXCI7IC8vIFBsYWNlIGNzcyBkaXJlY3RseSBpbiBidW5kbGUgZm9sZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQbGFjZSBvdGhlciBhc3NldHMgbGlrZSBmb250cy9pbWFnZXMgaW4gYW4gYXNzZXRzIHN1YmZvbGRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGBhc3NldHMvW25hbWVdLVtoYXNoXS5bZXh0XWA7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgLy8gU3VwcHJlc3Mgd2FybmluZ3MgcmVsYXRlZCB0byBcInVzZSBjbGllbnRcIiBkaXJlY3RpdmVcbiAgICAgICAgICAgICAgICBvbndhcm4od2FybmluZywgd2Fybikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuaW5nLmNvZGUgPT09ICdNT0RVTEVfTEVWRUxfRElSRUNUSVZFJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgd2FybmluZy5tZXNzYWdlLmluY2x1ZGVzKCdcInVzZSBjbGllbnRcIicpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBJZ25vcmUgdGhpcyBzcGVjaWZpYyB3YXJuaW5nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gU3VwcHJlc3MgcHJlc2VydmVNb2R1bGVzIHdhcm5pbmcgZm9yIENTUyBmaWxlcyBpZiBuZWVkZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gVml0ZSBvZnRlbiBoYW5kbGVzIENTUyBkaWZmZXJlbnRseSwgYnV0IGtlZXAgdGhpcyBpbiBtaW5kIGlmIHdhcm5pbmdzIGFwcGVhclxuICAgICAgICAgICAgICAgICAgICBpZiAod2FybmluZy5jb2RlID09PSAnUFJFU0VSVkVfTU9EVUxFU19DT05GTElDVF9XSVRIX0NTUycgJiYgaXNQcm9kdWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAvLyBTdXBwcmVzcyB3YXJuaW5ncyBhYm91dCBlbXB0eSBjaHVua3MgaWYgdGhleSBhcmlzZSwgb2Z0ZW4gZnJvbSB0eXBlIGdlbmVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKHdhcm5pbmcuY29kZSA9PT0gJ0VNUFRZX0NIVU5LJykge1xuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGNoZWNrIHRvIGlnbm9yZSBlbXB0eSBDU1MgY2h1bmsgd2FybmluZ3Mgb2Z0ZW4gY2F1c2VkIGJ5IFBvc3RDU1MgcHJvY2Vzc2luZ1xuICAgICAgICAgICAgICAgICAgICBpZiAod2FybmluZy5jb2RlID09PSAnRU1QVFlfQlVORExFJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSB3YXJuaW5nIGlzIGFib3V0IGFuIGVtcHR5IENTUyBjaHVuayBsaWtlbHkgZnJvbSBQb3N0Q1NTXG4gICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBjb25kaXRpb24gbWlnaHQgbmVlZCBhZGp1c3RtZW50IGJhc2VkIG9uIHRoZSBleGFjdCB3YXJuaW5nIG1lc3NhZ2Uvc3RydWN0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod2FybmluZy5tZXNzYWdlLmluY2x1ZGVzKCcuY3NzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBJZ25vcmUgZW1wdHkgQ1NTIGNodW5rIHdhcm5pbmdzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgd2Fybih3YXJuaW5nKTsgLy8gUGFzcyBvdGhlciB3YXJuaW5ncyBhbG9uZ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gVGFyZ2V0IGVudmlyb25tZW50cyAob3B0aW9uYWwsIGRlZmF1bHRzIGFyZSB1c3VhbGx5IGZpbmUpXG4gICAgICAgICAgICAvLyB0YXJnZXQ6ICdlc25leHQnLFxuICAgICAgICB9LFxuICAgICAgICAvLyBEZXZlbG9wbWVudCBzZXJ2ZXIgY29uZmlndXJhdGlvbiAocmVwbGFjaW5nIHNlcnZlIGFuZCBsaXZlcmVsb2FkKVxuICAgICAgICBzZXJ2ZXI6IHtcbiAgICAgICAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICAgICAgICAgIHBvcnQ6IDQyMzQsIC8vIE1hdGNoIHRoZSBvbGQgcG9ydFxuICAgICAgICB9LFxuICAgICAgICAvLyBEZWZpbmUgZ2xvYmFsIGNvbnN0YW50cyBsaWtlIHByb2Nlc3MuZW52Lk5PREVfRU5WXG4gICAgICAgIGRlZmluZToge1xuICAgICAgICAgICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogSlNPTi5zdHJpbmdpZnkobW9kZSksXG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICAgICAgLy8gUmVwbGljYXRlIHRzY29uZmlnIHBhdGhzXG4gICAgICAgICAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfTtcbn0pOyAiXSwKICAibWFwcGluZ3MiOiAiO0FBQXNWLFNBQVMsb0JBQW9CO0FBQ25YLFNBQVMsZUFBZTtBQUN4QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsc0JBQXNCO0FBQy9CLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLDJCQUEyQjtBQVdsQyxTQUFTLG9CQUFvQjtBQXBCd0wsSUFBTSwyQ0FBMkM7QUFjdFEsSUFBTSxhQUFhLGNBQWMsd0NBQWU7QUFDaEQsSUFBTSxZQUFZLEtBQUssUUFBUSxVQUFVO0FBTXpDLElBQU0sTUFBTSxLQUFLLE1BQU0sYUFBYSxLQUFLLFFBQVEsV0FBVyxjQUFjLEdBQUcsT0FBTyxDQUFDO0FBQ3JGLElBQU0sYUFBYSxJQUFJLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFDaEQsSUFBTSxTQUFTLElBQUk7QUFDbkIsSUFBTSxVQUFVLElBQUk7QUFDcEIsSUFBTSxVQUFVLElBQUk7QUFDcEIsSUFBTSxjQUFjLElBQUk7QUFFeEIsSUFBTSxTQUFTO0FBQUE7QUFBQSxPQUVSLFVBQVU7QUFBQSxnQkFDRCxXQUFXO0FBQUEsaUJBQ1YsT0FBTztBQUFBLGdCQUNSLE1BQU07QUFBQSxtQ0FDYSxPQUFPO0FBQUE7QUFBQTtBQUFBO0FBSzFDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDL0MsUUFBTSxlQUFlLFNBQVM7QUFFOUIsU0FBTztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ0wsWUFBWTtBQUFBLE1BQ1osc0JBQXNCO0FBQUEsTUFDdEIsTUFBTTtBQUFBO0FBQUEsUUFFRixPQUFPO0FBQUEsVUFDSCxZQUFZO0FBQUEsUUFDaEI7QUFBQSxNQUNKLENBQUM7QUFBQSxNQUNELElBQUk7QUFBQTtBQUFBLFFBRUEsV0FBVyxR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
