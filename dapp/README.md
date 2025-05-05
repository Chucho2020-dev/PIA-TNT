En este commit se instalaron las utilidades de redux toolkit asi como las de web3 - Commit #7

En este commit se agrego un nuevo contrato que se encarga de generar los tokens del marketplace, fue obtenido del siguiente repositorio: https://github.com/JJRuizDeveloper/solidity/blob/main/token.sol
Es posible que en siguientes avances se cambie por uno propio - Commit #8

En este commit se desplego el contrato de token.sol en sepolia, se agrego este contrato como producto a manager.sol y se modifico el indice de productos para comenzar a ver el contenido de la blockchain - Commit #9

En este commit se modifico la tarjeta de productos para empezar a mostrar el nombre y el simbolo de los objetos en el contrato, ademas se agrego una barra que muestra el progreso de ventas totales - Commit #10

En este commit se ha comenzado a trabajar en como se muestra la informacion del producto, por ahora persiste el siguiente error al entrar por primera vez a la pagina del producto TypeError: destroy is not a function, este se quita recargando la pagina, puede tener relacion con la solucion implementada al problema de pasar el producto en ProductCard hacia [product] - Commit #11

En este commit se ha desarrollado mas la pagina [product], se ha agregado dos botones para compra, se ha implementado una verificacion de la wallet y de la red en la que se opera y si no es la de Sepolia se solicita el cambio - Commit #12