En este commit se instalaron las utilidades de redux toolkit asi como las de web3 - Commit #7

En este commit se agrego un nuevo contrato que se encarga de generar los tokens del marketplace, fue obtenido del siguiente repositorio: https://github.com/JJRuizDeveloper/solidity/blob/main/token.sol
Es posible que en siguientes avances se cambie por uno propio - Commit #8

En este commit se desplego el contrato de token.sol en sepolia, se agrego este contrato como producto a manager.sol y se modifico el indice de productos para comenzar a ver el contenido de la blockchain - Commit #9

En este commit se modifico la tarjeta de productos para empezar a mostrar el nombre y el simbolo de los objetos en el contrato, ademas se agrego una barra que muestra el progreso de ventas totales - Commit #10

En este commit se ha comenzado a trabajar en como se muestra la informacion del producto, por ahora persiste el siguiente error al entrar por primera vez a la pagina del producto TypeError: destroy is not a function, este se quita recargando la pagina, puede tener relacion con la solucion implementada al problema de pasar el producto en ProductCard hacia [product] - Commit #11

En este commit se ha desarrollado mas la pagina [product], se ha agregado dos botones para compra, se ha implementado una verificacion de la wallet y de la red en la que se opera y si no es la de Sepolia se solicita el cambio - Commit #12

En este commit se refactorizo el codigo de la verificacion de la cadena de bloques y de MetaMask, se soluciono el error de TypeError: destroy is not a function, parece que se debia a una mala estructura en un useEffect del indice de productos, aunque ahora la pagina cambia automaticamente la cadena a Sepolia sin preguntar como lo hacia en el commit anterior, falta revisar eso a futuro - Commit #13

En este commit se trabajo en una funcion para composicionar el precio de los objetos, se crearon metodos para verificar la disponibilidad de tokens y para calcular su precio en Weis - Commit #14

En este commit se desplego otro token.sol para comenzar a trabajar en el pago de los tokens, se modificaron alguans lineas encargadas del precio en [product], se agrego una nueva variable de entorno global, se ha elimidado la utilidad de priceComposer, para usar una funcion de ethereum que nos permita calcular el valor de los tokens en Weis de mejor forma y asi aceptar micropagos con decimales, se realizo una compra de prueba con el siguiente id como evidencia: 0x7f5339e163d9ce04eba9a8824198a77e3ca37ae3f19093358ad64596122fa811 - Commit #15

En este commit se hicieron muchas modificaciones de diseño a la pagina de inicio, muchas de estas modificicaciones se aplican para las demas paginas pero aun hay que trabajar en como se muestra en contenido en ellas - Commit #16

En este commit se prosiguieron los trabajos en el diseño, esta vez enfocado en hacer la aplicacion mas resposiva para resoluciones de dispositivos moviles - Commit #17

En este commit se produndizo en el diseño resonsivo, se agrego un boton que pliega y despliega el menu en resoluciones moviles, andemas de una pequeña animacion cuando las opciones aparecen, tambien se ha configurado para que el menu reaparezca al detectarse resoluciones mayores a 1100 px - Commit #18

En este commit se agrego una barra auxiliar la cual servira de apoyo en la navegacion de las diferentes secciones de la aplicacion, asi como pequeños retoques esteticos a los componentes principales - Commit #19

En este commit se agregaron tarjetas de contenido en la pagina de inicio, tambien se refinaron aspectos de diseño para las resoluciones moviles - Commit #20

En este commit se agrego contenido a la pagina de inicio, se uso una full card para la bienvenida y dos half card para mostrar contenido de apoyo al usuario para esto se instalo la instancia se reatc-player - Commit #21

En este commit se empezo el cambio de diseño en las cartas de los productos y se hicieron pequeños retoques a otras paginas - Commit #22

En este commit se hicieron modificaciones a las cartas de productos, ahora se muestra mas informacion sobre los tokens, tambien se le agregaron iconos a estos datos - Commit #23

En este commit se hicieron los arreglos finales al diseño de las cartas de productos, ademas de que se agrego funcionalidad a la barra de busqueda de productos - Commit #24

En este commit se han hecho midificaciones en como se manejan los datos en la url de cada uno de los productos - Commit #25

En este commit se empezo el cambio de diseño de los diferentes productos, se han agragado varios archivos estaticos publicos como una imagen de fondo, una descripcion y un whitepaper, estos aun son de prueba, posteriormente deben complementarse - Commit #26