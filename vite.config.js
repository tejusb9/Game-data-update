import { readFileSync } from "fs";
import { sveltekit } from '@sveltejs/kit/vite';
import { timeFormat } from "d3";
import path from "path";
import svg from "vite-plugin-svgstring";
import dsv from "@rollup/plugin-dsv";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const timestamp = timeFormat("%Y-%m-%d-%H:%M")(new Date());

const config = {
    publicDir: 'docs/assets', // Serve static files from here
    define: {
        __VERSION__: JSON.stringify(version),
        __TIMESTAMP__: JSON.stringify(timestamp)
    },
    server: {
        port: 3000,
        fs: {
            // Specify the path that Vite's dev server is allowed to serve content from
            allow: [
                // Add other paths as necessary
                'docs/assets', // Allow serving files from the 'docs/assets' directory
                'src', // This is your source directory
                '.svelte-kit', // If needed, for SvelteKit internal files
                'node_modules', // If needed, for dependency files
            ]
        }
    },
    plugins: [
        sveltekit(),
        dsv(),
        svg()
    ],
    resolve: {
        alias: {
            "$actions": path.resolve("./src/actions"),
            "$components": path.resolve("./src/components"),
            "$data": path.resolve("./src/data"),
            "$routes": path.resolve("./src/routes"),
            "$stores": path.resolve("./src/stores"),
            "$styles": path.resolve("./src/styles"),
            "$svg": path.resolve("./src/svg"),
            "$utils": path.resolve("./src/utils")
        }
    }
};

export default config;
