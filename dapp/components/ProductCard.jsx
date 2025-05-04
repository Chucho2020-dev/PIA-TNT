import React from "react";
import styles from "../styles/ProductCard.module.css"
import Link from "next/link";

const ProductCard = ({title, short_description}) => {
    return (
        <div className={styles.product_card}>
            <h3>{title}</h3>
            <p>{short_description}</p>
            <Link href="#">
                Acceder
            </Link>
        </div>
    )
}

export default ProductCard