require('js-marker-clusterer');
var extend = require('extend');
var Marker = require('./marker');
var NativeMap = null;
var apiResponseStatus = require('./apiResponseStatus');

/**
 * Wrapper component for google.maps.Map
 * @constructor
 * @param {HTMLElement} Map container DOM element
 * @param {object} Map options
 */
function Map(el, options) {
    this.options = options;

    this.nativeMap = new google.maps.Map(el, options.mapOptions);
    this.placesService = new google.maps.places.PlacesService(this.nativeMap);
    this.markerClusterer = new MarkerClusterer(this.nativeMap, [], this.options.clusterConfig || {});

    this.markers = [];
    this.latLngBounds = null;

    this.bindEvents();
}

// Map instance API
var MapAPI = {
    /**
     * Bind callbacks to map events
     */
    bindEvents: function() {
        var self = this;

        // bind mouseover event
        if (this.options.clickCallback) {
            this.nativeMap.addListener('click', this.options.clickCallback.bind(self, self));
        }
    },


    /**
     * Remove existing markers on the Map and add new ones if specified
     * @param {Array} Markers array list
     */
    setMarkers: function(markers) {
        var self = this;

        // remove all markers
        self.removeAllMarkers();
        self.markers = this.createMarkers(markers);

        return self.markers;
    },

    /**
     * Remove all markers from the Map
     */
    removeAllMarkers: function() {
        var self = this;

        // Clears all clusters and markers from the clusterer
        this.markerClusterer.clearMarkers();

        // remove existing markers
        self.markers = self.markers.map(function(marker) {
            marker.remove();
        });

        // remove all marker references
        self.markers.length = 0;
    },

    /**
     * Set Map view to map markers lat/lng bound view
     */
    fitBounds: function() {
        var self = this;

        self.latLngBounds = new google.maps.LatLngBounds();

        self.markers.map(function(marker) {
            self.latLngBounds.extend({
                lat: marker.nativeMarker.position.lat(),
                lng: marker.nativeMarker.position.lng()
            });
        });

        self.nativeMap.fitBounds(self.latLngBounds);
    },

    /**
     * Checks if any infowindow is opened on the map
     */
    isInfoWindowVisible: function() {
        return this.markers.filter(function(marker) {
            return marker.isInfoWindowPersist === true;
        }).length > 0;
    },

    /**
     * Hides all infowindows on the map
     */
    hideAllInfoWindow: function() {
        this.markers.map(function(marker) {
            marker.isInfoWindowPersist = false;
            marker.closeInfoWindow();
        });
    },

    /**
     * Search near by places for the map markers lat/lng bound
     * @param {Object} google.maps.places.PlaceSearchRequest
     * @returns {Promise} Promise object to be resolved with google.maps.places.PlaceResult Array or error message
     */
    nearbySearch: function(options) {
        var self = this;

        options.bounds = this.latLngBounds;

        return new Promise(function(resolve, reject) {
            self.placesService.nearbySearch(options, function(placeResult, status) {
                if (apiResponseStatus.hasError(status)) {
                    reject(apiResponseStatus.getStatusError(status));
                } else {
                    resolve(placeResult || []);
                }
            });
        });
    },

    /**
     * Returns map markers array by lookup into custom data key/value 
     * @param {string} Custom data key
     * @param {string} Custom data key value
     * @returns {Array} Map markers array
     */
    getMarkersByDataKey: function(key, value) {
        return this.markers.filter(function(marker) {
            return marker.data[key] === value;
        });
    },

    /**
     * Returns array of Map's google.maps.Marker instances
     * @returns {Array} google.maps.Marker Array
     */
    getNativeMarkers: function() {
        return this.markers.map(function(marker) {
            return marker.nativeMarker;
        });
    },

    /**
     * Create markers on the map
     * @param {Object} MarkerOptions
     * @returns {Object} Created markers array
     */
    createMarkers: function(options) {
        var self = this;

        return options.map(function(options) {
            var marker;

            // set options
            options = extend({}, options);
            options.map = self.options.clusterConfig ? null : self.nativeMap;

            // set marker
            marker = new Marker(options);
            marker.setMap(self);

            // set cluster
            if (self.options.clusterConfig) {
                self.markerClusterer.addMarker(marker.nativeMarker);
            }

            return marker;
        });
    }
};

// module API
extend(Map.prototype, MapAPI);
module.exports = Map;