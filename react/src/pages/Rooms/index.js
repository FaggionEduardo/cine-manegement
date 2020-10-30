// arquivo da pagina salas
import React from 'react';
import api from '../../services/api';
import './styles.css';
import { Component } from 'react';
import Menu from '../../components/Menu'
import ModalDelete from '../../components/RoomsModals/ModalDelete'
import ModalEdit from '../../components/RoomsModals/ModalEdit'
import ModalCreate from '../../components/RoomsModals/ModalCreate'
import Logout from '../../components/Logout'
export default class Rooms extends Component{
    // define states da pagina
    state= {
        rooms:[],
        roomInfo:[],
        page: 1,
        search: ''


    }
    
    // função executa ao pressionar enter no input de pesquisa 
     pressEnter=(e)=>{
        // pega codigo da tecla pressionada 
        var key = e.which || e.keyCode;
        // verifica se a tecla foi enter
        if (key == 13){
            // pega texto digitado pelo usuario 
            var value= document.getElementById('input').value
            // seta texto no state
            this.setState({search:value})
            // chama o load products passando pagina e valor do input como parametro 
            this.loadProducts(1, value)
        }
        
    }
    
    // função executada ao carregar pagina
    componentDidMount () {
        
        this.loadProducts();
    }
    
    // função responsavel por carregar todas as informações variaveis 
    loadProducts = async (page = 1,state="") => {
        if(state==""){
            // se o parametro state(texto da pesquisa) for vazio  pega todos as salas
            var response = await api.get(`/rooms?page=${page}`)
            
        }else{
            // se o parametro state(texto da pesquisa) nao for vazio filtra as salas pelo texto
            var response = await api.get(`/roomSearch/${state}?page=${page}`) 
            
        }
        // pega informações de paginação da resposta da api
        const {docs, ...roomInfo}= response.data;
        // seta nos states
        this.setState({rooms: docs, roomInfo,page})
        
    }
    // função para voltar pagina 
    prevPage =  () => {
        const {page, roomInfo} = this.state;

        if(page== 1) return;
        const pageNumber= page -1
        this.loadProducts(pageNumber,this.state.search)
    }
    // função para passar pagina 
    nextPage =  () => {
        const {page, roomInfo} = this.state;

        if(page== roomInfo.pages) return;
        const pageNumber= page +1
        this.loadProducts(pageNumber,this.state.search)
    }
    
    render(){
    // pega as infos das salas do state
    const {rooms} = this.state; 
    // retorna html
    return (
        
        <React.Fragment>
            <Menu />
            <Logout/> 
            <div className="content">
        <div className="top">
            <ModalCreate  where="rooms"  texto="Criar Sala:"/>
            <div className="submit-line">
            <input onKeyUp={this.pressEnter}  id="input" className="input"></input>
            <button className="submit-lente" type="submit">
            <i className="fa fa-search"></i>
            </button>
            </div>
            
        </div>
        <div className="table">
        <table className='rooms-list'>
            <tbody>
            <tr>
                <td className='item'>Nome</td>
                <td className='item'>Assentos</td>
                <td className='item'>Operações</td>
            </tr>
            {
            // da um map nas salas fazendo uma lista 
            rooms.map(room=>(
            
                <tr key={room.id} className='room-item'>
                    <td className='item'>{room.nome}</td>
                    <td className='item'>{room.assentos}</td>
                   
                    <td className='item op'>
                        <ModalEdit id={room.id} where="rooms" nome={room.nome} assentos={room.assentos}  texto="Editar a sala:"/>
                        <ModalDelete id={room.id} where="rooms" nome={room.nome} assentos={room.assentos}  texto="Tem certeza que deseja deletar a sala:"/>
                    </td>
                    
                </tr>
                
            ))}
            </tbody>
        </table>
        </div>
        <div className='pagina'>
            <p>{rooms.length} de {this.state.roomInfo.total} registros</p>
        <button className="buttons" onClick={this.prevPage}> <span className="fas fa-angle-left fa-2x"></span> </button>
        <p>{this.state.page}</p>
        <button className="buttons" onClick={this.nextPage}> <span className="fas fa-angle-right fa-2x"></span> </button>
        </div>
        </div>
        </React.Fragment>
    )
    }

}
