// arquivo do modal de criação de sessao 
import React, {useState, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Form } from '@unform/web';
import "./styles.css"
import api from '../../../services/api';
import Input from '../../Form/input';
import Select from '../../Form/select';
import Rooms from '../../../pages/Rooms';
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
  // pega todas as salas da api 
  const buscaRooms= async ()=> {
    try{
      const rooms=await api.get(`/allrooms`)
      setrooms(rooms)
    }catch(error){
      alert(error)
    }
  }
  // pega todos os filmes da api 
  const buscaMovies= async ()=> {
    try{
      const movies=await api.get(`/allmovies`)
      setmovies(movies)
    }catch(error){
      alert(error)
    }
  }
  
  // define os estilos definidos em useStyles na const cLasses
  const classes = useStyles();
  // propriedade do unform para usar ref no form
  const formRef =useRef(null)
  // states do modal
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [created, setcreated] = useState(false);
  const [rooms, setrooms] = useState({data:[{id:0}]});
  const [movies, setmovies] = useState({data:[{id:0}]});
  // executa ao enviar o form
  const handleSubmit = async (data) => {
      okCreate(data)
      
  }
  // função executada ao abrir o modal
  const handleOpen = () => {
  setOpen(true);
  buscaRooms() 
  buscaMovies() 
  };
  // função executada ao fechar modal
  const handleClose = () => {
    setOpen(false);
  };
  // função para criar definitivamente
  const okCreate= async (data) => {
      try{
      const response = await api.post(`/${item.where}`, data)  
      setcreated(true)
      }catch(response){
        alert(response.response.data.error)
      }
   
  
  };
  // recarrega pagina
  const reload=()=>{
    window.location.reload()
  }
  // retorna html primeira etapa 
  const body = (
      
    <div style={modalStyle } className={classes.paper}>
      <h2 id="simple-modal-title">{item.texto}</h2>
      <br/>
      <Form ref={formRef} onSubmit={handleSubmit}>
      <div className="inputItem"><span className="span">Data:</span> <Input required name="data" type="date" /></div>
      
      <div className="inputItem"><span className="span">Horario:</span>  <Input required name="horario" type="time" /></div>
      <div className="inputItem"><span className="span">Animação:</span>  
      <Select defaultValue="0" className="select" required name="animacao" >
        <option disabled  value='0'></option>
        <option value='1'>2D</option>
        <option value='2'>3D</option>
        </Select>
        </div>
        <div className="inputItem"><span className="span">Áudio:</span> 
        <Select defaultValue="0" className="select" required name="audio" >
        <option disabled  value='0'></option>
        <option value='1'>Dublado</option>
        <option value='2'>Legendado</option>
        </Select>
        </div>
        <div className="inputItem"><span className="span">Sala:</span> 
        <Select defaultValue="0" className="select" required name="room_id" >
        <option disabled  value='0'></option>
        {
          // da um map nas salas para exibir todas no select 
        rooms.data.map(room=>(
          <option key={room.id} value={room.id}>{room.nome} ({room.assentos} assentos)</option>
        ))

        }
        </Select>
        </div>
        <div className="inputItem"><span className="span">Filme:</span> 
        <Select defaultValue="0" className="select" required name="movie_id" >
        <option disabled  value='0'></option>
        {
          // da um map nos filmes para exibir todos no select
        movies.data.map(movie=>(
          <option key={movie.id} value={movie.id}>{movie.titulo} ({movie.duracao})</option>
        ))

        }
        </Select>
        </div>
      
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
      <h2 id="simple-modal-title">Sessão criada com sucesso!</h2>
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
