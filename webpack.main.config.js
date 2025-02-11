const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    target: "electron-main",
    entry: {
        main: "./src/main/main.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js" 
    },
    node: {
        __dirname: false, 
    },
    resolve: {
        alias: {
            "@src":path.resolve(__dirname,'src'),
            "@static":path.resolve(__dirname,'src/static'),
            "@pages":path.resolve(__dirname,'pages'),
            "@root":path.resolve(__dirname,''),
        }
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "pages/index.html", to: "pages/index.html" },
                { from: "src/static", to: "src/static" },
            ]
        })
    ]
};
