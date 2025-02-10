const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    target: "electron-main",
    entry: {
        main: "./main.js" 
    },
    output: {
        path: path.resolve(__dirname, "dist"), 
        filename: "[name].bundle.js" 
    },
    node: {
        __dirname: false, 
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "index.html", to: "index.html" }, 
                { from: "static", to: "static" }, 
            ]
        })
    ]
};
