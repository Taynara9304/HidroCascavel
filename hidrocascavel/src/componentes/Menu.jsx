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
        <ul className='links'>
            <li className='link'><a className='link-menu' href="#Sobre">Sobre</a></li>
            <li className='link'><a className='link-menu' href="#Servicos">Serviços</a></li>
            <li className='link'><a className='link-menu' href="#Educação-ambiental">Educação Ambiental</a></li>
            <li className='link'><a className='link-menu' href="#Contato">Contato</a></li>
        </ul>
      </nav>

      <div className="icones">
        <ul className='links'>
            <li className='link'><a className='link-menu' href="#"><img className="icone-menu" src={Home} alt="Home"/></a></li>
            <li className='link'><a className='link-menu' href="#"><img className="icone-menu" src={Logout} alt="Logout" /></a></li>
            <li className='link'><a className='link-menu' href="#"><img className="icone-menu" src={Settings} alt="Logout" /></a></li>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
