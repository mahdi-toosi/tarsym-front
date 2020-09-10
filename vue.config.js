const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    chainWebpack(config) {
        config.plugins.delete('prefetch');
        config.plugin('CompressionPlugin').use(CompressionPlugin);
    },
    configureWebpack: {
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                            return `npm.${packageName.replace('@', '')}`;
                        },
                    },
                },
            },
        },
    },
    pwa: {
        name: 'Tarsym',
        themeColor: '#4DBA87',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: '#22dda9',
    }
}