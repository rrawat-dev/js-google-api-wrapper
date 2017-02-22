# js-google-api-wrapper
This plugin is published under the MIT license.

Javascript module that provides wrapper services and classes for Google APIs like AutocompleteService, Map, Markers and Geocode service. Currently provides following wrapper components for Google APIs.

- AutocompleteService (google.maps.places.AutocompleteService)
- Map (google.maps.Map)
- Marker (google.maps.Marker)
- Geocoder (google.maps.Geocoder)

## AutocompleteService
Wraps google.maps.places.AutocompleteService service to provide search interface for places and query preditions.

### Usage
```
var googleApiWrapper = require('js-google-api-wrapper');
var API_URL = 'API_URL';

googleApiWrapper.loadApi(API_URL)
    .then(function(api) {
        var autocompleteService = api.getAutocompleteService();
        autocompleteService.searchPlaces()
            .then(successHandler, errorHandler);
    });
```

### searchPlaces(google.maps.places.AutocompletionRequest)
Searches for place predictions. Returns Promise object resolved/rejected with Google API response.

### searchQueries(google.maps.places.QueryAutocompletionRequest)
Searches for query predictions. Returns Promise object resolved/rejected with Google API response.

### getPlaceDetailById(placeId)
Searches for place detail. Returns Promise object resolved/rejected with Google API response.



## GeocoderService
Wraps google.maps.places.Geocoder service to geocode/reverse geocode search input.

### Usage
```
var googleApiWrapper = require('js-google-api-wrapper');
var API_URL = 'API_URL';

googleApiWrapper.loadApi(API_URL)
    .then(function(api) {
        var geocoderService = api.getGeocoderService();
        geocoderService.geocode()
            .then(successHandler, errorHandler);
    });
```

### geocode(google.maps.GeocoderRequest)
Geocode/Reverse Gocode search input. Returns Promise object resolved/rejected with Google API response.


## Map
Wraps google.maps.Map service to create and use Google Map object.

### Usage
```
var googleApiWrapper = require('js-google-api-wrapper');
var API_URL = 'API_URL';

googleApiWrapper.loadApi(API_URL)
    .then(function(api) {
        var Map = api.getMap();
        var map = new Map(HTMLElement, mapOptions);
    });
```
### bindEvents()
Bind map events to the options callback.

### setMarkers(markers)
Add new set of markers on the Map and Remove existing markers if there any on the Map.

### createMarkers()
Create new Markers on the page. Use setMarkers() to remove existing markers on the Map.

### removeAllMarkers()
Remove all markers on the Map.

### fitBounds()
Set Map view around map markers latlng bounds.

### isInfoWindowVisible()
Check if there any marker's infowindow is opened on the Map.

### hideAllInfoWindow()
Hide all infowindows on the Map.

### nearbySearch(google.maps.places.PlaceSearchRequest)
Search for near by places on the map.

### getMarkersByDataKey(key, value)
Returns array of Map markers matched on marker's custom data with key/value parameters.

### getNativeMarkers()
Returns array of native google.maps.Marker markers on the Map.


## Marker
Wraps google.maps.Marker service to create and use Google Map Marker object.

### bindEvents()
Bind marker events to the options callback.

### remove()
Remove marker from the Map.

### show()
Show marker on the Map.

### hide()
Hide marker on the Map.

### hide()
Hide marker on the Map.

### getNativeMarker()
Returns native google.maps.Marker instance.

### createNativeMarker(google.maps.MarkerOptions)
Create new google.maps.Marker instance.

### openInfoWindow()
Open infowindow on Marker.

### openInfoWindowAndPersist()
Open infowindow on Marker and set persist flag to TRUE.

### closeInfoWindow()
Close infowindow on Marker.

### createInfoWindow(arg)
Create infowindow for Marker. Parameter arg should be a string or a callback that returns string. 

### setMap
Set Map reference to Marker.

### getNativeInfoWindow()
Returns marker's google.maps.InfoWindow instance.