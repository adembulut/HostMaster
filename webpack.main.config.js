const path = require("path");

module.exports = {
    mode: "development",
    target: "electron-main",
    entry: {
        main: "./src/main/main.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
    },
    node: {
        __dirname: false,
    },
    resolve: {
        alias: {
            "@src": path.resolve(__dirname, 'src'),
            "@static": path.resolve(__dirname, 'src/static'),
            "@pages": path.resolve(__dirname, 'pages'),
            "@root": path.resolve(__dirname, ''),
        }
    },
    plugins: [

    ]
};
