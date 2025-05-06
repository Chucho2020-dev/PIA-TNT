import React from "react";
import Link from "next/link";
import styles from "../styles/Menu.module.css";
import { SiHomebridge, SiHomeassistantcommunitystore } from "react-icons/si";
import { PiUserCircleDashedBold } from "react-icons/pi";

const Menu = () => {
    return (
        <nav>
            <ul className={styles.menu}>
                <li>
                    <Link href="/">
                    <SiHomebridge className={styles.icon} /> Inicio
                    </Link>
                </li>
                <li>
                    <Link href="/products">
                    <SiHomeassistantcommunitystore className={styles.icon} /> Productos
                    </Link>
                </li>
                <li>
                    <Link href="/profile">
                    <PiUserCircleDashedBold className={styles.icon} /> Perfil
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Menu