// componente de item do menu 
import React from 'react';
import { NavLink } from 'react-router-dom';

import './styles.css';

const MenuItem = ({ link, imgLink, textLink, active }) => (
    // link= pagina que encaminha, imgLink= svg de cada item, textLink= texto de cada item, active= se a pagina for igual a link define true
  <li className={active ? "active" : "" } >
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