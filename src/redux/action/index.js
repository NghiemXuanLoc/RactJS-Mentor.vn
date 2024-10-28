// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}
// xoa san pham khoi cart
export const removeItemKhoiCart = (product) => {
    return {
        type: "REMOVEITEM",
        payload: product
    };
};

export const clearCart = () => {
    return {
        type: "CLEARCART"
    };
};