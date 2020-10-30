// arquivo da pagina cadastro
import React, {useState, useRef} from 'react';
import { Form } from '@unform/web';
import "./styles.css"
import api from '../../services/api';
import Input from '../../components/Form/input';
import Select from '../../components/Form/select';
import Logo from "../../assets/logo.png";
import { Link, Redirect } from 'react-router-dom';
import Functions from "../../functions"

export default function Cadastro() {
  // state para informar quando usuario foi criado 
    const [created, setcreated] = useState(false);
  // propriedade do unform para usar ref no form
    const formRef =useRef(null)
  // função executada ao enviar form
  const handleSubmit = async (data) => {
    // confere senha 
    if(!Functions.senha(data.password)){
        formRef.current.setFieldError('password','A senha deve conter ao menos uma letra maiúscula, 4 minúsculas e 2 numeros.')
      }
      // confere se confirmsenha = senha
      if(data.password!==data.confirmpassword){
        formRef.current.setFieldError('confirmpassword','Senhas diferentes')
      }
      // confere nome 
      if(!Functions.nome(data.nome)){
        formRef.current.setFieldError('nome','O nome deve ter ao menos 4 caracteres.')
      }
      // confere email 
      if( ! await Functions.email(data.email)){
        formRef.current.setFieldError('email','Email invalido ou ja está cadastrado.')
      }
      // junta o inverso de todas as verificações anteriores para confirmar envio 
      if(Functions.senha(data.password) && data.password==data.confirmpassword && Functions.nome(data.nome) && await Functions.email(data.email)){
        
        okCreate(data)
      }
  }
  // cria registro no bd 
  const okCreate= async (data) => {
      try{
        // criptografa senha 
        data.password=Functions.criptografar(data.password)
        // chama api 
      const response = await api.post(`/users`, data)  
      // seta o state created para true 
      setcreated(true)
      }catch(response){
        alert(response.response.data.error)
    }
  };
  
  
  // retorna html
  return (
    
    <>
    {/* se created=true redireciona para pagina login */}
    {created ? <Redirect to="/" /> : ''}
    <div className="logoBox"><img className="logo" src={Logo}></img></div>
      <div className="conteudo">
      <Form ref={formRef} onSubmit={handleSubmit}>
        
      <div className="inputItemCad"><span className="spanCad">SEU NOME:</span> <Input id='cadNome' required name="nome" type="text" /></div>
      <div className="inputItemCad"><span className="spanCad">SEU EMAIL:</span>  <Input id='cadEmail' required name="email" type="email" /></div>
      <div className="inputItemCad"><span className="spanCad">SUA SENHA:</span>  <Input id='cadSenha' required name="password" type="password" /></div>
      <div className="inputItemCad"><span className="spanCad">CONFIRMAR SUA SENHA:</span>  <Input id='cadConfirmSenha' required name="confirmpassword" type="password" /></div>
      <Input required defaultValue="2" name="nivel" type="hidden" />
      <button className="cadastrar">Cadastrar</button>
      <div className="a"><Link to={'/'}>JÁ TENHO UMA CONTA</Link></div>
      </Form>
      </div>
    </>
  );
}
