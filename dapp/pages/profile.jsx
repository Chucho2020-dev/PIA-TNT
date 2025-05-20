import React, { useEffect } from "react";
import Layout from "../components/Layout";
import styles from '../styles/Products.module.css';
import { useSelector } from 'react-redux';
import { useState } from "react";
import managerABI from '../abi/manage.json';
import tokenABI from '../abi/token.json';
import Web3 from "web3";
import changeChainId from "../utils/changeChainId";
import numberFormater from "../utils/numberFormater";

const profile = () => {
    const [feedback, setFeedback] = useState("Cargando...");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState("");
    const [web3Instance, setWeb3Instance] = useState(null);

    const managerAddress = useSelector((state) => state.addresses.managerAddress);
    const abiJSON = managerABI;

    const handleReadContract = async () => {
        try {
            const response = await changeChainId();
            if(!response.success) {
                setFeedback(response.message);
                setError(response.message);
                return;
            }

            setFeedback("Leyendo los contratos...");
            const web3 = new Web3(window.ethereum);
            setWeb3Instance(web3);
            
            if(typeof web3 === "undefined"){
                setFeedback("MetaMask no está disponible, intenta más tarde");
                setError("MetaMask no está disponible");
                return;
            }

            const accounts = await web3.eth.requestAccounts();
            if (!accounts || accounts.length === 0) {
                setFeedback("Por favor, conecta tu wallet primero");
                setError("Wallet no conectada");
                return;
            }

            const contract = new web3.eth.Contract(abiJSON, managerAddress);
            const total = await contract.methods.getTotal().call();
            
            if (total == 0) {
                setFeedback("No hay productos por mostrar.");
                setError("");
            } else {
                setFeedback("");
                setError("");
                const _products = await contract.methods.getProducts().call();

                const _productsInfo = await Promise.all(_products.map(async (product) => {
                    try {
                        const tokenContract = new web3.eth.Contract(tokenABI, product);
                        const isActive = await tokenContract.methods.getActive().call();

                        if (isActive) {
                            const price = await tokenContract.methods.getPrice().call();
                            const tokenName = await tokenContract.methods.name().call();
                            const symbol = await tokenContract.methods.symbol().call();
                            const totalSold = await tokenContract.methods.getTotalSold().call();
                            const totalSupply = await tokenContract.methods.totalSupply().call();
                            const decimals = await tokenContract.methods.decimals().call();
                            const myTokens = await tokenContract.methods.balanceOf(accounts[0]).call();
                            
                            // Calcular el valor total en ETH
                            let totalValue;
                            let formattedBalance;
                            if (symbol === 'PAY') {
                                // Para PAY: 0.0001 ETH = 0.001 PAY
                                // Por lo tanto, 0.012 PAY = 0.0012 ETH
                                formattedBalance = web3.utils.fromWei(myTokens, 'ether');
                                totalValue = (Number(formattedBalance) * 0.1).toFixed(4);
                            } else {
                                // Para otros tokens, usar el precio del contrato
                                formattedBalance = web3.utils.fromWei(myTokens, 'ether');
                                totalValue = web3.utils.fromWei(
                                    (BigInt(myTokens) * BigInt(price)).toString(),
                                    'ether'
                                );
                            }
                            
                            return {
                                name: tokenName,
                                symbol: symbol,
                                price: price,
                                totalSold: totalSold,
                                totalSupply: totalSupply,
                                address: product,
                                decimals: decimals,
                                myTokens: myTokens,
                                formattedBalance: formattedBalance,
                                totalValue: totalValue
                            }
                        }
                    } catch (err) {
                        console.error("Error al leer el contrato:", err);
                        setError("Error al leer algunos contratos");
                    }
                    return null;
                }));

                const validProducts = _productsInfo.filter(product => product !== null);
                setProducts(validProducts);
                setFilteredProducts(validProducts);
            }
        } catch (err) {
            console.error("Error general:", err);
            setFeedback("Error al cargar los datos");
            setError(err.message);
        }
    }

    useEffect(() => {
        handleReadContract();
        // Actualizar cada 10 segundos
        const interval = setInterval(handleReadContract, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (event) => {
        setFilteredProducts(products.filter(product => 
            product.name.toLowerCase().includes(event.target.value.toLowerCase())
        ));
    }

    const handleRefresh = () => {
        handleReadContract();
    }

    return (
        <Layout title="Mis activos">
            <div className={styles.profileContainer}>
                {error && <div className={styles.error}>{error}</div>}
                <span className={styles.feedback}>{feedback}</span>
                
                <button onClick={handleRefresh} className={styles.refreshButton}>
                    Actualizar Balances
                </button>

                <section className={styles.cardContainer}>
                    {filteredProducts.length === 0 ? (
                        <div className={styles.noTokens}>
                            <h3>No tienes ningún token</h3>
                            <p>Visita nuestra sección de productos para comenzar a comprar</p>
                        </div>
                    ) : (
                        filteredProducts.map((product, index) => (
                            <div key={index} className={styles.tokenCard}>
                                <h3>Activo: {product.name}</h3>
                                <h5>Mis tokens: {product.formattedBalance} {product.symbol}</h5>
                                {Number(product.myTokens) > 0 ? (
                                    <div className={styles.tokenInfo}>
                                        <p>Valor total: {product.totalValue} ETH</p>
                                        <p>Dirección del contrato: {product.address}</p>
                                    </div>
                                ) : (
                                    <div className={styles.noTokens}>
                                        <p>No tienes tokens de {product.name}</p>
                                        <a href={`/products/${product.symbol}`} className={styles.buyButton}>
                                            Comprar
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </section>
            </div>
        </Layout>
    );
}

export default profile