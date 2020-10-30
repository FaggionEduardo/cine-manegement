// arquivo da pagina relatorio de clientes
import React from 'react';
import api from '../../services/api';
import './styles.css';
import { Component } from 'react';
import Menu from '../../components/Menu'
import Logout from '../../components/Logout'
export default class Users extends Component{
    // define states da pagina
    state= {
        users:[],
        userInfo:[],
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
    // formata nivel de acordo com informação do bd (1=gerente 2=cliente)
    nivel(x){
        if(x==1){
            return "Gerente"
        }else if(x==2){
            return "Cliente"
        }
    }
     // função executada ao carregar pagina
    componentDidMount () {
        
        this.loadProducts();
    }
    
     // função responsavel por carregar todas as informações variaveis 
    loadProducts = async (page = 1,state="") => {
        if(state==""){
             // se o parametro state(texto da pesquisa) for vazio  pega todos os clientes
            var response = await api.get(`/relUsers?page=${page}`)
            
        }else{
            // se o parametro state(texto da pesquisa) nao for vazio filtra os clientes pelo texto
            var response = await api.get(`/userSearch/${state}?page=${page}`) 
            
        }
        // pega informações de paginação da resposta da api
        const {docs, ...userInfo}= response.data;
        // seta nos states
        this.setState({users: docs, userInfo,page})
        
    }
    // função para voltar pagina 
    prevPage =  () => {
        const {page, userInfo} = this.state;

        if(page== 1) return;
        const pageNumber= page -1
        this.loadProducts(pageNumber,this.state.search)
    }
     // função para passar pagina 
    nextPage =  () => {
        const {page, userInfo} = this.state;

        if(page== userInfo.pages) return;
        const pageNumber= page +1
        this.loadProducts(pageNumber,this.state.search)
    }
    
    render(){
    // pega as infos dos users do state
    const {users} = this.state; 
    // retorna html
    return (
        
        <React.Fragment>
            <Menu />
            <Logout/> 
            <div className="content">
        <div className="top" style={{justifyContent:"flex-end"}}>
            
            <div className="submit-line">
            <input onKeyUp={this.pressEnter}  id="input" className="input"></input>
            <button className="submit-lente" type="submit">
            <i className="fa fa-search"></i>
            </button>
            </div>
            
        </div>
        <div className="table">
        <table className='users-list'>
            <tbody>
            <tr>
                <td className='item'>Nome</td>
                <td className='item'>Email</td>
                <td className='item'>Nível de acesso</td>
                <td className='item'>Gastos</td>
            </tr>
            {
            // da um map nos clientes fazendo uma lista 
            users.map(user=>(
            
                <tr key={user.id} className='user-item'>
                    <td className='item'>{user.nome}</td>
                    <td className='item'>{user.email}</td>
                    <td className='item'>{this.nivel(user.nivel)}</td>
                    <td className='item'>R${user.faturamento.toFixed(2)} </td>
                    
                </tr>
                
            ))}
            </tbody>
        </table>
        </div>
        <div className='pagina'>
            <p>{users.length} de {this.state.userInfo.total} registros</p>
        <button className="buttons" onClick={this.prevPage}> <span className="fas fa-angle-left fa-2x"></span> </button>
        <p>{this.state.page}</p>
        <button className="buttons" onClick={this.nextPage}> <span className="fas fa-angle-right fa-2x"></span> </button>
        </div>
        </div>
        </React.Fragment>
    )
    }

}
