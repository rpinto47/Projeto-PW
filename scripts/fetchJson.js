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

    try {
        let response = await fetch(url, options);
        console.log("Response:", response);
        
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error: Response not OK. Status:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error in fetchJson:', error.message);
        return null;
    }
}

export { fetchJson };
