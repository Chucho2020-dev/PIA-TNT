import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Progress from "../../components/Progress";
import Web3 from "web3";
import changeChainId from "../../utils/changeChainId";
import token from '../../abi/token.json';

const ProductDetail = () => {
    const router = useRouter()
    const [product, setProduct] = useState(null);
    const [amount, setAmount] = useState(100000000000000); // 100000000000000 -> 0.0001
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        if (router.query.product) {
            try {
                const product = JSON.parse(router.query.product, (key, value) => {
                    if (typeof value === "string" && /^\d+n$/.test(value)) {
                        return BigInt(value.slice(0, -1));
                    }
                    return value;
                });
                setProduct(product);
            } catch (e) {
                console.log("Error al parsear el producto: ", e);
            }
        }
    }, [router.query.product])

    if (!product) {
        return (
            <Layout>
                <p>Cargando producto...</p>
            </Layout>
        )
    }

    const handleAmount = (e) => {
        const web3 = new Web3(window.ethereum);
        try {
            let weis = web3.utils.toWei(e.target.value, 'ether');
            setAmount(weis);
            setFeedback("");
        } catch (e) {
            setFeedback("Formato incorrecto!");
        }
    }

    const handleBuyWithETH = async () => {
        setFeedback("Verificando la existencia de MetaMaks...")
        
        const response = await changeChainId();
        if (!response.success) {
            setFeedback(response.message);
        }
        
        const availableTokens = product.totalSupply - product.totalSold;
        if (availableTokens < amount) {
            setFeedback("La cantidad de tokens que intenta comprar es mayor a la cantidad disponible!");
            return;
        }

        if (amount <= 0) {
            setFeedback("La cantidad de tokens a comprar no puede ser negativa!");
        }

        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        const tokenContract = new web3.eth.Contract(token, product.address);

        try {
            const res = await tokenContract.methods.presale(amount).send({from: accounts[0], value: amount});
            setFeedback("Transaccion completada! Revise en Id de la transaccion: " + res.blockHash);
        } catch (error) {
            setFeedback(error);
        }
    }
    
    return (
        <Layout>
           <h1>{product.name}</h1>
            <p>{product.symbol}</p>
            <p>Precio: {product.price} tokens por ETH </p>
            <Progress totalSold={product.totalSold} totalSupply={product.totalSupply} />
            <input type="number" step="0.0001" onChange={handleAmount}></input>
            <button onClick={() => {handleBuyWithETH()}}>Comprar con ETH</button>
            <button>Comprar con tarjeta de crédito</button>
            <h3>{feedback}</h3>
        </Layout>
    )
}

export default ProductDetail