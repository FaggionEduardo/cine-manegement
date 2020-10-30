// arquivo da pagina home 
import React from 'react';
import {Link} from "react-router-dom"
import api from '../../services/api';
import './styles.css';
import { Component } from 'react';
import Header from '../../components/Header'

export default class Home extends Component{
// define state sda pagina 
    state= {
        datas:[],
        page:1,
        active:'',
        diferenca:99999999999,
        sessions:[],
        movies:[],
        rooms:[],
        executou:false,
        click2d:false,
        click3d:false,
        clickDub:false,
        clickLeg:false,



    }
    // função para formatar animação de acordo com info do bd (1,2= 2d,3d)
    animacao(x){
        if(x==1){
            return "2D"
        }else if(x==2){
            return "3D"
        }
    }
    // função executa ao selecionar uma data 
    handleActive(data){
       this.setState({active:data})
       this.loadProducts()
    }
    // define a data ativa quando carrega a pagina (função roda apenas uma vez)
    setActive(){
        if(!this.state.executou){
        let now=new Date().getTime()
        for(let i=0; i<this.state.datas.length; i++){
            if((new Date(this.state.datas[i]).getTime()-now)<this.state.diferenca ){
                this.setState({diferenca:new Date(this.state.datas[i]).getTime()-now})
                this.setState({active:this.state.datas[i]})

            }
        }
        this.setState({executou:true})
    }
    }
    // lista as datas limitadno de 7 em 7 dias 
    listItems(items, pageActual, limitItems){
        let result = [];
        let totalPage = Math.ceil( items.length / limitItems );
        let count = ( pageActual * limitItems ) - limitItems;
        let delimiter = count + limitItems;
        if(pageActual <= totalPage){
            for(let i=count; i<delimiter; i++){
                if(items[i] != null){
                    
                    result.push(items[i]==this.state.active?<span  style={{color:"red"}} key={items[i]} className="data"><p>{this.dia(items[i])}</p><p>{this.data(items[i])}</p></span>:<span onClick={()=>this.handleActive(items[i])} key={items[i]} className="data"><p>{this.dia(items[i])}</p><p>{this.data(items[i])}</p></span>);

                }
                count++;
            }
        }
        
        return result;
    };
    // retorna dia da semana ou 'hoje' se o dia passado = data atual 
    dia(x){
        var now= new Date()
        var now=now.toISOString().substring(10,0)
        if(x==now){
            return("HOJE")
        }
        var d= new Date(x)
        var day=d.getUTCDay()
        var dias=['DOM','SEG','TER','QUA','QUI','SEX','SAB']
        return(dias[day])
    }
    // formata a data em dd/mm
    data(x){
        var d= new Date(x)
        var day=d.getUTCDate()
        var month=d.getUTCMonth()+1
        return(day+'/'+month)
    }
    // confere se a data ja passou para ela não ser exibida 
    conferePassado(x){
        var d= new Date(x)
        var day=d.getUTCDate()
        var month=d.getUTCMonth()
        var year=d.getUTCFullYear()
        var nowd= new Date()
        var nowday=nowd.getUTCDate()
        var nowmonth=nowd.getUTCMonth()
        var nowyear=nowd.getUTCFullYear()
        
        if(parseInt(year.toString()+month.toString()+day.toString())>=parseInt(nowyear.toString()+nowmonth.toString()+nowday.toString())){
            return true
        }else{
            return false
        }

    }
    // função para formatar audio de acordo com info do bd (1,2= dub,leg)
    audio(x){
        if(x==1){
            return "DUB"
        }else if(x==2){
            return "LEG"
        }
    }
    // função executada quanod pagina carrega
    componentDidMount () {
        
        this.loadProducts();
    }
    // passar pagina (datas)
    prevPage =  () => {
        const {page} = this.state;

        const pageNumber= page -1
        this.setState({page:pageNumber})
        
    }
    // retornar pagina (datas)
    nextPage =  () => {
        const {page} = this.state;

        if(page== 7) return;
        const pageNumber= page +1
       this.setState({page:pageNumber})
    }
    // função que carrega todas as sessões do filme e sala passados OBS: as sessões ja estão definidades pela data no load products 
    carregaSessions(roomId, movieId){
        var array=[]
        // for carrega todas as sessoes, if's filtram por 3d , 2d , dub, legendando e suas combinações 
        for(let c=0;c<this.state.sessions.length;c++){
            if(this.state.click3d){
                if(this.state.sessions[c].movie_id==movieId&& this.state.sessions[c].room_id==roomId && this.state.sessions[c].animacao==2){
                    array.push(<Link key={this.state.sessions[c].id} to={`cart/${this.state.sessions[c].id}`} className="sessionButton">{this.state.sessions[c].horario.substring(5,0)}<span>{this.animacao(this.state.sessions[c].animacao)}</span><span>{this.audio(this.state.sessions[c].audio)}</span></Link>)
                    }
            }else if(this.state.click3d && this.state.clickLeg){
                if(this.state.sessions[c].movie_id==movieId&& this.state.sessions[c].room_id==roomId && this.state.sessions[c].animacao==2 && this.state.sessions[c].audio==2){
                    array.push(<Link key={this.state.sessions[c].id} to={`cart/${this.state.sessions[c].id}`} className="sessionButton">{this.state.sessions[c].horario.substring(5,0)}<span>{this.animacao(this.state.sessions[c].animacao)}</span><span>{this.audio(this.state.sessions[c].audio)}</span></Link>)
                    }
            }else if(this.state.click3d && this.state.clickDub){
                if(this.state.sessions[c].movie_id==movieId&& this.state.sessions[c].room_id==roomId && this.state.sessions[c].animacao==2 && this.state.sessions[c].audio==1){
                    array.push(<Link key={this.state.sessions[c].id} to={`cart/${this.state.sessions[c].id}`} className="sessionButton">{this.state.sessions[c].horario.substring(5,0)}<span>{this.animacao(this.state.sessions[c].animacao)}</span><span>{this.audio(this.state.sessions[c].audio)}</span></Link>)
                    }
            }else if(this.state.click2d && this.state.clickDub){
                if(this.state.sessions[c].movie_id==movieId&& this.state.sessions[c].room_id==roomId && this.state.sessions[c].animacao==1 && this.state.sessions[c].audio==1){
                    array.push(<Link key={this.state.sessions[c].id} to={`cart/${this.state.sessions[c].id}`} className="sessionButton">{this.state.sessions[c].horario.substring(5,0)}<span>{this.animacao(this.state.sessions[c].animacao)}</span><span>{this.audio(this.state.sessions[c].audio)}</span></Link>)
                    }
            }else if(this.state.click2d && this.state.clickLeg){
                if(this.state.sessions[c].movie_id==movieId&& this.state.sessions[c].room_id==roomId && this.state.sessions[c].animacao==1 && this.state.sessions[c].audio==2){
                    array.push(<Link key={this.state.sessions[c].id} to={`cart/${this.state.sessions[c].id}`} className="sessionButton">{this.state.sessions[c].horario.substring(5,0)}<span>{this.animacao(this.state.sessions[c].animacao)}</span><span>{this.audio(this.state.sessions[c].audio)}</span></Link>)
                    }
            }else if(this.state.click2d){
                if(this.state.sessions[c].movie_id==movieId&& this.state.sessions[c].room_id==roomId && this.state.sessions[c].animacao==1){
                    array.push(<Link key={this.state.sessions[c].id} to={`cart/${this.state.sessions[c].id}`} className="sessionButton">{this.state.sessions[c].horario.substring(5,0)}<span>{this.animacao(this.state.sessions[c].animacao)}</span><span>{this.audio(this.state.sessions[c].audio)}</span></Link>)
                    }
            } else if(this.state.clickDub){
                if(this.state.sessions[c].movie_id==movieId&& this.state.sessions[c].room_id==roomId && this.state.sessions[c].audio==1){
                    array.push(<Link key={this.state.sessions[c].id} to={`cart/${this.state.sessions[c].id}`} className="sessionButton">{this.state.sessions[c].horario.substring(5,0)}<span>{this.animacao(this.state.sessions[c].animacao)}</span><span>{this.audio(this.state.sessions[c].audio)}</span></Link>)
                    }
            }else if(this.state.clickLeg){
                if(this.state.sessions[c].movie_id==movieId&& this.state.sessions[c].room_id==roomId && this.state.sessions[c].audio==2){
                    array.push(<Link key={this.state.sessions[c].id} to={`cart/${this.state.sessions[c].id}`} className="sessionButton">{this.state.sessions[c].horario.substring(5,0)}<span>{this.animacao(this.state.sessions[c].animacao)}</span><span>{this.audio(this.state.sessions[c].audio)}</span></Link>)
                    }
        }else{
            if(this.state.sessions[c].movie_id==movieId&& this.state.sessions[c].room_id==roomId){
                array.push(<Link key={this.state.sessions[c].id} to={`cart/${this.state.sessions[c].id}`} className="sessionButton">{this.state.sessions[c].horario.substring(5,0)}<span>{this.animacao(this.state.sessions[c].animacao)}</span><span>{this.audio(this.state.sessions[c].audio)}</span></Link>)
                }
               
                             
        }
    }
    return(array)
}
// carrega as sessoes variaveis 
    loadProducts = async () => {

            var responseSessions = await api.get(`/allSessions`)
            var arrayDatas=[]
            // pega todas as datas das sessoes em inclui em um id (se data ja estiver inclusa, não inclui)
            for(var c=0;c<responseSessions.data.length;c++){
               
                if(!arrayDatas.includes(responseSessions.data[c].data.substring(10,0))&& this.conferePassado(responseSessions.data[c].data)){
                    arrayDatas.push(responseSessions.data[c].data.substring(10,0))
                }

            }
            // seta as datas no state 
            this.setState({datas:arrayDatas})
            // chama a função que define a primeira active 
            this.setActive()
            // consulta na api todas as sessoes que tem a data selecionada
            var responseSessionsByDate=await api.get(`/sessionsByDate/${this.state.active+'T00:00:00.000Z'}`)
            this.setState({sessions:responseSessionsByDate.data})
            // consulta todos os filmes
            var responseMovies=await api.get(`/allMovies`)
            this.setState({movies:responseMovies.data})
            // consulta todos as salas 
            var responseRooms=await api.get(`/allrooms`)
            this.setState({rooms:responseRooms.data})
            
    }
    
    
    render(){
        // funcoes que setam o state dos filtros de 3d 2d dub leg 
        const set3d=()=>{
            this.state.click3d? this.setState({click3d:false}) : this.setState({click3d:true})
           
        }
        const set2d=()=>{
            this.state.click2d? this.setState({click2d:false}) : this.setState({click2d:true})
            
        }
        const setLeg=()=>{
            this.state.clickLeg? this.setState({clickLeg:false}) : this.setState({clickLeg:true})
        }
        const setDub=()=>{
            this.state.clickDub? this.setState({clickDub:false}) : this.setState({clickDub:true})
        }
        // retorna html
    return (
        
        <React.Fragment>
            <Header/>
            <div className="contentHome">
                <div className="datas">
                {
                // se a pagina for um não exibe a opção de voltar um pagina 
                this.state.page==1?"":
                    <span onClick={this.prevPage} className="fas fa-chevron-left fa-3x set"></span>
                }
                    {
                    // exibe todas as datas com limite de 7
                    this.listItems(this.state.datas,this.state.page,7)}
                    {
                    // se a pagina for a ultima não exibe a opção de passar pagina 
                    this.state.page==Math.ceil( this.state.datas.length / 7 )?"":
                    <span onClick={this.nextPage} className="fas fa-chevron-right fa-3x set"></span>
                }
                </div>
                <div className="filtros">{this.state.click2d? <input disabled onClick={set3d} type="checkbox"/> :<input onClick={set3d} type="checkbox"/>} 3D  {this.state.click3d? <input disabled onClick={set2d} type="checkbox"/> :<input onClick={set2d} type="checkbox"/>}  2D {this.state.clickDub? <input disabled onClick={setLeg} type="checkbox"/> :<input onClick={setLeg} type="checkbox"/>} LEG {this.state.clickLeg? <input disabled onClick={setDub} type="checkbox"/> :<input onClick={setDub} type="checkbox"/>} DUB</div>
                <div className="filmes">
                    {
                        // da um map em todos os filmes 
                        this.state.movies.map(movie=>(
                            <div key={movie.id}>
                            <div className='movie' >
                                <img src={require("../../images/"+movie.imagem)}/>
                        <div className="desctemp">
                        <div >{movie.titulo}</div>
                        <div className="descricao">{movie.descricao}</div>
                        <div className="tempo">Tempo estimado:{movie.duracao.substring(5,0)}h</div>
                        </div>
                        </div>
                        <div className="salas">
                        {
                        // da um map em todas as salas 
                        this.state.rooms.map(room=>(
                            <div key={room.id}>
                            <span  className="nomesala">{room.nome}</span>
                            {
                            // exibe as sessoes dos filmes e salas passados 
                            this.carregaSessions(room.id,movie.id)
                            
                            }
                            </div>
                        ))}
                            </div>
                        </div>
                        )
                        )
                    }
                </div>
            </div>
        </React.Fragment>
    )
    }

}
