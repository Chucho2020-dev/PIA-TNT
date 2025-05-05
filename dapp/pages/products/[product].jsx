import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Progress from "../../components/Progress";

const ProductDetail = () => {
    const router = useRouter()
    const [product, setProduct] = useState(null);

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
    
    return (
        <Layout>
           <h1>{product.name}</h1>
            <p>{product.symbol}</p>
            <Progress totalSold={product.totalSold} totalSupply={product.totalSupply} />
            <button>Comprar</button>
        </Layout>
    )
}

export default ProductDetail