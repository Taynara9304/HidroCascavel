import '../estilos/Apresentacao.css';
import Membros from '../imagens/imagem-membros-do-grupo.png'

function Apresentacao() {
    return (
      <div className="Apresentacao">
        <div className="links">
                <ul className='lista-links'>
                    <li><a className='link-menu' href="#quem-somos">Quem somos</a></li>
                    <li><a className='link-menu' href="#oque-fazemos">O que fazemos</a></li>
                    <li><a className='link-menu' href="#nossa-missao">Nossa missão</a></li>
                </ul>
            </div>
        <div className="container">
            <div id="quem-somos">
                <div className="img-quem-somos">
                    <img className="img-quemsomos" src={Membros} alt="" />
                </div>
                <div className="texto-quem-somos">
                    <p>Somos um projeto de extensão do IFPR Campus Cascavel vinculado ao Itaipu Parquetec.</p>
                    <p>Temos como objetivo a disseminação e promoção do conhecimento sobre a importância da manutenção da qualidade da água de poços entre os habitantes de
                    Cascavel.</p>
                </div>
            </div>
        </div>
      </div>
    );
  }
  
  export default Apresentacao;
  