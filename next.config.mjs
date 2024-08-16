/** @type {import('next').NextConfig} */
import withLlamaIndex from "llamaindex/next";
import webpack from "./webpack.config.mjs";

const nextConfig = {
    webpack,
    experimental: {
        outputFileTracingIncludes: {
            "/api/**/*": [
                "./node_modules/**/*.wasm"
            ]
        }
    }
};

// use withLlamaIndex to add necessary modifications for llamaindex library
export default withLlamaIndex(nextConfig);
