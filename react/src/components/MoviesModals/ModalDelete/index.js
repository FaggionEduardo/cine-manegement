// aqruivo modal delete filme 
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import "./styles.css"
import api from '../../../services/api';


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
    width: 400,
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
  // states do modal
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [deleted, setdeleted] = useState(false);
  // função executada ao abrir o modal
  const handleOpen = () => {
    setOpen(true);
   
  };
  // função executada ao fechar modal
  const handleClose = () => {
    setOpen(false);
  };
  // função para deletar definitivamente
  const okDelete = async () => {
    try{
        const response = await api.delete(`/${item.where}/${item.id}`)
        setdeleted(true)
        
    }catch(response){
        alert('Houve um erro ao deletar esta sala: '+response.response.data.error)
    }
   
  
  };
  // recarrega a pagina
  const reload=()=>{
    window.location.reload()
  }
  // retorna html primeira etapa 
  const body = (
      
    <div style={modalStyle } className={classes.paper}>
      <h2 id="simple-modal-title">{item.texto}</h2>
      <br/>
      <p id="simple-modal-description">
      {item.titulo}
      </p>
      
      <p id="simple-modal-description">
      {item.imagem}
      </p>
      <p id="simple-modal-description">
      {item.descricao}
      </p>
      <p id="simple-modal-description">
      {item.duracao}
      </p>
     <br/>
      <div style={{
          display:'flex',
          justifyContent:'space-between'
      }}>
          
          <button className="btns" onClick={handleClose} style={{backgroundColor:'red'}}>Cancelar</button>
          <button className="btns" onClick={okDelete}style={{backgroundColor:'green'}}>Deletar</button>
      </div>
    </div>
  );
  // retorna html segunda etapa
  const body2 = (
      
    <div style={ modalStyle } className={classes.paper}>
      <h2 id="simple-modal-title">{item.titulo} foi deletado com sucesso!</h2>
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
      <span className="fas fa-trash-alt"/>
      </button>
      <Modal
        open={open}
        onClose={deleted ? (handleClose, reload) : handleClose }
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
          {deleted ? body2 : body }
      </Modal>
    </>
  );
}
