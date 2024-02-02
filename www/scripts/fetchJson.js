/**
 * Asynchronously fetches JSON data from a specified URL using the Fetch API.
 *
 * @param {string} url - The URL to fetch JSON data from.
 * @param {string} [method="GET"] - The HTTP method for the request (default is "GET").
 * @param {Object} [body] - The request body data to be sent in JSON format for methods like POST.
 * @returns {Promise<Object|undefined>} A promise that resolves to the JSON data if the response is successful, or undefined if the response is not okay.
 * @throws {Error} Throws an error if there is a network error or if the JSON parsing fails.
 * 
 */
async function fetchJson(url, method, body) {
    /**
     * The options object for the Fetch API.
     * @typedef {Object} FetchOptions
     * @property {string} method - The HTTP method for the request.
     * @property {Object} headers - The headers for the request.
     * @property {string} headers.Accept - The "Accept" header for indicating the expected response format.
     * @property {string} [headers.Content-Type] - The "Content-Type" header for specifying the format of the request body (only included if a body is provided).
     * @property {string} [body] - The request body data in JSON format (only included if a body is provided).
     */

    /**
     * The Fetch API response.
     * @typedef {Object} FetchResponse
     * @property {boolean} ok - Indicates whether the response was successful (status code in the range 200-299).
     * @property {function(): Promise<Object>} json - A function that returns a promise resolving to the JSON representation of the response body.
     */

    /**
     * The JSON data received from the response.
     * @typedef {Object} JsonData
     */

    /**
     * The response data from the fetch operation.
     * @type {FetchResponse}
     */
    const options = {
        headers: {
            "Accept": "application/json"
        }
    };

    if (body) {
        options.method = method || "POST";
        options.body = JSON.stringify(body);
        options.headers["Content-Type"] = "application/json";
    } else {
        options.method = method || "GET";
    }

    /**
     * The fetch response.
     * @type {FetchResponse}
     */
    let response = await fetch(url, options);

    /**
     * Check if the response was successful and return the JSON data.
     * @type {JsonData|undefined}
     */
    return response.ok ? await response.json() : undefined;
}

export { fetchJson };
;
