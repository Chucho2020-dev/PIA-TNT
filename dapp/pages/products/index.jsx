import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import styles from '../../styles/Products.module.css'
import ProductCard from "../../components/ProductCard";
import { useSelector } from 'react-redux';
import { useState } from "react";
import managerABI from '../../abi/manage.json';
import Web3 from "web3";

const products = () => {
    const [feedback, setFeedback] = useState("Cargando...");

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
            // Mostrar los productos
        }
    }, [])

    return (
        <Layout>
            <div className={styles.product_main}>
            <input type="text" className={styles.searchbar}/>
            {feedback}
            <div className={styles.product_container}>
                {/*<ProductCard title="Producto 1" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 2" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 3" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 4" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 5" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 6" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 7" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 8" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 9" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 10" short_description="Esto es un placeholder del producto" />*/}
            </div>
            </div>
        </Layout>
    );
}

export default products