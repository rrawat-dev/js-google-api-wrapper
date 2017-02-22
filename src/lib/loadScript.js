var Promise = require('es6-promise').Promise;

/**
 * Load api script
 * @param {string} Api Url
 * @returns Promise object
 */
function loadApi(src) {
    return new Promise(function (resolve, reject) {
        var s;
        s = document.createElement('script');
        s.src = src;
        s.setAttribute('async', 'async');
        s.setAttribute('defer', 'defer');
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

// module API
module.exports = loadApi;