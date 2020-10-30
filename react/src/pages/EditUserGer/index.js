// pagina identica a EditUser, o que muda é que importa os components Menu e Logout no lugar de Header, use os comentarios de EditUser caso haja duvidas
import React, {useState, useRef} from 'react';
import { Form } from '@unform/web';
import "./styles.css"
import api from '../../services/api';
import Input from '../../components/Form/input';
import File from '../../components/Form/filePerfil';
import Cookies from "js-cookie"
import Functions from "../../functions"
import Logout from '../../components/Logout';
import Menu from '../../components/Menu';
const crypto = require("crypto");
export default function EditUser() {
  
  
    const formRef =useRef(null)
    const [aviso, setaviso] = useState(false);
    const [userInfo, setUserInfo] = useState({});  
  const readUserInfo =async ()=>{
      const user =Cookies.get('user')
      const response = await api.get(`/users/${user}`)
      setUserInfo(response.data)
    }
    React.useEffect(()=>{
      readUserInfo()
      
    },[])
    
  const handleSubmit = async (data) => {
    
    if(!Functions.senha(data.password)){
        formRef.current.setFieldError('password','A senha deve conter ao menos uma letra maiúscula, 4 minúsculas e 2 numeros.')
      }
      if(data.password!==data.confirmpassword){
        formRef.current.setFieldError('confirmpassword','Senhas diferentes')
      }
      if(!Functions.nome(data.nome)){
        formRef.current.setFieldError('nome','O nome deve ter ao menos 4 caracteres.')
      }
      if( ! await Functions.editEmail(data.email,userInfo.email)){
        formRef.current.setFieldError('email','Email invalido ou ja está cadastrado.')
      }
      if(Functions.senha(data.password) && data.password==data.confirmpassword && await Functions.editEmail(data.email,userInfo.email)){
        if(data.file){
          if(confExt()&& confSize()){
            okUpdate(data)
        }
      }else{
        okUpdate(data)
      }
    }
  }
  const confSize=()=>{
    var file= formRef.current.getFieldValue('file')
    var maxSize=2 * 1024 * 1024
    if(file.size>maxSize){
      alert('O arquivo ultrapassou o limite de 2mb')
      return false
    }else{
      return true
    }
  }
  const confExt=()=>{
    var file= formRef.current.getFieldValue('file')
    const types = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];

    if (types.includes(file.type)) {
      return true
    } else {
      alert('Tipo de arquivo não suportado')
      return false
    }
  }
  const processUpload = (uploadedFile, name) => {
    const data = new FormData();

    data.append("file", uploadedFile, name);

    api.post("/profilePost", data);
  };
  const okUpdate = async (data) => {
    try{
        
        
        if(userInfo.password==Functions.criptografar(data.password)){
          delete data['password']
        delete data['confirmpassword']
          if(data.file){
            var ext = data.file.name.split('.').pop();
            var random=crypto.randomBytes(16)
            var nomeFile = `${random.toString("hex")}.${ext}`;
            data.perfil=nomeFile
            await api.put(`/users/${userInfo.id}`, data) 
            processUpload(data.file,nomeFile)
            reload()
          }else{
            delete data['file']
            await api.put(`/users/${userInfo.id}`, data) 
            reload()
          }
          
         
        
        }
    }catch(error){
        alert('Houve um erro ao editar este usuário: '+error)
    }
  }
  const reload=()=>{
    window.location.reload()
  }
 
  return (
    
    <>
    <Menu/>
    <Logout/>
    <div className="conteudo">
    <Form ref={formRef} onSubmit={handleSubmit}>
      <div className="perfilBox"><File imgLink={userInfo.perfil?require(`../../images/${userInfo.perfil}`):require("../../assets/svgs/usuarios.svg")} name="file"/></div>
      
      <div className="inputItemCad"><span className="spanCad">SEU NOME:</span> <Input id='cadNome' defaultValue={userInfo.nome} required name="nome" type="text" /></div>
      <div className="inputItemCad"><span className="spanCad">SEU EMAIL:</span>  <Input id='cadEmail' defaultValue={userInfo.email} required name="email" type="email" /></div>
      <div className="inputItemCad"><span className="spanCad">SUA SENHA:</span>  <Input id='cadSenha'  required name="password" type="password" /></div>
      <div className="inputItemCad"><span className="spanCad">CONFIRMAR SUA SENHA:</span>  <Input id='cadConfirmSenha' required name="confirmpassword" type="password" /></div>
      <button className="cadastrar">Salvar</button>
      
      
    
      </Form>
      </div>
    </>
  );
}
