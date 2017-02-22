var Promise = require('es6-promise').Promise;
var extend = require('extend');
var apiResponseStatus = require('./apiResponseStatus');

/**
 * Geocoder wrapper component for google.maps.Geocoder
 * @constructor
 * @param {object} google.maps.Geocoder 
 */
function Geocoder(GoogleGeocoder) {
    this.nativeGeocoder = new google.maps.Geocoder();
}

var GeocoderAPI = {
    /**
     * Geocode/Reverse geocode searched terms
     * @param {Object} google.maps.GeocoderRequest
     * @returns {Promise} Promise object to be resolved with google.maps.GeocoderResult object or error message
     */
    geocode: function(search) {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.nativeGeocoder.geocode(search, function(results, status) {
                if (apiResponseStatus.hasError(status)) {
                    reject(apiResponseStatus.getStatusByError(status));
                } else {
                    resolve(results || []);
                }
            });
        });
    }
}

// module API
extend(Geocoder.prototype, GeocoderAPI);
module.exports = Geocoder;