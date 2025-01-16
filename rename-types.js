"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// rename-types.ts
var fs = require("fs");
var path = require("path");
var bundles = {
    es: "dist/bundle-es",
    cjs: "dist/bundle-cjs",
    browser: "dist/issue-resolution",
};
// Define the path to the original and new file
var folders = [
    path.resolve(__dirname, bundles.browser),
    path.resolve(__dirname, bundles.cjs),
    path.resolve(__dirname, bundles.es),
];
// Function to rename `index.d.ts` to `multi-entry.d.ts` in each folder
folders.forEach(function (typesDir) {
    var oldFile = path.join(typesDir, "index.d.ts");
    var newFile = path.join(typesDir, "multi-entry.d.ts");
    // Check if `index.d.ts` exists in the folder, then rename it
    if (fs.existsSync(oldFile)) {
        fs.rename(oldFile, newFile, function (err) {
            if (err) {
                console.error("Error renaming index.d.ts in ".concat(typesDir, ":"), err);
            }
            else {
                console.log("index.d.ts has been renamed to multi-entry.d.ts in ".concat(typesDir));
            }
        });
    }
    else {
        console.log("index.d.ts not found in ".concat(typesDir, ", skipping rename."));
    }
});
