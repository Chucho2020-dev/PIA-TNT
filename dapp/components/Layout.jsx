import "../src/app/globals.css"
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import styles from "../styles/Layout.module.css"

const Layout = ({children}) => {
    return (
        <>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </>
    );
}

export default Layout