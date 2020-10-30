// arquivo das notificações 
import React, {useState, Component} from 'react';
import "./styles.css";
import { NavLink } from 'react-router-dom';
import Cookies from "js-cookie";
import api from "../../services/api"

export default class Notifications extends Component{
    // states do component
    state= {
        notifications:[],
        accept:''

    }
    
    // executa toda vez que comoponent notificação é chamado 
    componentDidMount () {
        
        this.loadProducts();
    }
    
    //carrega todas as notificações do usuario  
    loadProducts = async () => {
    const user =Cookies.get('user')
    const response = await api.get(`/notifications/${user}`) 
        this.setState({notifications: response.data})
        
    }
    // confere o tipo de notificação conferindo se tem ref dos assentos e então retorna true ou false para ser exibido o botao "marcar como lida" ou os botoes "aceitar" e "recusar"
     btns(data) {
         if(data.refAssentos){
             return(true)
         }else{
             return(false)
         }
         
     }
     
    
      render(){
        // se usuario clica em aceitar muda status da notificação, cria uma reserva dos assentos, retorna um alerto com as informações da reserva e recarrega notificações  
        const aceitar= async (id,refAssentos,user_id,session_id) => {
            try{

            
            const response = await api.put(`/notifications/${id}`, {status:2})
            const response2 = await api.post(`/seats/`, {refAssentos, user_id,session_id})
            const response3 = await api.get(`/sessions/${session_id}`)
            var ref=""
            for(var c=0;c<refAssentos.length;c++){
            if(c==refAssentos.length-1){
                ref= ref+''+refAssentos[c]
            }else{
                ref= ref+''+refAssentos[c]+","
            }
            
            }
            
            alert( 'Seus assentos '+ref+' foram reservados para a sessão do filme: '+response3.data.movies.titulo +' do dia '+(new Date(response3.data.data.replace('Z',''))).toLocaleString('pt-BR',{day:'numeric' , month:'numeric' , year:'numeric' })+' as '+response3.data.horario.substring(0,5))
            this.loadProducts()
        }catch(response2){
            alert('Houve um erro: '+ response2.response.data.error)
        }
         }
        //  se usuario recusar, apenas muda status da notificação e recarrega notificações 
        const recusar= async (id) => {
            const response = await api.put(`/notifications/${id}`, {status:2})
            this.loadProducts()
         }
         //  se usuario marcar como lida, apenas muda status da notificação e recarrega notificações
        const read= async (id)=>{
            const response = await api.put(`/notifications/${id}`, {status:2})
            this.loadProducts()
        }
    
    
    return (
        
        <React.Fragment>
           <nav className={`notification ${this.props.className}`} >
                <ul>
                {
                // da um map nas notificações 
                this.state.notifications.map(not=>(
            
            <li key={not.id}>
                {not.texto}
                <div className="confirm">
                    {/* define o botão atraves da função btns */}
                    {this.btns(not) ? <><a onClick={()=>aceitar(not.id,not.refAssentos,not.user_id,not.session_id)}>Aceitar</a><a style={{color:'red'}} onClick={()=>recusar(not.id)}>Recusar</a></> : <a onClick={()=>read(not.id)}>Marcar como lida</a>}
                
                </div>
                
            </li>
        ))}
                </ul>
            </nav>
        </React.Fragment>
    )
    }

}
