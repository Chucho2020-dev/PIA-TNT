import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Progress from "../../components/Progress";
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

const ProductDetail = () => {
    const router = useRouter()
    const productSymbol = router.query.product
    const [amount, setAmount] = useState(100000000000000); // 100000000000000 -> 0.0001
    const [feedback, setFeedback] = useState("");
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
            let weis = web3.utils.toWei(e.target.value, 'ether');
            setAmount(weis);
            setFeedback("");
        } catch (e) {
            setFeedback("Formato incorrecto!");
        }
    }

    const handleBuyWithETH = async () => {

        setFeedback("Verificando la existencia de MetaMaks...")
        
        const response = await changeChainId();
        if (!response.success) {
            setFeedback(response.message);
        }
        
        const availableTokens = filteredProduct.totalSupply - filteredProduct.totalSold;
        if (availableTokens < amount) {
            setFeedback("La cantidad de tokens que intenta comprar es mayor a la cantidad disponible!");
            return;
        }

        if (amount <= 0) {
            setFeedback("La cantidad de tokens a comprar no puede ser negativa!");
        }

        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        const tokenContract = new web3.eth.Contract(token, filteredProduct.address);

        try {
            const res = await tokenContract.methods.presale(amount).send({from: accounts[0], value: amount});
            setFeedback("Transaccion completada! Revise en Id de la transaccion: " + res.blockHash);
        } catch (error) {
            setFeedback(error);
        }
    }

    const handleContractLoad = async () => {

        const web3 = new Web3(window.ethereum)
        const contract = new web3.eth.Contract(managerABI, managerAddress)
        const products = await contract.methods.getProducts().call()
        const productInfo = await Promise.all(products.map(async (item) => {
            const tokenContract = new web3.eth.Contract(tokenABI, item)
            const isActive = await tokenContract.methods.getActive().call()
            const symbol = await tokenContract.methods.symbol().call()
            if (isActive) {
                const price = await tokenContract.methods.getPrice().call();
                const totalSold = await tokenContract.methods.getTotalSold().call();
                const totalSupply = await tokenContract.methods.totalSupply().call();
                const tokenName = await tokenContract.methods.name().call(); 
                const decimals = await tokenContract.methods.decimals().call();

                return {
                    name: tokenName,
                    symbol: symbol,
                    price: price,
                    totalSold: totalSold,
                    totalSupply: totalSupply,
                    decimals: decimals,
                    address: item
                }
            }
        }))
        const found = productInfo.find((item) => item.symbol === productSymbol)
        setFilteredProduct(found)
    }

    useEffect(() => { 
        if (router.isReady && managerAddress) {
            handleContractLoad()
        }
    }, [router.isReady, managerAddress])
    
    return (
        <Layout title={filteredProduct.name}>
            <div className={styles.container}>
                <h1>{filteredProduct.name}</h1>

                <div className={styles.infoContainer}>

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
                        <p>{numberFormater(filteredProduct.totalSold, filteredProduct.decimals)}</p>
                        </div>
                        <div className={styles.icon}>
                            <span className={styles.featured}><GiCoins size={30} /></span>
                            <h5>Tokens disponibles</h5>
                            <p>{numberFormater(filteredProduct.totalSupply, filteredProduct.decimals)}</p>
                        </div>
                    </div>

                    <div className={styles.basicInfo}>
                        <a href={"/whitepapers/"+filteredProduct.symbol+".pdf"} target="_blank" className={styles.infoBTN} >Ver el WhitePaper</a>
                        <input type="number" step="0.0001" onChange={handleAmount} className={styles.input} placeholder="0.0001" ></input>
                        <button onClick={() => {handleBuyWithETH()}} className={styles.infoBTN} >Comprar con ETH</button>
                        <h3 className={styles.feedback} >{feedback}</h3>
                    </div>

                    <div className={styles.contentContainer}>
                        <img src={"/img/"+filteredProduct.symbol+".jpg"} className={styles.detailImg} />
                        <h1>{filteredProduct.name}</h1>
                        <p>Esto es un placeholder de la descripcion.............................</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetail