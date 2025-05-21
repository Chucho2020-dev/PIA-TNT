import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import styles from '../../styles/Products.module.css'
import ProductCard from "../../components/ProductCard";
import { useSelector } from 'react-redux';
import { useState } from "react";
import managerABI from '../../abi/manage.json';
import tokenABI from '../../abi/token.json';
import Web3 from "web3";
import changeChainId from "../../utils/changeChainId";
import CardQuarter from "../../components/CardQuarter";

const products = () => {
    const [feedback, setFeedback] = useState("Cargando...");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const managerAddress = useSelector((state) => state.addresses.managerAddress);
    const abiJSON = managerABI;

    const handleReadContract = async () => {
        const response = await changeChainId();
        if(!response.success) {
            setFeedback(response.message)
            return;
        }
        
        setFeedback("Leyendo los contratos...");
        const web3 = new Web3(window.ethereum);
        if(typeof web3 === "undefined"){
            setFeedback("MetaMask no esta disponible, intenta mas tarde");
            return;
        }
        const contract = new web3.eth.Contract(abiJSON, managerAddress);
        const total = await contract.methods.getTotal().call();
        if (total == 0) {
            setFeedback("No hay productos por mostrar.")
        } else {
            setFeedback("")
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
                        
                        // Convertir los valores a números y ajustar por decimales
                        const soldTokens = web3.utils.fromWei(totalSold, 'ether');
                        const supplyTokens = web3.utils.fromWei(totalSupply, 'ether');
                        
                        // Calcular tokens disponibles
                        const availableTokens = web3.utils.fromWei(
                            web3.utils.toBN(totalSupply).sub(web3.utils.toBN(totalSold)).toString(),
                            'ether'
                        );
                        
                        console.log(`Token ${symbol}:`, {
                            totalSold: soldTokens,
                            totalSupply: supplyTokens,
                            availableTokens: availableTokens,
                            decimals: decimals,
                            rawTotalSold: totalSold,
                            rawTotalSupply: totalSupply
                        });

                        return {
                            name: tokenName,
                            symbol: symbol,
                            price: price,
                            totalSold: soldTokens,
                            totalSupply: supplyTokens,
                            availableTokens: availableTokens,
                            address: product,
                            decimals: decimals,
                            rawTotalSold: totalSold,
                            rawTotalSupply: totalSupply
                        }
                    }
                } catch (error) {
                    console.error(`Error al leer el contrato ${product}:`, error);
                }
                return null;
            }));
            
            const validProducts = _productsInfo.filter(product => product !== null);
            setProducts(validProducts);
            setFilteredProducts(validProducts);
        }
    }

    // Función para actualizar los valores después de una transacción
    const updateAfterTransaction = async () => {
        console.log("Actualizando después de transacción...");
        await handleReadContract();
    };

    useEffect(() => {
        handleReadContract();
        const interval = setInterval(handleReadContract, 3000); // Actualizar cada 3 segundos

        // Suscribirse a eventos de MetaMask
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });

            window.ethereum.on('accountsChanged', () => {
                window.location.reload();
            });

            // Escuchar eventos de transacciones
            window.ethereum.on('transactionHash', () => {
                console.log("Transacción detectada, actualizando...");
                updateAfterTransaction();
            });
        }

        return () => {
            clearInterval(interval);
            if (window.ethereum) {
                window.ethereum.removeAllListeners('chainChanged');
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('transactionHash');
            }
        };
    }, []);

    const handleSearch = (event) => {
        setFilteredProducts(products.filter(product => product.name.toLowerCase().includes(event.target.value.toLowerCase())))
    }

    return (
        <Layout title="Productos">
            <section className="cardContanier">
                <input type="text" className={styles.searchbar} placeholder="Buscar productos..." onChange={handleSearch} />
            </section>
            
            <span className={styles.feedback}>{feedback}</span>
            
            <section className="cardContanier">
                {filteredProducts.map((filteredProduct, index) => (
                    <CardQuarter key={index}>
                        <ProductCard product={filteredProduct} />
                    </CardQuarter> 
                ))}
            </section>
        </Layout>
    );
}

export default products