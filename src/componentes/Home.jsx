import './home.css';

export default function Home() {
    return (
      <div className="Home">
        <header>
            <div className="logo">logo</div>
            <div className="barra-de-pesquisa">
                <input className='pesquisa-estilo-musical' type="text" placeholder="O que você quer tocar hoje?" />
                <div className="icone-lupa-de-pesquisa">lupa</div>
            </div>
        </header>

        <div className='menu'>
          <div className='botaoMenu'>Todos</div>
          <div className='botaoMenu'>Rock</div>
          <div className='botaoMenu'>Sertanejo</div>
          <div className='botaoMenu'>Gospel/Religioso</div>
          <div className='botaoMenu'>MPB</div>
          <div>
            <select name="generos-musicais" id="generos-musicais">
              <option value="Mais" required>Mais</option>
              <option value="Afrobeats">Afrobeats</option>
              <option value="Blues">Blues</option>
              <option value="Classicos">Clássicos</option>
              <option value="Dance">Dance</option>
              <option value="Eletronica">Eletrônica</option>
            </select>
          </div>
        </div>

        <img className='img-musica' src="https://i0.wp.com/musicalidades.com.br/wp-content/uploads/2018/11/o-que-e-musica-4.jpg?resize=768%2C364&ssl=1" alt="Música" />

        <div className="maisAcessados">
          <h1>Mais acessados</h1>

          <div className="musicas-mais-acessadas">
            <div className="elemento-mais-acessado">
              <div className="numero">1</div>
              <div className="texto-mais-acessado">
                <h2>Porque Ele Vive</h2>
                <p>Harpa Cristã</p>
              </div>
            </div>
            <div className="elemento-mais-acessado">
              <div className="numero">2</div>
              <div className="texto-mais-acessado">
                <h2>Porque Ele Vive</h2>
                <p>Harpa Cristã</p>
              </div>
            </div>
            <div className="elemento-mais-acessado">
              <div className="numero">3</div>
              <div className="texto-mais-acessado">
                <h2>Porque Ele Vive</h2>
                <p>Harpa Cristã</p>
              </div>
            </div>
            <div className="elemento-mais-acessado">
              <div className="numero">4</div>
              <div className="texto-mais-acessado">
                <h2>Porque Ele Vive</h2>
                <p>Harpa Cristã</p>
              </div>
            </div>
            <div className="elemento-mais-acessado">
              <div className="numero">5</div>
              <div className="texto-mais-acessado">
                <h2>Porque Ele Vive</h2>
                <p>Harpa Cristã</p>
              </div>
            </div>
            <div className="elemento-mais-acessado">
              <div className="numero">6</div>
              <div className="texto-mais-acessado">
                <h2>Porque Ele Vive</h2>
                <p>Harpa Cristã</p>
              </div>
            </div>
            <div className="elemento-mais-acessado">
              <div className="numero">7</div>
              <div className="texto-mais-acessado">
                <h2>Porque Ele Vive</h2>
                <p>Harpa Cristã</p>
              </div>
            </div>
            <div className="elemento-mais-acessado">
              <div className="numero">8</div>
              <div className="texto-mais-acessado">
                <h2>Porque Ele Vive</h2>
                <p>Harpa Cristã</p>
              </div>
            </div>
          </div>

          <div className="mostrar-mais">Mostrar mais músicas e artistas</div>
        </div>

        <div className="cursos-disponiveis">
          <h1>Mais de 15 cursos com aulas exclusivas do Cifra Club em uma única assinatura</h1>
          <p>Assine o Cifra Club Academy e libere aulas, materiais didáticos e exercícios exclusivos.</p>

          <div className="conteiner-cursos">
              <div className="curso">
                <img className='img-curso' src="https://img.irroba.com.br/fit-in/600x600/filters:format(webp):fill(fff):quality(80)/digiorgi/catalog/produtos/classico38e/nova-captacao-4b/classico-38e-1.jpg" alt="Curso de violão" />
                <div className="texto-curso">
                  <h1>Violão Iniciante</h1>
                  <p>Com Gustavo Fofão e Leo Eymard</p>
                </div>
                <div className="aprender-curso">Aprender violão do zero</div>
              </div>
              <div className="curso">
                <img className='img-curso' src="https://pianopiano.com/wp-content/uploads/2015/08/young-chang-professional-grand-piano.jpg" alt="Curso de piano" />
                <div className="texto-curso">
                  <h1>Violão Iniciante</h1>
                  <p>Com Gustavo Fofão e Leo Eymard</p>
                </div>
                <div className="aprender-curso">Aprender violão do zero</div>
              </div>
              <div className="curso">
                <img className='img-curso' src="https://images.tcdn.com.br/img/img_prod/736958/clarinete_armstrong_americano_original_sib_17_chaves_2243_1_78fe4915f2232420a7469c52800d6bcc.jpg" alt="Curso de clarinete" />
                <div className="texto-curso">
                  <h1>Violão Iniciante</h1>
                  <p>Com Gustavo Fofão e Leo Eymard</p>
                </div>
                <div className="aprender-curso">Aprender violão do zero</div>
              </div>
              <div className="curso">
                <img className='img-curso' src="https://a-static.mlcdn.com.br/800x560/bateria-acustica-completa-mxt-mb120p-com-pratos-e-banco/cheirodemusica1/mb120pbk/00d3d61c8fd8ccf637a035b9aa1089c0.jpeg" alt="Curso de bateria" />
                <div className="texto-curso">
                  <h1>Violão Iniciante</h1>
                  <p>Com Gustavo Fofão e Leo Eymard</p>
                </div>
                <div className="aprender-curso">Aprender violão do zero</div>
              </div>
          </div>

        </div>
      </div>
    );
  }
