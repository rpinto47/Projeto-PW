
async function fetchJson(url, method, body) {
    var options = {
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
    let response = await fetch(url, options);
    return response.ok ? await response.json() : void 0; 
}

export {fetchJson};