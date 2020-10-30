// item com imagem do usuário no menu, mesma coisa que o menu item, apenas muda a classe do li para definir um estilo diferente
import React from 'react';
import { NavLink } from 'react-router-dom';

import './styles.css';

const MenuItem = ({ link, imgLink, textLink, active }) => (
    
  <li className={active ? "user active" : "user" } >
    <NavLink exact to={link} activeStyle={{
      color: 'royalblue',
      background: 'rgba(176,196,222,0.5)',
      borderLeftColor: 'royalblue',
    }}>
      <img src={imgLink} className="svgs"/>
      {textLink}
    </NavLink>
  </li>
);

export default MenuItem;