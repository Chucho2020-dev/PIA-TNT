'use client'
import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import styles from "../styles/Header.module.css"
import { ImMenu3 } from "react-icons/im";

const Header = () => {
    const [showMenu, setShowMenu] = useState(true);
    const handleClick = () => setShowMenu(!showMenu);

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth > 1100) {
                setShowMenu(true);
            }
        }
        window.addEventListener('resize', handleResize);
    }, [])

    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>TNT - PIA 
                <button className={styles.menuBtn} onClick={() => handleClick()}><ImMenu3 size={50}/></button> 
            </h1>
            <Menu showMenu={showMenu} />
        </header>
    )
}

export default Header