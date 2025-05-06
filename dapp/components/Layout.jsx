import "../src/app/globals.css"
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import styles from "../styles/Layout.module.css"

const Layout = ({children}) => {
    return (
        <div className={styles.mainContainer}>
            <Header />
            <div className={styles.mainSection}>
                <main styles={styles.main}>
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Layout