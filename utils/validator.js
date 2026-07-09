export function checkCartBody(body) {
    const parameters = ["customerId", "productId", "quantity"];
    const arrBody = Object.keys(body);
    if (arrBody.length !== 3) {
        return false;
    }
    if (!parameters.every((param) => arrBody.includes(param))) {
        return false;
    }
    return true;
}
