const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "none",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
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
    ],
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3000,
  },
};
