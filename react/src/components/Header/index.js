// arquivo do header dos usuários 
import React,{useState} from 'react';
import "./styles.css";
import Logout from '../../components/LogoutHeader'
import Logo from "../../assets/logo.png";
import Not from "../../components/Notifications" 
import MenuItemH from "../../components/MenuItemH"
import api from '../../services/api';
import Cookies from "js-cookie"
const Header = () => {
    // states das infos do usuario e da exibição das notificações 
    const [userInfo, setUserInfo] = useState({});  
    const [not, setNot] = useState(false);
    
    // coleta as infos do usuario dos cookies 
  const readUserInfo =async ()=>{
      const user =Cookies.get('user')
      const response = await api.get(`/users/${user}`)
      setUserInfo(response.data)
    }
    // executa sempre que o componente é chamado
    React.useEffect(()=>{
      readUserInfo()
      
    },[])
    // seta se a notificação vai ser exibida ou não 
    const handleNot=()=>{
        
        setNot(!not) 
        
    } 
    // retorna o html
    return(
    <>
    {/* se os state not = true exibe div da notificaçao */}
    <Not className={not? "show":""}/>
    <header style={{display:"flex", justifyContent:"space-between"}} id="main-header">
    <img src={Logo} className="logoH"/>
    
    <ul className="menuList">
    {/* chama o component menuitem que funciona como um <a href=""> */}
    <MenuItemH link="/home"  textLink="EM CARTAZ"/>
    <MenuItemH link="/historico"  textLink="HISTÓRICO"/>
    </ul>
    <ul className="menuList">
    <li><a><span className="fas fa-shopping-cart fa-2x icons" ></span></a></li>
    <li style={not ? {borderBottom: '3px solid royalblue'}:{}}><a onClick={handleNot}><span  className="fas fa-bell fa-2x icons" ></span></a></li>
    
    <MenuItemH link="/editUser" imgLink={userInfo.perfil?require(`../../images/${userInfo.perfil}`):require("../../assets/svgs/usuarios.svg")} textLink={userInfo.nome}/>
    </ul>
    
    
    {/* chama o component logout  */}
    <Logout/>
    </header>
    
    </>
    
)}

export default Header;