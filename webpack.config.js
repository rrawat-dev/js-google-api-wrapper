module.exports = {
    entry: {
        autocomplete: "./demo/src/autocomplete.js",
        map: "./demo/src/map.js",
        geocoder: "./demo/src/geocoder.js"
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].bundle.js"
    },
};