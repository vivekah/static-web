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
      widgets: "./src/app.js",
      // superetteThankYou: './src/thank-you-scripts/clients/superette-thank-you.js',
      // eighteenEastThankYou: './src/thank-you-scripts/clients/18-east-thank-you.js',
      // americanProvenanceThankYou: './src/thank-you-scripts/clients/american-provenance-thank-you.js',
      // cleobellaThankYou: './src/thank-you-scripts/clients/cleobella-thank-you.js',
      // frankieCollectiveThankYou: './src/thank-you-scripts/clients/frankie-collective-thank-you.js',
      // joshRosebrookThankYou: './src/thank-you-scripts/clients/josh-rosebrook-thank-you.js',
      // korWaterThankYou: './src/thank-you-scripts/clients/kor-water-thank-you.js',
      // livingKoaThankYou: './src/thank-you-scripts/clients/living-koa-thank-you.js',
      // mateTheLabelThankYou: './src/thank-you-scripts/clients/mate-the-label-thank-you.js',
      // miracleNoodleThankYou: './src/thank-you-scripts/clients/miracle-noodle-thank-you.js',
      // mokuFoodsThankYou: './src/thank-you-scripts/clients/moku-foods-thank-you.js',
      // oasisThankYou: './src/thank-you-scripts/clients/oasis-thank-you.js',
      // pinkPandaThankYou: './src/thank-you-scripts/clients/pink-panda-thank-you.js',
      // sundaeThankYou: './src/thank-you-scripts/clients/sundae-school-thank-you.js',
      // sunscoopThankYou: './src/thank-you-scripts/clients/sunscoop-thank-you.js',
      // sweetNothingsThankYou: './src/thank-you-scripts/clients/sweet-nothings-thank-you.js',
      // theVintageTwinThankYou: './src/thank-you-scripts/clients/the-vintage-twin-thank-you.js',
      // paradeThankYou: './src/thank-you-scripts/clients/parade-thank-you.js',
      roots: './src/client-integrations/roots/index.js',
      instacart: './src/client-integrations/instacart/index.js',
      // foriaThankYou: './src/thank-you-scripts/clients/foria-thank-you.js',
      styles: './src/client-integrations/instacart/instacart.scss'
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
