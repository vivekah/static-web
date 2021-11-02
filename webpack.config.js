const path = require("path");
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
  console.log('env: ', env);
  return {
    plugins: [
      new Dotenv({
          path: `./env/.env.${env.environment}`
        }
      )
    ],
    entry: {
      widgets: "./src/index.js",
      // roots: './src/client-integrations/roots/index.js',
      // instacart: './src/client-integrations/instacart/index.js',
      // // styles: './src/client-integrations/instacart/instacart.scss'
    },
    output: {
      path: path.resolve(__dirname, "./public/js"),
      filename: "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          query: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
      ],
    },
    devServer: {
      contentBase: path.join(__dirname, "../public/js"),
      compress: true,
      writeToDisk: true,
    },
    resolve: {
      alias: {
        widgets: path.resolve(__dirname, 'src/app.js')
      },
      extensions: ['.js'],
    },
  }
};
