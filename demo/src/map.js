var apiUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAXeUhU7ls2QVGj4tKECxvIy7LG5GNPeNA&libraries=places';
var mapService = require('../../index.js');
var properties = require('./data.js');
var mapEl = document.querySelector('.map');
var mapObj = null;

window.winMap = mapObj;

function init() {
    bindEvent();
        
    mapService
        .loadApi(apiUrl)
        .then(function(api) {
            createMap(api.getMap());
        });
}

function bindEvent() {
    document.querySelector('input[name="placeType"]').addEventListener('change', placeTypeSearch);
}

function createMap(Map) {
    mapObj = new Map(mapEl, {
        mapOptions: {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        }, 
        clusterConfig: {imagePath: 'images/m'},
        clickCallback: hideAllInfoWindows
    });
    
    setTimeout(function() {
        addDataMarkers();
    }, 4000);
}

function onMarkerMouseover(marker) {
    if (marker.map.isInfoWindowVisible() === false) {
        marker.openInfoWindow();
    }
}


function onMarkerMouseout(marker) {
    if (marker.map.isInfoWindowVisible() === false) {
        marker.closeInfoWindow();
    }
}

function onMarkerClick(marker) {
    marker.openInfoWindowAndPersist();
}

function placeTypeSearch(evt) {
    var search = {};
    if (evt.target.checked && evt.target.value === 'restaurants') {
        search = getPlaceTypeSearchRequest('restaurants');


        mapObj.nearbySearch(search)
            .then(function(places) {
                var markers = places.map(function(item) {
                    return {
                        markerOptions: {
                            position: {lat: Number(item.geometry.location.lat()), lng: Number(item.geometry.location.lng())},
                            title: item.name,
                            label: item.name
                        },
                        mouseoverCallback: onMarkerMouseover,
                        mouseoutCallback: onMarkerMouseout,
                        clickCallback: onMarkerClick,
                        infoWindowContent: 'This is a restaurant'
                    };
                });

                mapObj.setMarkers(markers);
                mapObj.fitBounds();
            });
    } else {
        addDataMarkers();
    }
}

function getPlaceTypeSearchRequest(placeType) {
    return {
        type: placeType
    };
}

function hideAllInfoWindows() {
    mapObj.hideAllInfoWindow();
}


function addDataMarkers() {
        
    var markers = properties.data.map(function(item, index) {
        return {
            markerOptions: {
                position: {lat: Number(item.lat), lng: Number(item.longitude)},
                title: item.brand,
                label: item.brand
            },
            mouseoverCallback: onMarkerMouseover,
            mouseoutCallback: onMarkerMouseout,
            clickCallback: onMarkerClick,
            infoWindowContent: 'This is a default marker',
            data: {
                index: index,
                dataIndex: 'data' + index
            }
        };
    });

    mapObj.setMarkers(markers);
    mapObj.fitBounds();

}

//
init();
