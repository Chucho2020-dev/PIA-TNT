import React from "react";
import Menu from "./Menu";
import styles from "../styles/Header.module.css"

const Header = () => {
    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>Logo</h1>
            <Menu />
        </header>
    )
}

export default Header