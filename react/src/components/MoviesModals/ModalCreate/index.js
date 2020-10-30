// arquivo do modal de criação de filme 
import React, {useState, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Form } from '@unform/web';
import "./styles.css"
import api from '../../../services/api';
import Input from '../../Form/input';
import File from '../../Form/file';
// define posição do modal
function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
// define estilo do modal
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: '#1e1e1e',
    border: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: 'royalblue'
  },
}));

export default function SimpleModal(item) {
  // define os estilos definidos em useStyles na const cLasses
  const classes = useStyles();
  // propriedade do unform para usar ref no form
  const formRef =useRef(null)
  // states do modal
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [created, setcreated] = useState(false);
  // executa ao enviar o form
  const handleSubmit = async (data) => {
    // confere se o formato e o tamanho estão de acordo 
      if(confExt()&& confSize()){

        okCreate(data)
      }
      
  }
  // função executada ao abrir o modal 
  const handleOpen = () => {
  setOpen(true); 
  };
  // função executada ao fechar modal
  const handleClose = () => {
    setOpen(false);
  };
  // função responsavel por enviar arquivo da imagem para api
  const processUpload = (uploadedFile, name) => {
    // new FormData simula um envio de form do tipo arquivo
    const data = new FormData();

    data.append("file", uploadedFile, name);

    api.post("/posts", data);
  };
  // função para criar definitivamente
  const okCreate= async (data) => {
      try{
        // pega extensão do arquivo 
      var ext = data.file.name.split('.').pop();
      // define o nome da imagem com o nome digitado pelo usuario + extensão 
      data.imagem=data.imagem+'.'+ext
      // atualiza na api 
      const response = await api.post(`/${item.where}`, data)  
      setcreated(true)
      
      var name=data.imagem
      // chama a função de upload de arquivo
      processUpload(data.file,name)
      }catch(response){
        alert(response.response.data.error)
      }
   
  
  };
  // recarrega pagina
  const reload=()=>{
    window.location.reload()
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
  // retorna html primeira etapa 
  const body = (
      
    <div style={modalStyle } className={classes.paper}>
      <h2 id="simple-modal-title">{item.texto}</h2>
      <br/>
      <Form ref={formRef} encType="multipart/form-data"  onSubmit={handleSubmit}>
      <div className="inputItem"><span className="span">Título:</span> <Input required name="titulo" type="text" /></div>
      
      <div className="inputItem"><span className="span">Nome imagem:</span>  <Input required name="imagem" type="text" /></div>
      <div className="inputItem"><span className="span">Arquivo:</span><File  name="file"/></div><span className="aviso">Atenção! A  imagem e seu nome não poderão ser editados! </span>
      <div className="inputItem"><span className="span">Descrição:</span>  <Input required name="descricao" type="text" /></div>
      <div className="inputItem"><span className="span">Duração:</span>  <Input required name="duracao" type="time"  /></div>
      <br/>
      <div style={{
          display:'flex',
          justifyContent:'space-between'
      }}>
          
          <button className="btns" onClick={handleClose} style={{backgroundColor:'red'}}>Cancelar</button>
          <button className="btns" style={{backgroundColor:'green'}}>Criar</button>
          
      </div>
      </Form>
    </div>
  );
  // retorna html segunda etapa 
  const body2 = (
      
    <div style={ modalStyle } className={classes.paper}>
      <h2 id="simple-modal-title">Filme criado com sucesso!</h2>
      <br/>
      <div style={{
          display:'flex',
          justifyContent:'center'
      }}>
          
          <button className="btns" onClick={handleClose, reload} style={{backgroundColor:'royalblue'}}>OK</button>
          
      </div>
    </div>
  );
  // retorna html botao
  return (
    <>
      <button type="button" style={{background:'none', border:'none'}} onClick={handleOpen}>
      <span className="fas fa-plus-circle fa-2x"/>
      </button>
      <Modal
        open={open}
        onClose={created ? (handleClose, reload) : handleClose }
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
          {created ? body2 : body }
      </Modal>
    </>
  );
}
