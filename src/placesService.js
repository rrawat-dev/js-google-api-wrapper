var Promise = require('es6-promise').Promise;
var extend = require('extend');
var apiResponseStatus = require('./apiResponseStatus');

/**
 * PlacesService wrapper component for google.maps.places.PlacesService(
 * @constructor
 * @param {object} google.maps.PlacesService 
 */
function PlacesService(map) {
    this.placesService = new google.maps.places.PlacesService(map);
}

var PlacesServiceAPI = {
    /**
     * Returns place detail for supplied place id
     * @param {string} google.maps.places.PlaceDetailsRequest
     * @returns {Promise} Promise object to be resolved with google.maps.places.PlaceResult object or error message
     */
     getDetails: function(input) {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.placesService.getDetails(input, function(place, status) {
                if (apiResponseStatus.hasError(status)) {
                    reject(apiResponseStatus.getErrorByStatus(status));
                } else {
                    resolve(place);
                }
            });
        });
     }
}

// module API
extend(PlacesService.prototype, PlacesServiceAPI);
module.exports = PlacesService;