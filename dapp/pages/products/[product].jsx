import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Progress from "../../components/Progress";
import Web3 from "web3";
import changeChainId from "../../utils/changeChainId";

const ProductDetail = () => {
    const router = useRouter()
    const [product, setProduct] = useState(null);
    const [amount, setAmount] = useState(1);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        if (router.query.product) {
            try {
                const parsed = JSON.parse(router.query.product, (key, value) => {
                    if (typeof value === "string" && /^\d+n$/.test(value)) {
                        return BigInt(value.slice(0, -1));
                    }
                    return value;
                });
                setProduct(parsed);
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
        setAmount(e.target.value)
    }

    const handleBuyWithETH = async () => {
        setFeedback("Verificando la existencia de MetaMaks...")
        
        const response = await changeChainId();
        if (!response.success) {
            setFeedback(response.message);
        }
        
        const web3 = new Web3(window.ethereum);
    }
    
    return (
        <Layout>
           <h1>{product.name}</h1>
            <p>{product.symbol}</p>
            <p>Precio: {product.price} ETH </p>
            <Progress totalSold={product.totalSold} totalSupply={product.totalSupply} />
            <input type="number" onChange={handleAmount}></input>
            <button onClick={() => {handleBuyWithETH()}}>Comprar con ETH</button>
            <button>Comprar con tarjeta de crédito</button>
            <h3>{feedback}</h3>
        </Layout>
    )
}

export default ProductDetail