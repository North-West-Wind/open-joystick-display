const path = require("path");

module.exports = {
  entry: {
    main: "./app/js/index.ts"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
		fallback: {
			path: require.resolve("path-browserify")
		}
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "app"),
  },
};