const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const coreDir = '../src/core/';
const viewDir = '../src/core/view/';
module.exports = {
    entry: {
        // Chrome Extension 逻辑层
        hook: path.join(__dirname, coreDir + 'hook.ts'),
        devtool: path.join(__dirname, coreDir + 'devtool.ts'),
        background: path.join(__dirname, coreDir + 'background.ts'),
        panel: path.join(__dirname, coreDir + 'panel.ts'),
        backend: path.join(__dirname, coreDir + 'backend.ts'),
        proxy: path.join(__dirname, coreDir + 'proxy.ts'),
        detector: path.join(__dirname, coreDir + 'detector.ts'),
        content: path.join(__dirname, coreDir + 'content.ts'),
        inject: path.join(__dirname, coreDir + 'inject.ts'),
        popup: path.join(__dirname, coreDir + 'popup.ts'),
        // React 视图层
        panelView: path.join(__dirname, viewDir, 'panel/panel.tsx')
    },
    output: {
        path: path.join(__dirname, '../dist/core'),
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: 'initial'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css?$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new webpack.IgnorePlugin(/screenshot$/),
        new CopyPlugin([
            { from: '.', to: '../public', context: './src/public' },
            { from: './src/manifest.json', to: '../manifest.json' }
        ])
    ]
};
