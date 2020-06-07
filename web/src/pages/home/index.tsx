import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import './styles.css';

import logo from '../../assets/logo.svg'; 

import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return(
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta" />
        </header>
        <main>
          <h1>Seu markteplace de coletas de resíduos.</h1>
          <p>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente.</p>
          <Link to="create-point">
            <span><FiLogIn /></span>
            <strong>cadastre seu ponto de coleta.</strong>
          </Link>
        </main>
      </div>
    </div>
  );
}

export default Home;