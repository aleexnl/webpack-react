const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    devServer: {
        static: "./dist",
    },
    devtool: "eval",
    plugins: [
        new HtmlWebpackPlugin({
            title: "Testing",
            favicon: "./src/favicon.ico",
            template: "./src/index.html",
        }),
        new MiniCssExtractPlugin(),
    ],
    optimization: {
        minimizer: [`...`, new CssMinimizerPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /nodeModules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
};
