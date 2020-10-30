// roda as rotas e confere autenticaçao 
import React,{useEffect,useState} from 'react';
import Routes from './routes';
import Menu from './components/Menu';
import EditUser from './pages/EditUserGer';
import "./styles.css"
import AuthApi from './AuthApi';
import Cookies from "js-cookie"
const App = () =>  {
  // seta atenticação como 0 em padrao 
  const [auth, setAuth]= useState(0)
  const readCookie = () =>{
    // le os cookies
    const user =Cookies.get('user')
    const nivel =Cookies.get('nivel')
    // se há cookies define a atenticação como nivel do cookie 
    if(user){
      setAuth(parseInt(nivel))
    }
  }
  // sempre ao executar a pagina, executa esta função 
useEffect(()=>{
  readCookie()
  
},[])
  return(
  <AuthApi.Provider value={{auth,setAuth}}>
    <Routes />
  </AuthApi.Provider>
)
};

export default App;
