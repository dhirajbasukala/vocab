var path = require("path");
var webpack = require("webpack");

module.exports ={
    entry: [
        'react-hot-loader/patch',
        //activate HMR for React

        'webpack-dev-server/client?http://localhost:8080',
        //bundle the client for webpack dev server
        //and connect to the provided endpoint

        'webpack/hot/only-dev-server',
        //bundle the client for hot reloading
        //only- means to only hot reload for successful updates

        './src/index.js'
    ]
    ,
    output:{
        filename: "bundle.min.js",
        path: path.resolve(__dirname, "dist")
    },
    devServer:{
        hot:true,
        inline:true,
        host:"0.0.0.0",
        port:8080,
        contentBase: path.resolve(__dirname, "src"),
        historyApiFallback: true,

    },
    devtool: "source-map",
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader',
                    options: {
                        presets: ['env','react']
                    }

                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.scss$/,
                loader: "style-loader!css-loader?sourceMap!sass-loader?sourceMap"
            },

        ]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
}