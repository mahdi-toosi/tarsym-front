const webpack = require("webpack");
// const CompressionPlugin = require("compression-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/statics/" : "/",
    outputDir: "statics",
    pwa: {
        name: "ترسیم",
        themeColor: "#4DBA87",
        // msTileColor: "#9fafad",
        msTileColor: "#9fafad",
        manifestOptions: {
            start_url: "/",
            background_color: "#9fafad",
        },
        appleMobileWebAppCapable: "yes",
        appleMobileWebAppStatusBarStyle: "#22dda9",
    },
    chainWebpack(config) {
        config.plugins.delete("prefetch");
        // config.plugin("CompressionPlugin").use(CompressionPlugin);
    },
    configureWebpack: {
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                            return `npm.${packageName.replace("@", "")}`;
                        },
                    },
                },
            },
        },
        plugins: [
            new FileManagerPlugin({
                events: {
                    onEnd: {
                        delete: ["./statics.zip"],
                        archive: [{ source: "statics", destination: "statics.zip" }],
                    },
                },
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new BundleAnalyzerPlugin(),
        ],
    },
};
