// arquivo pagina editar usuario
import React, {useState, useRef} from 'react';
import { Form } from '@unform/web';
import "./styles.css"
import api from '../../services/api';
import Input from '../../components/Form/input';
import Header from '../../components/Header';
import File from '../../components/Form/filePerfil';
import Cookies from "js-cookie"
import Functions from "../../functions"
const crypto = require("crypto");
export default function EditUser() {
  
  // propriedade do unform para usar ref no form
    const formRef =useRef(null)
  // state para informações de login do usuario
    const [userInfo, setUserInfo] = useState({});
  // função para ler informações do usuario do cookie e setar no state user info  
  const readUserInfo =async ()=>{
      const user =Cookies.get('user')
      const response = await api.get(`/users/${user}`)
      setUserInfo(response.data)
    }
    // função executada ao carregar a pagina para chamar a função readuserinfo
    React.useEffect(()=>{
      readUserInfo()
      
    },[])
    // função executada ao enviar form 
  const handleSubmit = async (data) => {
    // confere senha 
    if(!Functions.senha(data.password)){
        formRef.current.setFieldError('password','A senha deve conter ao menos uma letra maiúscula, 4 minúsculas e 2 numeros.')
      }
      // confere confirma senha = senha 
      if(data.password!==data.confirmpassword){
        formRef.current.setFieldError('confirmpassword','Senhas diferentes')
      }
      // confere nome 
      if(!Functions.nome(data.nome)){
        formRef.current.setFieldError('nome','O nome deve ter ao menos 4 caracteres.')
      }
      // confere email
      if( ! await Functions.editEmail(data.email,userInfo.email)){
        formRef.current.setFieldError('email','Email invalido ou ja está cadastrado.')
      }
      // junta o inverso de todas as verificações anteriores para confirmar envio 
      if(Functions.senha(data.password) && data.password==data.confirmpassword && await Functions.editEmail(data.email,userInfo.email)){
        // confere se há um arquivo no envio 
        if(data.file){
          // se sim confere se o formato e o tamanho estão de acordo 
          if(confExt()&& confSize()){
            okUpdate(data)
        }
      }else{
        okUpdate(data)
      }
    }
  }
  // função para conferir se tamanho do arquivo não ultrapassa 2mb 
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
  // função para coonferir se tipo de arquivo é permitido 
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
  // função responsavel por enviar arquivo da imagem para api 
  const processUpload = (uploadedFile, name) => {
    // new FormData simula um envio de form do tipo arquivo
    const data = new FormData();

    data.append("file", uploadedFile, name);

    api.post("/profilePost", data);
  };
  // função para editar definitivamente 
  const okUpdate = async (data) => {
    try{
        
        // confere se senha está correta
        if(userInfo.password==Functions.criptografar(data.password)){
          delete data['password']
        delete data['confirmpassword']
        // confere se há um arquivo 
          if(data.file){
            // pega extensão do arquivo 
            var ext = data.file.name.split('.').pop();
            // cria uma sequencia de caracteres aleatórios para ser o nome do arquivo da ft de perfil 
            var random=crypto.randomBytes(16)
            // junta esses caracteres com a extensão  
            var nomeFile = `${random.toString("hex")}.${ext}`;
            // define esse para o nome do arquivo 
            data.perfil=nomeFile
            // atualiza na api 
            await api.put(`/users/${userInfo.id}`, data) 
            // chama a função de upload de arquivo
            processUpload(data.file,nomeFile)
            // recarrega a pagina 
            reload()
          }else{
            // se não há arquivo 
            delete data['file']
            await api.put(`/users/${userInfo.id}`, data) 
            reload()
          }
          
         
        
        }
    }catch(error){
        alert('Houve um erro ao editar este usuário: '+error)
    }
  }
  // recarrega a pagina 
  const reload=()=>{
    window.location.reload()
  }
  // retorna html 
  return (
    
    <>
    <Header/>
    <div className="conteudo">
    <Form ref={formRef} onSubmit={handleSubmit}>
      {/* se há uma imagem de perfil para aquele usuáro ele define como a ft exibida senão ele define a sinueta de usuário padrão  */}
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
