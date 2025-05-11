import React from "react";
import styles from "../styles/ProductCard.module.css"
import Link from "next/link";
import Progress from "./Progress";
import { BsCurrencyExchange } from "react-icons/bs";
import { PiHandCoins } from "react-icons/pi";
import { GiCoins } from "react-icons/gi";
import { TbReceipt2 } from "react-icons/tb";
import numberFormater from "../utils/numberFormater";

const ProductCard = ({product}) => {
    return (
        <div className={styles.product_card}>
            <h3>{product.name}</h3>
            <div className={styles.row}>
                <div className={styles.feature}>
                    <span className={styles.featured}><BsCurrencyExchange size={30} /></span>
                    <h5>Símbolo</h5>
                    <p>{product.symbol}</p>
                </div>
                <div className={styles.feature}>
                    <span className={styles.featured}><PiHandCoins size={30} /></span>
                    <h5>Tokens por ETH</h5>
                    <p>{product.price}</p>
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.feature}>
                    <span className={styles.featured}><TbReceipt2 size={30} /></span>
                    <h5>Tokens vendidos</h5>
                    <p>{numberFormater(product.totalSold, product.decimals)}</p>
                </div>
                <div className={styles.feature}>
                    <span className={styles.featured}><GiCoins size={30} /></span>
                    <h5>Tokens disponibles</h5>
                    <p>{numberFormater(product.totalSupply, product.decimals)}</p>
                </div>
            </div>
            <Progress totalSold={product.totalSold} totalSupply={product.totalSupply} />
            <Link href={{pathname: '/products/[product]', query: {product: product.symbol }}} className={styles.button}>
                Acceder
            </Link>
        </div>
    )
}

export default ProductCard