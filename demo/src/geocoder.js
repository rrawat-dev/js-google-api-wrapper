var apiUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAXeUhU7ls2QVGj4tKECxvIy7LG5GNPeNA&libraries=places';
var mapService = require('../../index.js');
var geocoderService = null;


function init() {        
    mapService
        .loadApi(apiUrl)
        .then(function(api) {
            geocoderService = api.getGeocoderService();
        });
    
    bindEvents();
}


function bindEvents(evt) {
    var form = document.forms['geocodeSearch'];

    form.addEventListener('submit', function(evt) {
        var search = form.search.value;
        var searchType = form.searchType.value;
        var input = {};
        
        evt.preventDefault();

        if (searchType === 'location') {
            input.location = {
                lat: Number(search.split(',')[0]),
                lng: Number(search.split(',')[1])
            };
        } else if (searchType === 'placeId') {
            input.placeId = search;
        } else {
            input.address = search;
        }

        geocoderService.geocode(input).then(renderAddress, renderError);
    });
}

function renderAddress(address) {
    document.getElementById('geocodeinfo').innerHTML = JSON.stringify(address);
}

function renderError(error) {
    document.getElementById('geocodeinfo').innerHTML = error;
}

//
init();
