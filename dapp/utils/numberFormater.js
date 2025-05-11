const numberFormater = (num, decimals) => {
    
    let result = num;
    
    if (decimals > 0) {
        let str = num.toString()
        str = str.substr(0, str.length - Number(decimals))
        result = parseFloat(str)
    }
    
    if(Number(num).toString().length < Number(decimals)) {
        return 0;
    }

    if(result > 1000000000){
        return (result/1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if(result > 1000000) {
        return (result/1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if(result > 1000) {
        return (result/1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return result;
}

export default numberFormater;