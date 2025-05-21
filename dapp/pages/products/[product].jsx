import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Web3 from "web3";
import changeChainId from "../../utils/changeChainId";
import token from '../../abi/token.json';
import tokenABI from '../../abi/token.json';
import managerABI from '../../abi/manage.json';
import { useSelector } from "react-redux";
import styles from '../../styles/Product.module.css';
import { BsCurrencyExchange } from "react-icons/bs";
import { PiHandCoins } from "react-icons/pi";
import { TbReceipt2 } from "react-icons/tb";
import { GiCoins } from "react-icons/gi";
import numberFormater from "../../utils/numberFormater";
import descriptions from "../../public/descriptions/descriptions";

const ProductDetail = () => {
    const router = useRouter()
    const productSymbol = router.query.product
    const [amount, setAmount] = useState(100000000000000); // 100000000000000 -> 0.0001
    const [feedback, setFeedback] = useState("");
    const [transactionDetails, setTransactionDetails] = useState(null);
    const managerAddress = useSelector((state) => state.addresses.managerAddress);
    const [filteredProduct, setFilteredProduct] = useState({
        name: "Cargando...",
        symbol: "Cargando...",
        price: 0,
        totalSold: 0,
        totalSupply: 0,
        decimals: 0,
        address: "Cargando..."
    });

    const handleAmount = (e) => {
        const web3 = new Web3(window.ethereum);
        try {
            const value = parseFloat(e.target.value);
            
            // Validar que el valor esté dentro del rango permitido
            if (value < 0.0001) {
                setFeedback("El valor mínimo es 0.0001 ETH");
                return;
            }

            // Convertir el valor a Wei
            let weis = web3.utils.toWei(value.toString(), 'ether');
            setAmount(weis);
            setFeedback(" ");
        } catch (e) {
            setFeedback("Formato incorrecto!");
        }
    }

    const handleBuyWithETH = async () => {
        setFeedback("Verificando la existencia de MetaMask...")
        
        const response = await changeChainId();
        if (!response.success) {
            setFeedback(response.message);
            return;
        }

        const web3 = new Web3(window.ethereum);
        const availableTokens = parseFloat(filteredProduct.availableTokens);
        
        // Validar que amount sea un número válido
        if (!amount || isNaN(amount)) {
            setFeedback("Por favor, ingrese una cantidad válida");
            return;
        }

        // Convertir amount a string para evitar errores de precisión
        const amountInEth = web3.utils.fromWei(amount.toString(), 'ether');
        
        if (parseFloat(amountInEth) > availableTokens) {
            setFeedback("La cantidad de tokens que intenta comprar es mayor a la cantidad disponible!");
            return;
        }

        if (parseFloat(amountInEth) < 0.0001) {
            setFeedback("La cantidad mínima de compra es 0.0001 ETH!");
            return;
        }

        const accounts = await web3.eth.requestAccounts();
        const tokenContract = new web3.eth.Contract(token, filteredProduct.address);

        try {
            setFeedback("Enviando transacción...");
            
            // Estimar el gas necesario
            const gasEstimate = await tokenContract.methods.presale(amount.toString()).estimateGas({
                from: accounts[0],
                value: amount.toString()
            });

            // Convertir el gas estimado a número y añadir 20%
            const gasLimit = Number(gasEstimate) * 1.2;
            
            const res = await tokenContract.methods.presale(amount.toString()).send({
                from: accounts[0], 
                value: amount.toString(),
                gas: Math.floor(gasLimit)
            });
            
            // Verificar el estado de la transacción
            const receipt = await web3.eth.getTransactionReceipt(res.transactionHash);
            if (receipt.status) {
                const etherscanUrl = `https://sepolia.etherscan.io/tx/${res.transactionHash}`;
                const transactionInfo = (
                    <div style={{ textAlign: 'left' }}>
                        ¡Transacción completada! 
                        <br />
                        <div style={{ 
                            margin: '10px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ 
                                wordBreak: 'break-all',
                                fontFamily: 'monospace',
                                backgroundColor: '#f5f5f5',
                                padding: '8px',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}>
                                {res.transactionHash}
                            </span>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(res.transactionHash);
                                    const button = document.getElementById('copyButton');
                                    button.textContent = '¡Copiado!';
                                    setTimeout(() => {
                                        button.textContent = 'Copiar';
                                    }, 2000);
                                }}
                                id="copyButton"
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#2196f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Copiar
                            </button>
                        </div>
                        <a 
                            href={etherscanUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                                color: '#2196f3', 
                                textDecoration: 'underline',
                                display: 'inline-block',
                                marginTop: '10px'
                            }}
                        >
                            Ver transacción en Etherscan
                        </a>
                    </div>
                );
                setTransactionDetails(transactionInfo);
                setFeedback(" ");
                console.log("Hash de la transacción:", res.transactionHash);
                
                // En lugar de recargar la página, actualizamos los datos
                await handleContractLoad();
            } else {
                setFeedback("La transacción falló. Por favor, intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error en la transacción:", error);
            if (error.message.includes("user denied")) {
                setFeedback("Transacción cancelada por el usuario");
            } else if (error.message.includes("insufficient funds")) {
                setFeedback("Fondos insuficientes para completar la transacción");
            } else {
                setFeedback("Error en la transacción: " + error.message);
            }
        }
    }

    const handleContractLoad = async () => {
        const response = await changeChainId();
        if(!response.success) {
            setFeedback(response.message)
            return;
        }

        const web3 = new Web3(window.ethereum)
        const contract = new web3.eth.Contract(managerABI, managerAddress)
        const products = await contract.methods.getProducts().call()
        const productInfo = await Promise.all(products.map(async (item) => {
            try {
                const tokenContract = new web3.eth.Contract(tokenABI, item)
                const isActive = await tokenContract.methods.getActive().call()
                const symbol = await tokenContract.methods.symbol().call()
                if (isActive) {
                    const price = await tokenContract.methods.getPrice().call();
                    const totalSold = await tokenContract.methods.getTotalSold().call();
                    const totalSupply = await tokenContract.methods.totalSupply().call();
                    const tokenName = await tokenContract.methods.name().call(); 
                    const decimals = await tokenContract.methods.decimals().call();

                    // Convertir los valores a números y ajustar por decimales
                    const soldTokens = web3.utils.fromWei(totalSold, 'ether');
                    const supplyTokens = web3.utils.fromWei(totalSupply, 'ether');
                    
                    // Calcular tokens disponibles
                    const availableTokens = web3.utils.fromWei(
                        web3.utils.toBN(totalSupply).sub(web3.utils.toBN(totalSold)).toString(),
                        'ether'
                    );

                    console.log(`Token ${symbol} en detalle:`, {
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
                        decimals: decimals,
                        address: item,
                        rawTotalSold: totalSold,
                        rawTotalSupply: totalSupply
                    }
                }
            } catch (error) {
                console.error(`Error al leer el contrato ${item}:`, error);
            }
            return null;
        }));

        const found = productInfo.find((item) => item && item.symbol === productSymbol);
        if (found) {
            setFilteredProduct(found);
        } else {
            setFeedback("No se encontró el producto");
        }
    }

    useEffect(() => { 
        if (router.isReady && managerAddress) {
            handleContractLoad();
            // Actualizar cada 3 segundos
            const interval = setInterval(handleContractLoad, 3000);
            return () => clearInterval(interval);
        }
    }, [router.isReady, managerAddress]);
    
    return (
        <Layout title={filteredProduct.name}>
            <div className={styles.container}>
                <div className={styles.horizontalContent} style={{ marginBottom: '40px' }}>
                    <img src={"/img/"+filteredProduct.symbol+".jpg"} className={styles.detailImg} />
                    <div className={styles.textContent}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <h1>{filteredProduct.name}</h1>
                            <a href={"/whitepapers/"+filteredProduct.symbol+".pdf"} target="_blank" className={styles.infoBTN} style={{ padding: '10px 20px', fontSize: '14px' }}>Ver WhitePaper</a>
                        </div>
                        <p>{descriptions[filteredProduct.symbol]}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                    <div className={styles.infoContainer} style={{ flex: 1 }}>
                        <div className={styles.icon_container}>
                            <div className={styles.icon}>
                                <span className={styles.featured}><BsCurrencyExchange size={30} /></span>
                                <h5>Símbolo</h5>
                                <p>{filteredProduct.symbol}</p>
                            </div>
                            <div className={styles.icon}>
                                <span className={styles.featured}><PiHandCoins size={30} /></span>
                                <h5>Tokens por ETH</h5>
                                <p>{filteredProduct.price}</p>
                            </div>
                            <div className={styles.icon}>
                                <span className={styles.featured}><TbReceipt2 size={30} /></span>
                                <h5>Tokens vendidos</h5>
                                <p>{parseFloat(filteredProduct.totalSold).toFixed(4)}</p>
                            </div>
                            <div className={styles.icon}>
                                <span className={styles.featured}><GiCoins size={30} /></span>
                                <h5>Tokens disponibles</h5>
                                <p>{parseFloat(filteredProduct.availableTokens).toFixed(4)}</p>
                            </div>
                        </div>

                        <div className={styles.basicInfo}>
                            <input 
                                type="number" 
                                step="0.0001" 
                                min="0.0001"
                                max={filteredProduct.availableTokens}
                                onChange={handleAmount} 
                                className={styles.input} 
                                placeholder="0.0001"
                            />
                            <button onClick={() => {handleBuyWithETH()}} className={styles.infoBTN} >Comprar con ETH</button>
                            {typeof feedback === 'string' && feedback && <h3 className={styles.feedback}>{feedback}</h3>}
                        </div>
                    </div>

                    {transactionDetails && (
                        <div style={{ 
                            flex: '0 0 800px',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            marginLeft: 'auto',
                            minWidth: '600px',
                            maxWidth: '800px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ marginBottom: '15px', color: 'var(--third-color)' }}>Detalles de la Transacción</h3>
                            {React.cloneElement(transactionDetails, {
                                style: { ...transactionDetails.props.style, width: '100%' },
                                children: React.Children.map(transactionDetails.props.children, child => {
                                    if (React.isValidElement(child) && child.type === 'div') {
                                        return React.cloneElement(child, {
                                            children: React.Children.map(child.props.children, subchild => {
                                                if (React.isValidElement(subchild) && subchild.type === 'span') {
                                                    return React.cloneElement(subchild, {
                                                        style: {
                                                            ...subchild.props.style,
                                                            whiteSpace: 'nowrap',
                                                            overflowX: 'auto',
                                                            display: 'block',
                                                            width: '100%'
                                                        }
                                                    });
                                                }
                                                if (React.isValidElement(subchild) && subchild.type === 'button') {
                                                    return React.cloneElement(subchild, {
                                                        style: {
                                                            ...subchild.props.style,
                                                            backgroundColor: 'var(--third-color)',
                                                            color: 'white'
                                                        }
                                                    });
                                                }
                                                if (React.isValidElement(subchild) && subchild.type === 'a') {
                                                    return React.cloneElement(subchild, {
                                                        style: {
                                                            ...subchild.props.style,
                                                            color: 'var(--third-color)',
                                                            textDecoration: 'underline',
                                                            display: 'inline-block',
                                                            marginTop: '10px'
                                                        }
                                                    });
                                                }
                                                return subchild;
                                            })
                                        });
                                    }
                                    return child;
                                })
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetail