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
    devtool: "inline-source-map",
    plugins: [
        new HtmlWebpackPlugin({
            title: "Testing",
            favicon: "./src/favicon.ico",
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
        ],
    },
};
