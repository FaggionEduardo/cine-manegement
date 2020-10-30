// arquivso de funções diversas
module.exports = {
// simplifica texto para comparação 
simplify(text){
text= text.replace(/\s/g, '');
return text.toUpperCase()
},
// confere se a data da sessão é em menos ou mais que dez dias  
dezDias(sessionDate){
    const moment = require('./moment.js');
    const now  = moment.tz( "America/Sao_Paulo").format('YYYY-MM-DD');
    var date = new Date(now);
    date.setDate(date.getDate() + 10);
    
    if(date<=sessionDate){
        return true;
    }else{
        return false;
    }
},
// soma duas horas
somaHoras(x, y){
    var hora = this.formataHora(x)
    horario=y.split("")
    var hour = horario[0]+horario[1];
    var min = horario[3]+horario[4];
    hora.setHours(hora.getHours()+parseInt(hour))
    hora.setMinutes(hora.getMinutes()+parseInt(min))
    hour =hora.getHours();
    min =hora.getMinutes();
    hour= ("00" + hour).slice(-2)
    min= ("00" + min).slice(-2)
    var horaFinal= hour+":"+min+":00"
    return horaFinal
},
// confere se o horário passado está disponivel na sala passada
async sessionSala(roomId, horario, horarioFinal,date ) {
    const Sessions = require( './src/models/sessions');
    const sessionsRoom= await Sessions.findAll({where: {
        room_id: roomId
    }})
    if(sessionsRoom.length!==0){
        for(c=0;c<sessionsRoom.length;c++){
                data=new Date(date)
                if(data.getTime()==sessionsRoom[c].data.getTime()){
                var hora=this.formataHora(horario)
                var horaFinal=this.formataHora(horarioFinal)
                if(hora>horaFinal){
                    var day = horaFinal.getDate(); 
                    horaFinal.setDate(day+1)
                }
                hora=hora.getTime()
                horaFinal=horaFinal.getTime()
                var sessionHorario=this.formataHora(sessionsRoom[c].horario)
                var sessionHorarioFinal=this.formataHora(sessionsRoom[c].horarioFinal)
                
                if(sessionHorario>sessionHorarioFinal){
                    var day = sessionHorarioFinal.getDate(); 
                    sessionHorarioFinal.setDate(day+1)
                }
                sessionHorario=sessionHorario.getTime()
                sessionHorarioFinal=sessionHorarioFinal.getTime()
                if(( hora <= sessionHorario && sessionHorario<= horaFinal)  ||  (hora <= sessionHorarioFinal && sessionHorarioFinal<= horaFinal) ){
                    return false
                }
            
            }
            
         
        }
        return true
    }else{
        return true
        }
    },
    // formata o horário que vem do bd para o formato de date
    formataHora(h){
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth();
            var day = d.getDate();
            x=h.split("")
            var hour = x[0]+x[1];
            var min = x[3]+x[4];
            var hora = new Date(year,month,day,hour,min)
            return hora
    },
// confere se os assentos passados estão disponiveis na sessão passada
    async confereAssentos(selecionados, session) {
        const Seats = require( './src/models/seats');
        const seatsSession= await Seats.findAll({where: {
            session_id: session
        }})
        if(seatsSession.length!==0){
            for(c=0;c<seatsSession.length;c++){
                for(i=0;i<selecionados.length;i++){
                    var index=seatsSession[c].refAssentos.indexOf(selecionados[i])
                    if(index!==-1){
                        return false
                    }
                }
            }
            return true
        }else{
            return true
        }
    },
// confere se o horario e data passados ja aconteceram
    confereRealizado(horario, data){
        var hora=this.juntaDataHora(horario, data)
        var now= new Date()
        if(hora<=now){
            return true
        }else{
            return false
        }
},
// junta a data e a hora que vem separados do bd em uma data no formato Date
juntaDataHora(horario, data){
    var d = new Date(data);
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate()+1;
    x=horario.split("")
    var hour = x[0]+x[1];
    var min = x[3]+x[4];
    var hora = new Date(year,month,day,hour,min)
    return hora
},
// envia notificação para o usuário quando sessão é deletada
async notificacao(session,data,horario,horarioFinal, movieId, animacao, audio) {
    const Seats = require( './src/models/seats');
    const Sessions = require( './src/models/sessions');
    const Movies = require( './src/models/movies');
    const Notifications = require('./src/models/notifications')
    const sessionsMovie= await Sessions.findAll({
        where: {movie_id: movieId},
        
    })
    const seatsSession= await Seats.findAll({
    where: {session_id: session},
    
})
    const movie = await Movies.findByPk(movieId);
    if(seatsSession.length==0){
        return true
    }else{
    await seatsSession.map(async seat=>{
        var diferenca= 999999999999
        if(sessionsMovie.length!==1){
           for(let sessions of sessionsMovie){
                if((sessions.movie_id==movieId) && (sessions.animacao==animacao) && (sessions.audio==audio) && (sessions.id !== session) && (sessions.data.getTime()==data.getTime())){
                        var validate= await this.confereAssentos(seat.refAssentos, sessions.id)
                        if(validate==true){
                            var dataHoraTeste=this.juntaDataHora(sessions.horario, sessions.data)
                            var dataHoraSession=this.juntaDataHora(horario, data)
                            
                            if(Math.abs(dataHoraSession-dataHoraTeste)<diferenca){
                                diferenca=Math.abs(dataHoraSession-dataHoraTeste)
                                var winSession= sessions
                                var user= seat.user_id
                                var assentos= seat.refAssentos
                                var texto= "A sua sessão para o filme: "+movie.titulo+" no dia "+this.formataData(data)+" das "+horario.substr(0,5)+" as "+horarioFinal.substr(0,5)+" foi cancelada. No entanto, temos disponivel uma sessão no mesmo dia as "+winSession.horario.substr(0,5)+" com a mesma composição, gostaria de reservar seu lugar?"
                                var req={texto: texto, status:1, refAssentos: assentos, user_id: user, session_id:winSession.id}
                                
                                
                            }
                            
                        }
                    
                }
            }
            if(winSession){
                await Notifications.create(req);
                
            }else{
               
            var user =seat.user_id
            var texto="A sua sessão para o filme: "+movie.titulo+" no dia "+this.formataData(data)+" das "+horario.substr(0,5)+" as "+horarioFinal.substr(0,5)+" foi cancelada."
            var req={texto: texto, status:1, user_id: user}
            await Notifications.create(req);
            }
           
                    
        }else{
           
            var user =seat.user_id
            var texto="A sua sessão para o filme: "+movie.titulo+" no dia "+this.formataData(data)+" as "+horarioFinal.substr(0,5)+" foi cancelada."
            var req={texto: texto, status:1, user_id: user}
            await Notifications.create(req);
                 
        }
        
    })
    return true
    }
    },
    // passa o faturamento total da sessão para o filme depois que ela acontece e muda o status dela para 2 (ja aconteceu)
    async attFaturamentos(){
        const Sessions = require( './src/models/sessions');
        const sessions= await Sessions.findAll()
        if(sessions.length!==0){
            for(c=0;c<sessions.length;c++){
                var data=sessions[c].data
                var hora=sessions[c].horario
                if(this.confereRealizado(hora, data)==true && sessions[c].status!==2){
                    const Movies = require( './src/models/movies');
                    const movie= await Movies.findByPk(sessions[c].movie_id)
                    var newFaturamento=parseFloat(movie.faturamento)+parseFloat(sessions[c].faturamento)
                    newFaturamento=newFaturamento.toFixed(2)
                    movie.update({faturamento:newFaturamento})
                    sessions[c].update({status:2})

                }
                
            }
            
        }else{
            return true
        }
    },
    // criar os registros de preço e o usuário adm 
    async start(){
        const Prices = require( './src/models/prices');
        const prices= await Prices.findAll()
        if(prices.length==0){
            await Prices.create({preco2d:"10",preco3d:"20" })
        }
        const Users = require( './src/models/users');
        const users= await Users.findAll()  
        if(users.length==0){
            await Users.create({nome: "Admin",email: "admin@admin.com", password: "8e3d44d855f3fff31a57229bcd76ff2e",nivel: 1,faturamento: 0})
            // senha:Administrador2020
        } 
        
    },
    // formata a data para BR
    formataData(x){
        data=new Date(x)
        data=new Date(data.getTime() + (1 * 24 * 60 * 60 * 1000))
        return(data.toLocaleString('pt-BR',{day:'numeric' , month:'numeric' , year:'numeric' }))
    }
  }