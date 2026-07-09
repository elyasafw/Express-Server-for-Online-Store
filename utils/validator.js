export function checkCartBody(body) {
    const ALLOWED_PARAMS = ["customerId", "productId", "quantity"];
    const arrBody = Object.keys(body);
    if (arrBody.length !== 3) {
        return false;
    }
    if (!ALLOWED_PARAMS.every((param) => arrBody.includes(param))) {
        return false;
    }
    return true;
}

export function validateQueryKeys(query) {
    const ALLOWED_KEYS = ["inStock", "maxPrice", "search"];
    const queryKeys = Object.keys(query);
    return queryKeys.every((key) => ALLOWED_KEYS.includes(key));
}
