import React from "react";
import Link from "next/link";

const Menu = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">
                        Inicio
                    </Link>
                </li>
                <li>
                    <Link href="/products">
                        Productos
                    </Link>
                </li>
                <li>
                    <Link href="/profile">
                        Perfil
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Menu