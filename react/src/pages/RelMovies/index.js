// arquivo da pagina relatorio filmes 
import React from 'react';
import api from '../../services/api';
import './styles.css';
import { Component } from 'react';
import Menu from '../../components/Menu'
import Logout from '../../components/Logout'
export default class Movies extends Component{
    // define states da pagina
    state= {
        movies:[],
        movieInfo:[],
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
            // se o parametro state(texto da pesquisa) for vazio  pega todos os filmes
            var response = await api.get(`/relMovies?page=${page}`)
            
        }else{
            // se o parametro state(texto da pesquisa) nao for vazio filtra os filmes pelo texto
            var response = await api.get(`/movieSearch/${state}?page=${page}`) 
            
        }
        // pega informações de paginação da resposta da api
        const {docs, ...movieInfo}= response.data;
        // seta nos states
        this.setState({movies: docs, movieInfo,page})
        
    }
    // função para voltar pagina 
    prevPage =  () => {
        const {page, movieInfo} = this.state;

        if(page== 1) return;
        const pageNumber= page -1
        this.loadProducts(pageNumber,this.state.search)
    }
    // função para passar pagina 
    nextPage =  () => {
        const {page, movieInfo} = this.state;

        if(page== movieInfo.pages) return;
        const pageNumber= page +1
        this.loadProducts(pageNumber,this.state.search)
    }
    
    render(){
     // pega as infos dos filmes do state
    const {movies} = this.state; 
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
        <table className='movies-list'>
            <tbody>
            <tr>
                <td className='item'>Título</td>
                <td className='item'>Imagem</td>
                <td className='item'>Descrição</td>
                <td className='item'>Duração</td>
                <td className='item'>Faturamento</td>
            </tr>
            {
            // da um map nos filmes fazendo uma lista 
            movies.map(movie=>(
            
                <tr key={movie.id} className='movie-item'>
                    <td className='item'>{movie.titulo}</td>
                    <td className='item'>{movie.imagem}</td>
                    <td className='item'>{movie.descricao}</td>
                    <td className='item'>{movie.duracao}</td>
                    <td className='item'>R${movie.faturamento.toFixed(2)}</td>
                    
                </tr>
                
            ))}
            </tbody>
        </table>
        </div>
        <div className='pagina'>
            <p>{movies.length} de {this.state.movieInfo.total} registros</p>
        <button className="buttons" onClick={this.prevPage}> <span className="fas fa-angle-left fa-2x"></span> </button>
        <p>{this.state.page}</p>
        <button className="buttons" onClick={this.nextPage}> <span className="fas fa-angle-right fa-2x"></span> </button>
        </div>
        </div>
        </React.Fragment>
    )
    }

}
