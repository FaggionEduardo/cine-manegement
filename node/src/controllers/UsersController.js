// controllers são arquivos que aramzenam as funções para criar/editar/ler/deletar registros nas tabelas 
const Users = require('../models/users')
const Functions = require( '../../functions');
const sequelize =require('sequelize')
module.exports = {
  // acessa todos os usuarios e retorna paginado
  async index(req, res) {
    try {
      const { page=1 }= req.query;
      const options = {
        page, // Default 1
        paginate: 10, // Default 25
        
      }
      const users = await Users.paginate(options);
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: `There's no users, my friend :(` });
    }
  },
  async allIndex(req, res) {
    try {
      
      const users = await Users.findAll();
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: `There's no users, my friend :(` });
    }
  },
  // acessa todos os usuário em ordem de faturamento e paginados
  async relIndex(req, res) {
    try {
      const { page=1 }= req.query;
      const options = {
        order: sequelize.literal('faturamento DESC'),
        page, // Default 1
        paginate: 10, // Default 25
        
        
      }
      const users = await Users.paginate(options);
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: `There's no users, my friend :(` });
    }
  },
// acessa apenas um usuário
async show(req, res) {
    try {
      const { id } = req.params;
      const users = await Users.findByPk(id);
      return res.json(users);
    } catch (error) {
      return res.status(400).json( error );
    }
  },
  // pesquisa usuario por texto passado
  async search(req, res) {
    try {
      const { nome } = req.params;
      const users= await Users.findAll()
      var finalUsers=[]
      for(c=0; c<users.length;c++){
        
        if(Functions.simplify(users[c].nome).startsWith(Functions.simplify(nome))){
          finalUsers.push(users[c].id)
        }
      }
      const { page=1 }= req.query;
      const options = {
        page, // Default 1
        paginate: 10, // Default 25
        where: {id:finalUsers}
      }
      
      const users2= await Users.paginate(options)
      return res.json(users2);
    } catch (error) {
      return res.status(400).json( error );
    }
  },
//  cria um usuario 
  async store(req, res) {
    try {
      req.body.faturamento= '0.00'
    const users = await Users.create(req.body);
    
   
    res.json(users);
    } catch (error) {
      return res.status(400).json({ error: `Oops, something went wrong :(` });
    }
  },
// edita um usuario 
  async update(req, res) {
    try {
      const { id } = req.params;
      const users = await Users.findByPk(id);
      users.update(req.body);
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: `Oops, something went wrong :(` });
    }
  },
// deleta um usuario 
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const users = await Users.findByPk(id);
      const { nome } = users;
      users.destroy();

      return res.json({ success: `${nome} does not exist anymore :)` });
    } catch (error) {
      return res.status(400).json({ error: `Oops, user not found, my friend :(` });
    }
  },
};