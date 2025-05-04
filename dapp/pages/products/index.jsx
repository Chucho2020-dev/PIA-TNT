import React from "react";
import Layout from "../../components/Layout";
import styles from '../../styles/Products.module.css'
import ProductCard from "../../components/ProductCard";
import { useSelector } from 'react-redux';

const products = () => {

    const managerAddress = useSelector((state) => state.managerAddress);
    return (
        <Layout>
            <div className={styles.product_main}>
            <input type="text" className={styles.searchbar}/>
            {managerAddress}
            <div className={styles.product_container}>
                <ProductCard title="Producto 1" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 2" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 3" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 4" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 5" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 6" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 7" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 8" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 9" short_description="Esto es un placeholder del producto" />
                <ProductCard title="Producto 10" short_description="Esto es un placeholder del producto" />
            </div>
            </div>
        </Layout>
    );
}

export default products