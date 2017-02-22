var extend = require('extend');
/**
 * Google Marker wrapper component
 * @constructor
 * @param {object} Map options
 */
function Marker(options) {
    this.options = options;

    this.nativeMarker = this.createNativeMarker(this.options.markerOptions);
    this.map = this.options.markerOptions.map || null;
    this.nativeInfoWindow = null;
    this.isInfoWindowPersist = false;

    // set infoWindow
    if (this.options.infoWindowContent) {
        this.createInfoWindow(options.infoWindowContent);
    }

    // bind marker events
    this.bindEvents();
}

// Marker instance API
var MarkerAPI = {

    /**
     * Bind callbacks to marker events
     */
    bindEvents: function() {
        var self = this;

        // bind mouseover event
        if (this.options.mouseoverCallback) {
            this.nativeMarker.addListener('mouseover', this.options.mouseoverCallback.bind(self, self));
        }

        // bind mouseout event
        if (this.options.mouseoutCallback) {
            this.nativeMarker.addListener('mouseout', this.options.mouseoutCallback.bind(self, self));
        }

        // bind click event
        if (this.options.clickCallback) {
            this.nativeMarker.addListener('click', this.options.clickCallback.bind(self, self));
        }
    },

    /**
     * Remove marker from map
     * @returns {Boolean}
     */
    remove: function() {
        this.nativeMarker.setMap(null);
        this.nativeMarker = null;
        return true;
    },

    /**
     * Hide marker on map
     */
    hide: function() {
        this.nativeMarker.setMap(null);
    },

    /**
     * Show marker on map
     */
    show: function() {
        this.nativeMarker.setMap(this.map.nativeMap);
    },

    /**
     * Returns google.maps.Marker instance
     */
    getNativeMarker: function() {
        return this.nativeMarker;
    },

    /**
     * Create google.maps.Marker instance for Marker
     * @param {Object} Google map marker options
     */
    createNativeMarker: function(options) {
        return new google.maps.Marker(options);
    },

    /**
     * Open InfoWindow on marker
     */
    openInfoWindow: function() {
        if (this.nativeInfoWindow) {
            this.nativeInfoWindow.open(this.map, this.nativeMarker);
        }
    },

    /**
     * Open InfoWindow on marker and set persist flag to TRUE
     */
    openInfoWindowAndPersist: function() {
        if (this.nativeInfoWindow) {
            this.map.hideAllInfoWindow();
            this.isInfoWindowPersist = true;
            this.nativeInfoWindow.open(this.map, this.nativeMarker);
        }
    },

    /**
     * Close InfoWindow on marker
     */
    closeInfoWindow: function() {
        if (this.nativeInfoWindow && this.isInfoWindowPersist === false) {
            this.nativeInfoWindow.close();
        }
    },

    /**
     * Create infowindow on marker
     * @param {arg} InfoWindow content string or Callback for content string
     */
    createInfoWindow: function(arg) {
        if (arg) {
            this.nativeInfoWindow = new google.maps.InfoWindow({
                content: typeof arg === 'function' ? arg() : arg
            });
        }
    },

    /**
     * Set map instance to marker.
     * This does not add marker to the map. Required to call Marker's method in respect to Map
     */
    setMap: function(map) {
        this.map = map;
    },

    /**
     * Returns marker's infowindow instance
     * This does not add marker to the map. Required to call Marker's method in respect to Map
     */
    getNativeInfoWindow: function() {
        return this.nativeInfoWindow;
    }
};

// module API
extend(Marker.prototype, MarkerAPI);
module.exports = Marker;