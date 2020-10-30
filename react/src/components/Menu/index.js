// arquivo do menu adm 
import React, {useState} from 'react';
import "./styles.css";
import { NavLink } from 'react-router-dom';
import SVG_usuario from "../../assets/svgs/usuarios.svg";
import SVG_arrow from "../../assets/svgs/arrow.svg";
import SVG_filmes from "../../assets/svgs/filmes.svg";
import SVG_relatorios from "../../assets/svgs/relatorios.svg";
import SVG_salas from "../../assets/svgs/salas.svg";
import SVG_sessoes from "../../assets/svgs/sessoes.svg";
import SVG_snacks from "../../assets/svgs/snacks.svg";
import MenuItem from "../MenuItem";
import MenuUser from "../MenuUser";
import Cookies from "js-cookie";
import api from "../../services/api"

const Menu = () => {
    // states que definem se o menu e o submenu dos relatorios é exibido 
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [toggleSubmenu, setToggleSubmenu] = useState(false);
    // state das info do user
    const [userInfo, setUserInfo] = useState({});  
    // pega as infos da api do usuario logado e passa para o state 
  const readUserInfo =async ()=>{
      const user =Cookies.get('user')
      const response = await api.get(`/users/${user}`)
      setUserInfo(response.data)
    }
    // função executada sempre que menu chamado
    React.useEffect(()=>{
      readUserInfo()
      
    },[])
    
//    retorna html
    return (
        <>
            <div className="btn" onClick={() => {setToggleSidebar(true)}}>
            <span className="fas fa-bars"></span>
            </div>
            {/* se state da sidebar for true exibe o menu  */}
            <nav className={toggleSidebar ? "sidebar show" : "sidebar"} >
                <ul>
                    {/* se usuário tem uma ft de perfil exibe ela, senão exibe sinueta padrao */}
                    <MenuUser link="/editUserGer" imgLink={userInfo.perfil?require(`../../images/${userInfo.perfil}`):require("../../assets/svgs/usuarios.svg")} textLink={userInfo.nome}/>
                    <MenuItem link="/users" imgLink={SVG_usuario} textLink="Usuários"/>
                    <MenuItem link="/rooms" imgLink={SVG_salas} textLink="Salas"/>
                    <MenuItem link="/movies" imgLink={SVG_filmes} textLink="Filmes"/>
                    <MenuItem link="/sessions" imgLink={SVG_sessoes} textLink="Sessões"/>
                    {/* seta state dos relatorios true ou false e ao mesmo tempo usa este state para mudar o estilo dos itens e rodar seta */}
                    <li onClick={() => {setToggleSubmenu(toggleSubmenu ? false : true)}} className={toggleSubmenu ? "active" : " "} >
                        <a className="rel-btn"><img src={SVG_relatorios} className="svgs"/>Relatórios
                        <span className={toggleSubmenu ? "fas fa-caret-down rotate" : "fas fa-caret-down "}></span>
                        </a>
                        </li>
                        {/* se o submenu true mostra as opcoes de relatorios e se a url da pagina for de algum dos relatórios, muda o estilo deles */}
                        <ul className={toggleSubmenu ? "feat-show show" : "feat-show"} >
                        <li><NavLink exact to={'/relmovies'} innerRef={open => {if(window.location.pathname=='/relmovies') setToggleSubmenu(true)}} activeStyle={{color: 'royalblue', background: 'rgba(176,196,222,0.5)', borderLeftColor: 'royalblue',}}><img src={SVG_filmes} className="minisvgs"/>Filmes</NavLink></li>
                        <li><NavLink exact to={'/relclientes'} innerRef={open => {if(window.location.pathname=='/relclientes') setToggleSubmenu(true)}} activeStyle={{color: 'royalblue', background: 'rgba(176,196,222,0.5)', borderLeftColor: 'royalblue',}}><img src={SVG_usuario} className="minisvgs"/>Clientes</NavLink></li>
                        </ul>
                    {/* seta o menu para nao aparecer */}
                    <li className="minorar" onClick={() => {setToggleSidebar(false)}}>
                        <img src={SVG_arrow} className="minisvgs"/>
                        Minorar
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Menu;

