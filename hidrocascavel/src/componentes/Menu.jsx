import '../estilos/Menu.css';
import Home from '../imagens/Home.png'
import Logout from '../imagens/Log-out.png'
import Settings from '../imagens/Settings.png'

function Menu() {
  return (
    <div className="Menu">
      <div className="logo">
        <img class="img-logo" src="../logo-hidrocascavel.png" alt="Logo" />
      </div>

      <nav>
        <ul>
            <li><a href="#Sobre">Sobre</a></li>
            <li><a href="#Servicos">Serviços</a></li>
            <li><a href="#Educação-ambiental">Educação Ambiental</a></li>
            <li><a href="#Contato">Contato</a></li>
        </ul>
      </nav>

      <div className="icones">
        <ul>
            <li><a href="#"><img className="icone-menu" src={Home} alt="Home"/></a></li>
            <li><a href="#"><img className="icone-menu" src={Logout} alt="Logout" /></a></li>
            <li><a href="#"><img className="icone-menu" src={Settings} alt="Logout" /></a></li>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
