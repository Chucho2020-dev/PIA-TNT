'use client'
import Image from "next/image";
import styles from "../../styles/page.module.css"
import Layout from "../../components/Layout";
import CardFull from "../../components/CardFull";
import CardHalf from "../../components/CardHalf";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import('react-player'), {ssr:false});

export default function Home() {
  return (
    <Layout title="Inicio">
      <section className="cardContanier">
        <CardFull>
          <h3 className="pdn">Bienvenido a mi Proyecto Integrador de Aprendizajes de Nuevas Tecnologias!!!</h3>
          <p className="pdn">Este mercado funciona como una aplicacion descentralizada. Para poder interactuar con 
            todos los apartados de este marketplace es necesario que tengas <b>MetaMask</b> instalado en tu 
            navegador de preferencia, ademas de tener la testnet de <b>Sepolia</b> configurada en el mismo.</p>
        </CardFull>
      </section>

      <section className="cardContanier">
        <CardHalf>
          <h3 className="pdn">Cómo configurar MetaMask en tu navegador</h3>
          <div className="pdn">
            <ReactPlayer url="https://www.youtube.com/watch?v=TR4Mbi4wzgI" width="480px" />
          </div>
          <div className="separador"></div>
        </CardHalf>
        <CardHalf>
          <h3 className="pdn">Cómo configurar la testnet de Sepolia</h3>
          <div className="pdn">
            <ReactPlayer url="https://www.youtube.com/watch?v=H8aL1yXPVho" width="480px" />
          </div>
          <div className="separador"></div>
        </CardHalf>
      </section>
    </Layout>
  );
}
