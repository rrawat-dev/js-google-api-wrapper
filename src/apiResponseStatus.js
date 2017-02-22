module.exports = {

    /**
     * Google API Response Status
     */
    status: {
        OK: 'OK',
        ZERO_RESULTS: 'ZERO_RESULTS',
        INVALID_REQUEST: 'INVALID_REQUEST',
        OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
        REQUEST_DENIED: 'REQUEST_DENIED',
        UNKNOWN_ERROR: 'UNKNOWN_ERROR'
    },

    /**
     * Returns error message for Google API response status
     * @param {string} Response status
     * @returns {string} Error message
     */
    getErrorByStatus: function(status) {
        var error = null;

        switch (status) {
            case this.status.INVALID_REQUEST:
                error = 'This request was invalid';
                break;

            case this.status.OVER_QUERY_LIMIT:
                error = 'The application has gone over its request quota';
                break;

            case this.status.REQUEST_DENIED:
                error = 'The application is not allowed to use the PlacesService';
                break;

            case this.status.UNKNOWN_ERROR:
                error = 'The PlacesService request could not be processed due to a server error. The request may succeed if you try again.';
                break;
            default:
                error = null;
        }

        return error;
    },

    /**
     * Check if response status has error
     * @param {string} Response status
     * @returns {boolean} Returns TRUE if response status has error
     */
    hasError: function(status) {
        return [this.status.OK, this.status.ZERO_RESULTS].indexOf(status) === -1;
    }
};