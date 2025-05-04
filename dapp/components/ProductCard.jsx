import React from "react";
import styles from "../styles/ProductCard.module.css"
import Link from "next/link";
import Progress from "./Progress";

const ProductCard = ({product}) => {
    return (
        <div className={styles.product_card}>
            <h3>{product.name}</h3>
            <p>{product.symbol}</p>
            <Progress totalSold={product.totalSold} totalSupply={product.totalSupply} />
            <Link href="#">
                Acceder
            </Link>
        </div>
    )
}

export default ProductCard