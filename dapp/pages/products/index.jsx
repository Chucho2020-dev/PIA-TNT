import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import styles from '../../styles/Products.module.css'
import ProductCard from "../../components/ProductCard";
import { useSelector } from 'react-redux';
import { useState } from "react";
import managerABI from '../../abi/manage.json';
import tokenABI from '../../abi/token.json';
import Web3 from "web3";
import addresses from "../../store/reducers/addresses";

const products = () => {
    const [feedback, setFeedback] = useState("Cargando...");
    const [products, setProducts] = useState([]);

    const managerAddress = useSelector((state) => state.addresses.managerAddress);
    const abiJSON = managerABI;

    useEffect(async () => {
        if (!window.ethereum) {
            setFeedback("Es necesario tener MetaMask para interactuar con los servicios de Web3");
            return;
        }

        setFeedback("Leyendo los contratos...");
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(abiJSON, managerAddress);
        const total = await contract.methods.getTotal().call();
        if (total == 0) {
            setFeedback("No hay productos por mostrar.")
        } else {
            setFeedback("")
            const _products = await contract.methods.getProducts().call();
            const _productsInfo = await Promise.all(_products.map(async (product) => {
                const tokenContract = new web3.eth.Contract(tokenABI, product);
                const isActive = await tokenContract.methods.getActive().call();

                if (isActive) {
                    const price = await tokenContract.methods.getPrice().call();
                    const tokenName = await tokenContract.methods.name().call();
                    const symbol = await tokenContract.methods.symbol().call();
                    const totalSold = await tokenContract.methods.getTotalSold().call();
                    const totalSupply = await tokenContract.methods.totalSupply().call(); 
                    
                    return {
                        name: tokenName,
                        symbol: symbol,
                        price: price,
                        totalSold: totalSold,
                        totalSupply: totalSupply,
                        address: product
                    }
                } else {
                    return null
                }
            }));
            setProducts(_productsInfo);
        }
    }, [])

    return (
        <Layout>
            <div className={styles.product_main}>
            <input type="text" className={styles.searchbar}/>
            {feedback}
            <div className={styles.product_container}>
                {products.map((product, index) => (
                   <ProductCard key={index} product={product} /> 
                ))}
            </div>
            </div>
        </Layout>
    );
}

export default products