var Promise = require('es6-promise').Promise;
var extend = require('extend');
var apiResponseStatus = require('./apiResponseStatus');

/**
 * AutocompleteService wrapper component for google.maps.places.AutocompleteService
 * @constructor
 * @param {object} google.maps.places.AutocompleteService class
 * @param {object} google.maps.places.PlacesService class
 */
function AutocompleteService() {
    this.service = new google.maps.places.AutocompleteService();
}

var AutocompleteServiceAPI = {
    /**
     * Search google api place predictions
     * @param {string} google.maps.places.AutocompletionRequest
     * @returns {Promise} Promise object to be resolved with google.maps.places.PlaceResult Array or error message
     */
    searchPlaces: function(input) {
        var service = this.service;

        return new Promise(function(resolve, reject) {
            service.getPlacePredictions(input, function(predictions, status) {
                if (apiResponseStatus.hasError(status)) {
                    reject(apiResponseStatus.getErrorByStatus(status));
                } else {
                    resolve(predictions || []);
                }
            });
        });
    },

    /**
     * Search google api query predictions
     * @param {string} google.maps.places.QueryAutocompletionRequest
     * @returns {Promise} Promise object to be resolved with google.maps.places.PlaceResult Array or error message
     */
    searchQueries: function(input) {
        var service = this.service;

        return new Promise(function(resolve, reject) {
            service.getQueryPredictions(input, function(predictions, status) {
                if (apiResponseStatus.hasError(status)) {
                    reject(apiResponseStatus.getErrorByStatus(status));
                } else {
                    resolve(predictions || []);
                }
            });
        });
    }      
};

// module API
extend(AutocompleteService.prototype, AutocompleteServiceAPI);
module.exports = AutocompleteService;