const priceComposer = (amount, decimals) => {
    let response = String(amount);
    for(let i = 0; i < decimals; i++) {
        response += "0";
    }
    return response;
}

export default priceComposer