const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    target: "electron-renderer",
    entry: {
        renderer: "./static/js/index.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, 
                    "css-loader",
                ],
            },
        ],
    },
    resolve: {
        alias: {
            "@src":path.resolve(__dirname,'src'),
            "@static":path.resolve(__dirname,'src/static'),
            "@pages":path.resolve(__dirname,'pages'),
            "@root":path.resolve(__dirname,''),
        }
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "pages/index.html", to: "pages/index.html" },
                { from: "static", to: "static" },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css", 
        })
    ],
};
