const path = require('path');

module.exports = {
    entry: [
        // Set up an ES6-ish environment
        'babel-polyfill',
        './src/main.js'
    ],
    output: {
        path: __dirname + './js',
        filename: 'calender.js'
    },
    module: {
        loaders: [{
            loader: "babel-loader",

            // Skip any files outside of your project's `src` directory
            include: [
                __dirname + "/src",
            ],

            // Only run `.js` and `.jsx` files through Babel
            test: /\.jsx?$/,

            // Options to configure babel with
            query: {
                plugins: ['transform-runtime'],
                presets: ['es2015'],
            }
        } ]
    }
};
