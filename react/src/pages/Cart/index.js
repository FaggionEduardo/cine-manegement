// arquivo da pagina de compra
import React,{useEffect, useState} from 'react';
import {withRouter} from "react-router-dom"
import api from '../../services/api';
import './styles.css';
import { Component } from 'react';
import Header from '../../components/Header'
import Cookies from "js-cookie"
class Cart extends Component{  
    // define states da pagina 
    state= {
        session:[],
        etapa:1,
        one:'active',
        two:'name',
        three:'name',
        seatsOcupados:[],
        assentos:0,
        fileiras:0,
        clickeds:[],
        price2d:0,
        price3d:0
    }
    // função para formatar animação de acordo com info do bd (1,2= 2d,3d)
     animacao=(x)=>{
        if(x==1){
            return "2D"
        }else if(x==2){
            return "3D"
        }
    }
    // formata data do bd para dd/mm
     data=(x)=>{
        var d= new Date(x)
        var day=d.getUTCDate()
        var month=d.getUTCMonth()+1
        return(day+'/'+month)
    }
    // função executada ao confirmar cada etapa 
    confirm=(session)=>{
        // muda barra de progresso e passa etapa atraves dos states 
        if(this.state.etapa==1){
            this.setState({one:'done',two:'active', etapa:2})
        }
        // muda barra de progresso e passa etapa atraves dos states
        if(this.state.etapa==2){
            this.setState({two:'done',three:'active', etapa:3})
        }
        // pega usuario, cria req e envia para função create
        if(this.state.etapa==3){
            const user =Cookies.get('user')
            const req={user_id:user, refAssentos:this.state.clickeds,session_id:session}
            this.create(req)
        }
    }
    // função que definitivamente cria registro em tabela seats 
    create= async (req)=>{
        try{
            await api.post(`/seats`,req)
            this.reload()
        }catch(error){
            alert('Houve um erro:'+error.response.data.error)
        }
    }
    // recarrega a pagina 
    reload=()=>{
        window.location.reload()
      }
      // função para formatar audio de acordo com info do bd (1,2= dub,leg)
     audio=(x)=>{
        if(x==1){
            return "DUB"
        }else if(x==2){
            return "LEG"
        }

    }
    // função chamada quando usuário seleciona assento 
    seatClick(a){
        // pega array de assentos selecionados no state
        let array=this.state.clickeds
        // adiciona o assento clicado
        array.push(a)
        // atualiza array no state 
        this.setState({clickeds:array})
    }
    // função chamada quando usuário desseleciona assento 
    seatUnClick(a){
        // pega array de assentos selecionados no state
        let array=this.state.clickeds
        // encontra posição do array desselecionado
        let index=array.indexOf(a)
        // remove o assento clicado
        array.splice(index, 1)
        // pega array de assentos selecionados no state
        this.setState({clickeds:array})
    }
    // cria array com tamanho e posiçoes de assentos de acordo com tamando da sala 
    criaAssentos=()=>{
        let alfabeto=['A','B','C','D','E']
        let array=[]
        for(let f=0;f<this.state.fileiras;f++){
            array.push([])
            if(f==this.state.fileiras-1){
                let diferenca=20-((this.state.fileiras*20)-this.state.assentos)
                if(diferenca==0){
                    for(let a=0;a<20;a++){
                        array[f].push(alfabeto[f]+`${a+1}`)
                    }
                }else{
                    for(let a=0;a<diferenca;a++){
                        array[f].push(alfabeto[f]+`${a+1}`)
                    }
                }
            }else{
                for(let a=0;a<20;a++){
                    array[f].push(alfabeto[f]+`${a+1}`)
                }
            }
            
        }
        return(array)
    }
    // função executada ao inciar a pagina 
    componentDidMount () {
        
        this.loadProducts();
    }
    // função responsavel por carregar todas as informações variaveis  
     loadProducts = async () => {
        //  pega id da sessão passado como parametro
        const id = this.props.match.params.id;
        var array=[]
        // pega os preços da api
        var responsePrices = await api.get(`/prices`)
        // seta os preços nos states 
        this.setState({price2d:responsePrices.data[0].preco2d,price3d:responsePrices.data[0].preco3d})
        // pega sessão com id do parametro
        var responseSessions = await api.get(`/sessions/${id}`)
        // adiciona em um array para poder fazer array map no return OBS: se não usar map para imprimir no return infos da api, sempre vai dar erro pois o return carrega antes da consulta da api se efetivar.
        array.push(responseSessions.data)
        // seta state da sessão 
        this.setState({session:array})
        // pega todos os assentos reservados vinculados a sessão
        var responseSeats=await api.get(`/seatsBySession/${responseSessions.data.id}`)
         
        var arraySeats=[]
        // preenche um array com todos os assentos ocupados da sessao 
        if(responseSeats.data.length!==0){
            for(let c=0;c<responseSeats.data.length;c++){
                for(let i=0;i<responseSeats.data[c].refAssentos.length;i++){
                    arraySeats.push(responseSeats.data[c].refAssentos[i])
                }
            }
            // seta array de assentos ocupados no state
            this.setState({seatsOcupados:arraySeats})
        } 
        // seta quantidade de assentos e quantidade de fileiras da sala da sessão 
        this.setState({assentos:responseSessions.data.rooms.assentos})
        this.setState({fileiras:Math.ceil(responseSessions.data.rooms.assentos/20)})
    }
    render(){
        // executa a função criar assentos 
        const assentos=this.criaAssentos()
        // retorna html 
    return (
        <React.Fragment>
            <Header/>
            <ol className="progress" data-steps="4">
                <li className={this.state.one}>
                <span className="step"></span>
                </li>
            <li className={this.state.two}>
            <span className="step"></span>
                </li>
            <li className={this.state.three}>
            <span className="step"></span>
                </li>
 
                </ol>
            <div className="principal">
                {
                // executa isso quando esta na etapa 1
                this.state.etapa==1?
                // da um map no array da sessão OBS: o react sempre vai pedir uma key unica no primeiro elemento apos o map 
                    this.state.session.map(session=>(
                            <div className="confirmacao" key={session.id}>
                            <span className="titulo">{session.movies.titulo}</span>
                <img src={require("../../images/"+session.movies.imagem)}/>
                <div className="sessionInfo">

                    <span>{session.rooms.nome}-<span className="minis">{this.animacao(session.animacao)}</span><span className="minis">{this.audio(session.audio)}</span></span>
                    <span>Data: {this.data(session.data)}</span>
                    <span>Horário: {session.horario.substring(5,0)}-{session.horarioFinal.substring(5,0)}</span>
                    <button className="proxEtp" onClick={this.confirm}>Confirmar</button>
                </div>
                </div>
                    ))
                    
                
                :""}
                {
                // executa isso quando esta na etapa 2
                this.state.etapa==2?
                <div className="assentos">
                    <div className="grade">
                    {
                    // da um map nos assentos para gerar colunas 
                    assentos.map(coluna=>(
                        <div key={coluna[1].substring(1,0)}>
                            {
                            // da um map na coluna para gerar assentos 
                            coluna.map(assento=>(
                            // este é um if ternario que define se o assento vai estar ocupado ou não verificando se o assento está incluso no array se assentos ocupados
                                !this.state.seatsOcupados.includes(assento)?this.state.clickeds.includes(assento)?<div onClick={()=>this.seatUnClick(assento)} style={{backgroundColor:'royalblue'}} className="seat" type="checkbox" key={assento} value={assento}/>:<div onClick={()=>this.seatClick(assento)} className="seat" type="checkbox" key={assento} value={assento}/>:<div className="seat" style={{backgroundColor:'red',cursor:"default"}} type="checkbox" key={assento} value={assento}/>
                                
                            ))}
                        </div>
                    )
                        )}
                     </div>  
                     <div className="infosSelecionados">
                    <span>Assentos selecionados: {this.state.clickeds.length}</span>
                    {
                    // atualiza o preço total da compra de acordo com total de assentos selecionados 
                    this.state.session.map(session=>(
                        <span key={session.id}>Preço: {session.animacao==1?this.state.clickeds.length*parseFloat(this.state.price2d):this.state.clickeds.length*parseFloat(this.state.price3d)} Pila</span> 
                    ))}
                        
                    </div>
                    <button className="proxEtp" onClick={this.confirm}>Confirmar</button> 
                </div>
                
                            
                    
                   
                
                :""}
                {
                // executa se esta na etapa 3
                this.state.etapa==3?
                // da um map na sessão como na primeira etapa mas com algumas informações a mais referente a escolha de assentos (assentos e total)
                    this.state.session.map(session=>(
                            <div className="confirmacaoFinal" key={session.id}>        
                    <div className="sessionInfoFinal">
                    <span className="titulo">{session.movies.titulo}</span>
                    <span>{session.rooms.nome}-<span className="minis">{this.animacao(session.animacao)}</span><span className="minis">{this.audio(session.audio)}</span></span>
                    <span>Data: {this.data(session.data)}</span>
                    <span>Horário: {session.horario.substring(5,0)}-{session.horarioFinal.substring(5,0)}</span>
                    <span>Assentos: {this.state.clickeds.map(assento=>(assento+","))}</span>
                    <span>Total: {session.animacao==1?this.state.clickeds.length*parseFloat(this.state.price2d):this.state.clickeds.length*parseFloat(this.state.price3d)} Pila</span>
                    <button className="proxEtp" onClick={()=>this.confirm(session.id)}>Confirmar</button>
                </div>
                </div>
                    ))
                    
                
                :""}
            </div>
        </React.Fragment>
    ) 
        
    }
    

}
export default  withRouter(Cart)
