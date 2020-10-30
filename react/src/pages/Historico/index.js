// arquivo pagina historico de sessoes do usuário
import React from 'react';
import api from '../../services/api';
import './styles.css';
import { Component } from 'react';
import Header from '../../components/Header'
import Cookies from "js-cookie"
export default class Historicos extends Component{
    // define states da pagina  
    state= {
        historicos:[],
        historicoInfo:[],
        page: 1,
        search: '',
        error:''


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
    // formata data em formato dd/mm/aa
    data(x){
        x=x.replace('Z','')
        var d = new Date(x);
        var year = d.getFullYear();
        var month = d.getMonth()+1;
        var day = d.getDate();
        day=("00" + day).slice(-2)
        month=("00" + month).slice(-2)
        return(day+'/'+month+'/'+year)
    }
    // função executada ao carregar pagina 
    componentDidMount () {
        
        this.loadProducts();
    }
    
    // função responsavel por carregar todas as informações variaveis 
    loadProducts = async (page = 1,state="") => {
        try{
        // pega id do user no cookie
        const user =Cookies.get('user')
        if(state==""){
            // se o parametro state(texto da pesquisa) for vazio  paga todos os historicos
            var response = await api.get(`/historicos/${user}?page=${page}`)
            
        }else{
            // se o parametro state(texto da pesquisa) nao for vazio filtra os historicos pelo texto
            var response = await api.get(`/historicoSearch/${user}/${state}?page=${page}`) 
            
        }
        // pega informações de paginação da resposta da api
        const {docs, ...historicoInfo}= response.data;
        // seta nos states
        this.setState({historicos: docs, historicoInfo,page})
    }catch(response){
        this.setState({error:response.response.data.error})
    }
    }
    // função para voltar pagina 
    prevPage =  () => {
        const {page, historicoInfo} = this.state;

        if(page== 1) return;
        const pageNumber= page -1
        this.loadProducts(pageNumber,this.state.search)
    }
    // função para passar pagina 
    nextPage =  () => {
        const {page, historicoInfo} = this.state;

        if(page== historicoInfo.pages) return;
        const pageNumber= page +1
        this.loadProducts(pageNumber,this.state.search)
    }
     
    render(){
    // pega as infos dos historicos do state 
    const {historicos} = this.state; 
    
    // retorna html
    return (
        
        <React.Fragment>
            <Header/> 
            <div className="content" >
                {/* se não há nenhum historico exibe este erro  */}
    {this.state.error!==''? <div className="vazio">{this.state.error}</div>:<>
        <div className="top" style={{justifyContent:"flex-end"}}>
            <div className="submit-line">
            <input onKeyUp={this.pressEnter}  id="input" className="input"></input>
            <button className="submit-lente" type="submit">
            <i className="fa fa-search"></i>
            </button>
            </div>
            
        </div>
        <div className="table">
        <table className='historicos-list'>
            <tbody>
            <tr>
                <td className='item'>Filme</td>
                <td className='item'>Sala</td>
                <td className='item'>Data</td>
                
            </tr>
            {
            // da um map nos históricos fazendo uma lista 
            historicos.map(historico=>(
            
                <tr key={historico.id} className='historico-item'>
                    <td className='item'>{historico.movies.titulo}</td>
                    <td className='item'>{historico.rooms.nome}</td>
                    <td className='item'>{this.data(historico.data)}</td>
                    
                    
                </tr>
                
            ))}
            </tbody>
        </table>
        </div>
        <div className='pagina'>
            <p>{historicos.length} de {this.state.historicoInfo.total} registros</p>
        <button className="buttons" onClick={this.prevPage}> <span className="fas fa-angle-left fa-2x"></span> </button>
        <p>{this.state.page}</p>
        <button className="buttons" onClick={this.nextPage}> <span className="fas fa-angle-right fa-2x"></span> </button>
        </div>
        </>
        }
        </div>
        </React.Fragment>
    )
    }

}
