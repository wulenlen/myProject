const path = require('path'),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    {CleanWebpackPlugin} = require("clean-webpack-plugin")

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve('./dist'),
        filename: 'js/bundle.js'
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }
                
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',

        }),

        new CleanWebpackPlugin()
    ]
}