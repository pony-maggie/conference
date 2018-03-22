const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
module.exports = {
  devtool: 'eval-source-map',

  entry:  __dirname + "/app/javascripts/app.js",
  output: {
    path: __dirname + "/build",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: "./build",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true//实时刷新
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
          test: /\.css$/,
          use: [
                  {
                        loader: "style-loader"
                  },{
                        loader: "css-loader"
                  }
              ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./app/index.html",
      filename: "./index.html"
    })
  ]
};

