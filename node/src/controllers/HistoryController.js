// controllers são arquivos que aramzenam as funções para criar/editar/ler/deletar registros nas tabelas 
const Sessions = require( '../models/sessions');
const Rooms = require( '../models/rooms');
const Movies = require( '../models/movies');
const Functions = require( '../../functions');
const Seats = require('../models/seats');
const sequelize=require('sequelize')
module.exports = {
  //exibe histórico do usuario passado
  async index(req, res) {
    try {
      const {id}=req.params
      const { page=1 }= req.query;
      var options = {
        include:{association: 'sessions'},
        where:{user_id:id}
      }
      
        const seats = await Seats.findAll(options);
        if(!seats){
          return res.status(400).json({ error: `There's no sessions, my friend :(` });
        }
        var sessions_id=[]
        
        for(c=0;c<seats.length;c++){
            if(seats[c].sessions.status==2){
                if(sessions_id.indexOf(seats[c].session_id)==-1)
                sessions_id.push(seats[c].session_id)
            }
        }
        
        if(sessions_id.length==0){
            return res.status(400).json({ error: `Não há histórico de sessões vinculadas a essa conta.` });
        }
         options = {
            page, // Default 1
            paginate: 10, // Default 25
            include: [{association: 'movies' }, {association: 'rooms'}],
            where:{id:sessions_id},
            order: sequelize.literal('data DESC'),
            
          }
          
            const sessions = await Sessions.paginate(options);
            
            
            if(!sessions){
              return res.status(400).json({ error: `There's no sessions, my friend :(` });
            }
        
            return res.json(sessions);
        
    } catch (error) {
      return res.status(400).json({ error: `There's no sessions, my friend :(` });
    }
  },
//  pesquisa no historico pelo texto passado
  async search(req, res) {
    try {
        const {id, text}=req.params
        
        var options = {
          include:{association: 'sessions'},
          where:{user_id:id}
        }
        
          const seats = await Seats.findAll(options);
          if(!seats){
            return res.status(400).json({ error: `There's no sessions, my friend :(` });
          }
          var sessions_id=[]
          
          for(c=0;c<seats.length;c++){
              if(seats[c].sessions.status==2){
                  if(sessions_id.indexOf(seats[c].session_id)==-1)
                  sessions_id.push(seats[c].session_id)
              }
          }
          
          if(sessions_id.length==0){
              return res.status(400).json({ error: `Não há histórico de sessões vinculadas a essa conta.` });
          }
           options = {
              include: [{association: 'movies' }, {association: 'rooms'}],
              where:{id:sessions_id},
              order: sequelize.literal('data DESC'),
              
            }
            
              const sessions = await Sessions.findAll(options);
              
              
      var finalSessions=[]
      for(c=0; c<sessions.length;c++){
        console.log(Functions.formataData(sessions[c].data))
        if((Functions.simplify(sessions[c].movies.titulo).startsWith(Functions.simplify(text)))|| Functions.simplify(sessions[c].rooms.nome).startsWith(Functions.simplify(text))|| Functions.formataData(sessions[c].data).startsWith(text)){
          finalSessions.push(sessions[c].id)
        }
      }
      const { page=1 }= req.query;
       options = {
        page, // Default 1
        paginate: 10, // Default 25
        where: {id:finalSessions},
        include: [{association: 'movies' }, {association: 'rooms'}]
      }
      
      const sessions2= await Sessions.paginate(options)
      return res.json(sessions2);
    } catch (error) {
      return res.status(400).json( error );
    }
  },
};