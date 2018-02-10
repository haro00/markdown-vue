/**
 * 开发脚本
 */

const STATIC_DIST = '/app/dist';
const HTML_DIST = '/app/dist';
const STATIC_PREFIX = 'http://localhost:3000/dist/';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

console.log('开发...');
module.exports = {
    
    entry: [
        path.join(process.cwd(), '/src/example/app.js'),
    ],
    output: {
        path: path.join(process.cwd(), STATIC_DIST),
        filename: '[name].js',
        publicPath: STATIC_PREFIX,
        chunkFilename: '[name].js'
    },
    devServer: {
        inline: true,
        contentBase: path.join(process.cwd(), STATIC_DIST)
    },
    resolve: {
        extensions: ['.js', '.vue'],
    },
    devtool: '#source-map',
    cache: true,
    
    plugins: [
        
        new webpack.HotModuleReplacementPlugin(),
        
        new webpack.NoEmitOnErrorsPlugin(),
   
        new webpack.DefinePlugin({
            __SERVER__: true,
            __DEVELOPMENT__: true,
            __DEVTOOLS__: true,
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            },
        }),
        
        new HtmlWebpackPlugin({
            filename: path.join(process.cwd(), HTML_DIST, '/index.html'),
            template: path.join(process.cwd(), '/src/example/template.html'),
            favicon: path.join(process.cwd(), '/src/example/favicon.ico'),
            inject: false,
            minify: {
                caseSensitive: true,
                collapseWhitespace: true
            },
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackHarddiskPlugin(),
    ],
    
    /**
     * loaders
     */
    module: {
        rules: [
            {
                test: /(\.vue|\.js)$/,
                enforce: 'pre',
                include: path.join(process.cwd() + '/src'),
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            // js loader
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [
                    path.join(process.cwd() + '/src'),
                ]
            },
            // vue loader
            {
                test: /\.vue$/i,
                loader: 'vue-loader',
                exclude: /node_modules/
            },
            // scss loader
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            // svg
            {
                test: /\.svg$/,
                include: path.join(process.cwd() + '/src/images/svg'),
                loader: 'svg-sprite-loader',
                options: {
                    symbolId: 'icon-[name]'
                }
            },
        ]
    }
};