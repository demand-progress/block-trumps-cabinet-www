module.exports = {
    // devServer: {
    //     inline: true
    // },
    entry: "./js/call.jsx",
    output: {
        path: __dirname + '/js',
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            loader: 'babel',
            query: {
                presets: ['latest', 'react']
            }
        }]
    }
};
