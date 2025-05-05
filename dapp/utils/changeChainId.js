import Web3 from "web3";

const changeChainId = async () => {
    if (!window.ethereum) {
        return {
            success: false,
            message: "Necesita tener instalado MetaMask para poder interactuar con esta aplicación!"
        };
    }

    //chainID de sepolia: 11155111 - 0xaa36a7
    const web3 = new Web3(window.ethereum);
    const chainID = await web3.eth.getChainId();
    if(chainID != process.env.NEXT_PUBLIC_CHAIN_ID) {
        try {
            await web3.eth.currentProvider.request({
                method: "wallet_switchEthereumChain",
                params: [{chainId: process.env.NEXT_PUBLIC_CHAIN_ID_0X}],
            })
        } catch (error) {
                return {
                    success: false,
                    message: error.message
                };
        }
    }
    return {
        success: true,
        message: "Esta en la blockchain correcta"
    }
}

export default changeChainId