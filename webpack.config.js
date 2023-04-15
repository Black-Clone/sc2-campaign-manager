const path = require("path");
const webpack = require("webpack");
const SriPlugin = require('webpack-subresource-integrity');
const crypto = require("crypto");
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm == "md4" ? "sha256" : algorithm);

module.exports = {
	entry: "./renderer.tsx",
	target: "electron-renderer",
	mode: "development",
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: "babel-loader",
				//options: { presets: ["@babel/env"] }
			},
			{ 
				test: /\.tsx?$/, 
				exclude: /(node_modules|bower_components)/,
				loader: "ts-loader"
			},
			
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.scss$/,
				use: [
					"style-loader", 
					"css-loader",
					{
						loader: 'sass-loader',
						options: {
						  sassOptions: {
							includePaths: ['./node_modules'],
						  },
						},
					  },
				]
			},
        ]
    },
	resolve: { 
		extensions: ["*", ".js", ".jsx", ".ts", ".tsx", ".json"] 
	},
	/*externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },*/
	output: {
		path: path.join(__dirname, "/dist/"),
		publicPath: "./dist/",
		filename: "../bundle.js",
		crossOriginLoading: "anonymous"
	},
	devServer: {
		contentBase: path.join(__dirname, "public/"),
		port: 3000,
		publicPath: "http://localhost:3000/dist/",
		hotOnly: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	    new SriPlugin({
			hashFuncNames: ['sha256', 'sha384'],
			enabled: true,
		})
	]
};
