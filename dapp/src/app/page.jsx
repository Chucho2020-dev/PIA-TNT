import Image from "next/image";
import styles from "../../styles/page.module.css"
import Layout from "../../components/Layout";
import CardFull from "../../components/CardFull";
import CardHalf from "../../components/CardHalf";
import CardQuarter from "../../components/CardQuarter";

export default function Home() {
  return (
    <Layout>
      <section className="cardContanier">
        <CardFull>
          <h3>Hola mundo</h3>
          <p>Esto es un placeholder, mas adelante empezara a mostrarse el contenido adecuado aqui</p>
        </CardFull>
      </section>

      <section className="cardContanier">
        <CardHalf>
          <h3>Hola mundo</h3>
          <p>Esto es un placeholder, mas adelante empezara a mostrarse el contenido adecuado aqui</p>
        </CardHalf>
        <CardHalf>
          <h3>Hola mundo</h3>
          <p>Esto es un placeholder, mas adelante empezara a mostrarse el contenido adecuado aqui</p>
        </CardHalf>
      </section>

      <section className="cardContanier">
        <CardQuarter>
          <h3>Hola mundo</h3>
          <p>Esto es un placeholder, mas adelante empezara a mostrarse el contenido adecuado aqui</p>
        </CardQuarter>
        <CardQuarter>
          <h3>Hola mundo</h3>
          <p>Esto es un placeholder, mas adelante empezara a mostrarse el contenido adecuado aqui</p>
        </CardQuarter>
        <CardQuarter>
          <h3>Hola mundo</h3>
          <p>Esto es un placeholder, mas adelante empezara a mostrarse el contenido adecuado aqui</p>
        </CardQuarter>
        <CardQuarter>
          <h3>Hola mundo</h3>
          <p>Esto es un placeholder, mas adelante empezara a mostrarse el contenido adecuado aqui</p>
        </CardQuarter>
      </section>
    </Layout>
  );
}
