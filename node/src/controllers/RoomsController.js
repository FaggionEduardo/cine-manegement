// controllers são arquivos que aramzenam as funções para criar/editar/ler/deletar registros nas tabelas 
const Rooms = require( '../models/rooms');
const Sessions = require( '../models/sessions');
const Functions = require( '../../functions');
module.exports = {
  // acessa todas as salas e retorna com paginação
  async index(req, res) {
    try {
      const { page=1 }= req.query;
      const options = {
        page, // Default 1
        paginate: 10, // Default 25
        
      }
      const rooms = await Rooms.paginate(options);
      
      return res.json(rooms);
    } catch (error) {
      return res.status(400).json({ error: `There's no rooms, my friend :(` });
    }
  },
  // acessa todas as salas sem paginação 
  async indexAll(req, res) {
    try {
      
      const rooms = await Rooms.findAll();
      
      return res.json(rooms);
    } catch (error) {
      return res.status(400).json({ error: `There's no rooms, my friend :(` });
    }
  },
// acessa apenas uma sala
async show(req, res) {
    try {
      const { id } = req.params;
      const rooms = await Rooms.findByPk(id);
      return res.json(rooms);
    } catch (error) {
      return res.status(400).json( error );
    }
  },
// cria uma sala 
  async store(req, res) {
    try {
    const rooms = await Rooms.create(req.body);
    res.json(rooms);
    } catch (error) {
      return res.status(400).json({ error: `Erro, o nome da sala já está cadastrado ou o numero de assentos não é adequado (20-100)` });
    }
  },
// edita a uam sala passada pelo id (não permite editar o nome para um nome ja existente)
  async update(req, res) {
    try {
      const { id } = req.params;
      const rooms= await Rooms.findAll()
      const rooms2 = await Rooms.findByPk(id);
      for(c=0; c<rooms.length;c++){
        
        if(Functions.simplify(rooms[c].nome).indexOf(Functions.simplify(req.body.nome))!==-1 && Functions.simplify(req.body.nome)!==Functions.simplify(rooms2.nome) ){
          return res.status(400).json({ error:'Este nome de sala já está cadastrado'} );
        }
      }
      
      rooms2.update(req.body);
      return res.json(rooms2);
    } catch (error) {
      return res.status(400).json({ error: `Erro, o nome da sala já está cadastrado ou o numero de assentos não é adequado (20-100)` });
    }
  },
  // pesquisa sala por texto passado
  async search(req, res) {
    try {
      const { nome } = req.params;
      const rooms= await Rooms.findAll()
      var finalRooms=[]
      for(c=0; c<rooms.length;c++){
        
        if(Functions.simplify(rooms[c].nome).startsWith(Functions.simplify(nome))){
          finalRooms.push(rooms[c].id)
        }
      }
      const { page=1 }= req.query;
      const options = {
        page, // Default 1
        paginate: 10, // Default 25
        where: {id:finalRooms}
      }
      
      const rooms2= await Rooms.paginate(options)
      return res.json(rooms2);
    } catch (error) {
      return res.status(400).json( error );
    }
  },

 

// deleta sala se não há sessoes futuras vinculadas a ela 
  async delete(req, res) {
    try {
      const { id } = req.params;

      const rooms = await Rooms.findByPk(id);
      if(!rooms){
        return res.status(400).json({ error: `Essa sala não existe` });
      }
      const roomSession= await Sessions.findAll({where: {
        room_id: id
    }})
    if(roomSession!==0){
      for(c=0;c<roomSession.length;c++){
        const validate=Functions.confereRealizado(roomSession[c].horarioFinal, roomSession[c].data)
        if(validate==false){
          return res.status(400).json({ error: 'Essa sala não pode ser deletada pois há sessões futuras vinculadas a ela' });
        }
      }
      const { nome } = rooms;
      rooms.destroy();
      return res.json({ success: `${nome} does not exist anymore :))))` });
      
    }else{
      const { nome } = rooms;
      rooms.destroy();
      return res.json({ success: `${nome} does not exist anymore :)` });
    }
     
    } catch (error) {
      return res.status(400).json({ error: `Oops, room not found, my friend :(` });
    }
  },
};
