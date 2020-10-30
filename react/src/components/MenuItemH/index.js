// item do header
import React from 'react';
import { NavLink } from 'react-router-dom';

import './styles.css';

const MenuItemH = ({ link,imgLink, textLink, active }) => (
    // link= pagina que encaminha, imgLink= imagem do usuario, textLink= texto de cada item, active= se a pagina for igual a link define true
  <li className={active ? "active" : "" } >
    <NavLink exact to={link}  className={imgLink ? "userItem": '' } activeStyle={{
      color: 'royalblue',
      borderBottomColor: 'royalblue',
    }}>
      {/* só exibe img se tiver um imgLink */}
      {imgLink ? <img src={imgLink} className="perfil"/>: '' }
      
      {textLink}
    </NavLink>
  </li>
);

export default MenuItemH;