// arquivo da pagina login
import React, {useState, useRef} from 'react';
import { Form } from '@unform/web';
import "./styles.css"
import api from '../../services/api';
import Input from '../../components/Form/input';
import Select from '../../components/Form/select';
import Logo from "../../assets/logo.png";
import { Link, Redirect } from 'react-router-dom';
import Functions from "../../functions"
import AuthApi from "../../AuthApi"
import Cookies from "js-cookie"

export default function Login() {
  // importa o context da api de autenticação 
  const Auth=React.useContext(AuthApi)
 
  // state para setar se exibe ou não aviso de erro 
  const [aviso, setaviso] = useState(false);  
  // propriedade do unform para usar ref no form
    const formRef =useRef(null)
    // função executada ao enviar form
  const handleSubmit = async (data) => {
    const response = await api.get(`/allUsers`)

    // da um map em todos os users , cinfere se algum tem o mesmo emial e a mesma senha digitados no form 
    response.data.map(user=>{
      if((user.email==data.email)&&(user.password==Functions.criptografar(data.password))){
        // se sim define o nivel na autenticação e o user e o nivel em cookies 
        Auth.setAuth(user.nivel)
        Cookies.set("user", `${user.id}`)
        Cookies.set("nivel", `${user.nivel}`)
        
      }else(
        // senao exibe aviso de erro
        setaviso(true)
      )
      
    })  
    
  }
  
  // retorna html
  return (
    
    <>
    <div className="logoBox"><img className="logo" src={Logo}></img></div>
    <div className="warn"><span style={aviso ? {display:'block'}: {display:'none'}}>Email ou senha incorretos.</span></div>
      <div className="conteudo">
        
      <Form ref={formRef} onSubmit={handleSubmit}>
        
      
      <div className="inputItemCad"><span className="spanCad">SEU EMAIL:</span>  <Input id='cadEmail' required name="email" type="email" /></div>
      <div className="inputItemCad"><span className="spanCad">SUA SENHA:</span>  <Input id='cadSenha' required name="password" type="password" /></div>
      
      
      <button className="logar">Logar</button>
      <div className="a"><Link to={'/cadastro'}>CRIAR CONTA</Link></div>
      </Form>
      </div>
    </>
  );
}
