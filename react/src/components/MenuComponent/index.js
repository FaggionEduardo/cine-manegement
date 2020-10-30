import React from 'react';
import { NavLink } from 'react-router-dom';

import './styles.css';

const MenuComponent = ({ textLink,to, active,click }) =>{

  
  return(
    <li  >
      <NavLink to={to} onClick={click} activeStyle={{color: 'royalblue',borderBottom:'3px solid royalblue'}} >
        
        {textLink}
      </NavLink>
    </li>
  )
} ;

export default MenuComponent;