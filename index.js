var Promise = require('es6-promise').Promise;
var loadScript = require('./src/lib/loadScript.js');
var AutocompleteService = require('./src/autocomplete.js');
var Map = require('./src/map.js');
var Geocoder = require('./src/geocoder.js');
var PlacesService = require('./src/placesService.js');

var apiPromise = null;

/**
 * Load Google API
 * @returns Promise object
 */
function loadApi(apiUrl) {
    if (apiPromise) {
        return apiPromise
    }

    apiPromise = loadScript(apiUrl).then(apiLoadSuccess, apiLoadError);
    return apiPromise;
}

/**
 * Instantiate and returns AutocompleteService instance
 * @returns {AutocompleteService} AutocompleteService instance
 */
function getAutocompleteService() {
    var autocompleteService = new AutocompleteService();
    return autocompleteService;
}

/**
 * Instantiate and returns Geocoder instance
 * @returns {Geocoder} Geocoder instance
 */
function getGeocoderService() {
    var geocoder = new Geocoder();
    return geocoder;
}

/**
 * Instantiate and returns PlacesService instance
 * @returns {PlacesService} PlacesService instance
 */
function getPlacesService(map) {
    map = map || document.createElement('div');
    return new PlacesService(map);
}

/**
 * Instantiate and returns Map constructor
 * @returns {Map} Map constructor
 */
function getMap() {
    return Map;
}
/**
 * Returns api to load services
 * @returns {Object} Wrapper apis
 */
function apiLoadSuccess() {
    return {
        getAutocompleteService: getAutocompleteService,
        getGeocoderService: getGeocoderService,
        getPlacesService: getPlacesService,
        getMap: getMap
    };
}

/**
 * Returns AutocompleteService instance
 * @returns {Error} Error object for API loading issue
 */
function apiLoadError() {
    throw new Error('An error occured while trying to load api');
}


// Map module API
module.exports = {
    loadApi: loadApi
};
