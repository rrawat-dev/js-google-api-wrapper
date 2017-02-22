var apiResponseStatus = require('../../src/apiResponseStatus');
var mapService = require('../../index.js');
var PREDICTION_TYPE = {
	PLACE: 'PLACE',
	QUERY: 'QUERY'
};

var DELAY = 100;
var autoCompleteTimeout;
var placeService;
//var $ = require('jQuery');
var target = document.querySelector('input[name="search"]');
var predictionsWrap = document.querySelector('.predictions-wrap');


// load google places api
var apiUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAXeUhU7ls2QVGj4tKECxvIy7LG5GNPeNA&libraries=places';
var autocompleteService;
var placesService;

mapService
	.loadApi(apiUrl)
	.then(init);

/*
 * Initializes autocomplete 
 */
function init(api) {
	autocompleteService = api.getAutocompleteService();
	placesService = api.getPlacesService();
	bindEvents();
}

/*
 * Bind keyup event handler to autocomplete textfield
 */
function bindEvents() {
	target.addEventListener('keyup', autoCompleteKeyUpHandler);

	document.querySelectorAll('.settings input[name="predictionType"]').forEach(function(element) {
		element.addEventListener('change', searchPlaces);
	});
	
	document.querySelectorAll('.settings input[name="types"]').forEach(function(element) {
		element.addEventListener('change', searchPlaces);
	});

	document.querySelectorAll('select[name="componentRestrictions"]').forEach(function(element) {
		element.addEventListener('change', searchPlaces);
	});

	document.querySelectorAll('input[name="offset"]').forEach(function(element) {
		element.addEventListener('change', searchPlaces);
	});

	document.querySelectorAll('input[name="location"]').forEach(function(element) {
		element.addEventListener('change', searchPlaces);
	});

	document.querySelectorAll('input[name="radius"]').forEach(function(element) {
		element.addEventListener('change', searchPlaces);
	});

	document.querySelectorAll('.predictions-wrap').forEach(function(element) {
		element.addEventListener('click', fetchDetail);
	});
}

/*
 * Autocomplete keyup event handler
 */
function autoCompleteKeyUpHandler() {

	if (autoCompleteTimeout) {
		clearTimeout(autoCompleteTimeout);
	}
	
	autoCompleteTimeout = setTimeout(searchPlaces, DELAY);
}

/*
 * Search google places
 */
function searchPlaces() {
	var predictionType = document.settingsForm.predictionType.value,
		input = document.searchForm.search.value;

	// empty string
	if (input.replace(/\s+/g, '') === '') {
		render('');
		return;
	}

	if (predictionType === PREDICTION_TYPE.PLACE) {
		autocompleteService
			.searchPlaces(getPlaceSearchOptions())
			.then(function(predictions) {
				render(getPredictionList(predictions));
			}, function(error) {
				render(error);
			});
	} else {
		autocompleteService
			.searchQueries(getQuerySearchOptions())
			.then(function(predictions) {
				render(getPredictionList(predictions));
			}, function(error) {
				render(error);
			});
	}
}

/*
 * Returns place search options
 */
function getPlaceSearchOptions() {
	var componentRestrictions = null,
		offset = null,
		location = null,
		radius = null,
		types = [];

	document.querySelectorAll('.settings-place-search input[name="types"]:checked').forEach(function(item) {
		types.push(item.value);
	});

	var options = {
		input: document.searchForm.search.value,
		types: types
	};

	// set componentRestrictions
	componentRestrictions = document.querySelector('.settings-place-search select[name="componentRestrictions"]').value;
	if (componentRestrictions !== "") {
		options.componentRestrictions = {
			country: componentRestrictions
		};
	}

	// set offset
	offset = document.querySelector('.settings-place-search input[name="offset"]').value;
	if (/^\d+$/.test()) {
		options.offset = parseInt(offset, 10);
	}

	// set location and radius
	location = document.querySelector('.settings-place-search input[name="location"]').value;
	radius = document.querySelector('.settings-place-search input[name="radius"]').value;

	if (location !== '' && radius !== '') {
		options.location = new google.maps.LatLng({
			lat: parseFloat(location.split(',')[0]),
			lng: parseFloat(location.split(',')[1])
		});

		options.radius = parseInt(radius, 10);
	}

	return options;
}

/*
 * Returns query search options
 */
function getQuerySearchOptions() {
	var offset = null,
		location = null,
		radius = null;


	var options = {
		input: document.searchForm.search.value
	};

	// set offset
	offset = document.querySelector('.settings-query-search input[name="offset"]').value;
	if (/^\d+$/.test(offset)) {
		options.offset = parseInt(offset, 10);
	}

	// set location and radius
	location = document.querySelector('.settings-query-search input[name="location"]').value;
	radius = document.querySelector('.settings-query-search input[name="radius"]');
	if (location !== '' && radius !== '') {
		options.location = new google.maps.LatLng({
			lat: parseFloat(location.split(',')[0]),
			lng: parseFloat(location.split(',')[1])
		});

		options.radius = parseInt(radius, 10);
	}

	return options;
}

/*
* Render html to DOM
*/
function render(html) {
	document.querySelector('.predictions-wrap').innerHTML = html;
}

/*
* Return prediction autocomplete item list
*/
function getPredictionList(predictions) {
	return '<ul>' + predictions.map(getPredictionItem).join('') + '</ul>';
}

/*
* Return prediction autocomplete item
*/
function getPredictionItem(prediction) {
	var item = '<strong>' + prediction.structured_formatting.main_text + '</strong>',
		placeId = prediction.place_id || '',
		style = prediction.types && prediction.types.indexOf('colloquial_area') > -1 ? 'color: red': '';

	if (prediction.secondaryText) {
		item += ' ' + prediction.secondaryText;
	}

	return '<li data-place-id="' + placeId + '" style="' + style + '">' + item + ' [' + (prediction.types || []).join(', ') + '] </li>';
}


/*
 * Fetch and toggle place detail
 */
function fetchDetail(evt) {
	var li = evt.target.nodeName === 'STRONG' ? evt.target.parentNode : evt.target,
		placeId = li.getAttribute('data-place-id'),
		detail = li.querySelector('div');
	
	if (placeId && detail === null) {
		placesService
			.getDetails({placeId: placeId})
			.then(function(place) {
				renderDetail(place, li)
			});
	} else {
		detail = li.querySelector('div');
		detail.style.display = detail.style.display === 'block' ? 'none' : 'block';
	}
}


/*
 * Render place detail
 */
function renderDetail(place, li) {
	var html,
		div = document.createElement('div');

	html = place.types.map(function(value) {
		return '<li>' + value + '</li>'
	}).join('');

	div.innerHTML = '<ul>' + html + '</ul>';
	li.appendChild(div);
}
