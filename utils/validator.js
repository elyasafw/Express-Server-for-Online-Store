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

export function validateCartStock(cart, allProducts) {
    for (const cartItem of cart) {
        const product = allProducts.find((p) => p.id === cartItem.productId);

        if (!product) {
            throw new HttpError(
                `Product ID: ${cartItem.productId} no longer exists.`,
                400,
            );
        }
        if (product.stock < cartItem.quantity) {
            throw new HttpError(
                `Not enough stock for ${product.name}. Available: ${product.stock}`,
                400,
            );
        }
    }
}
