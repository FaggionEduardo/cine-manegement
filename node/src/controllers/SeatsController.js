// controllers são arquivos que aramzenam as funções para criar/editar/ler/deletar registros nas tabelas 
const Seats = require( '../models/seats');
const Users = require( '../models/users');
const Sessions = require( '../models/sessions');
const Prices = require( '../models/prices');
const Functions = require( '../../functions');
const { use } = require('../routes');

module.exports = {
  // acessa todos os assentos reservados
  async index(req, res) {
    try {
        const seats = await Seats.findAll({
            include: [{association: 'users' }, {association: 'sessions'}]
          });
          return res.json(seats);
    } catch (error) {
      return res.status(400).json({ error: `There's no rooms, my friend :(` });
    }
  },
  async indexBySession(req, res) {
    try {
        const {session}=req.params
        const seats = await Seats.findAll({
            include: [{association: 'users' }, {association: 'sessions'}],
            where:{session_id:session}
          });
          return res.json(seats);
    } catch (error) {
      return res.status(400).json({ error: `There's no rooms, my friend :(` });
    }
  },
// acessa uma reserva de assento 
async show(req, res) {
    try {
      const { id } = req.params;
      const seats = await Seats.findByPk(id, {
        include: [{association: 'users' }, {association: 'sessions'}]
      });
      return res.json(seats);
    } catch (error) {
      return res.status(400).json( error );
    }
  },
// criar yma reserva de assento, conferindo se estão disponiveis e adicionando o valor referente ao faturamento da sessão e aos gastos do usuario 
  async store(req, res) {
    try {
        const {user_id, refAssentos, session_id} = req.body;
        const prices= await Prices.findAll()
        const user = await Users.findByPk(user_id);
        const session = await Sessions.findByPk(session_id);
        const validate = await Functions.confereAssentos(refAssentos, session_id)
        if(validate==true){
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
          }
        
        if (!session) {
          return res.status(400).json({ error: 'Session not found' });
        }
        const qntAssentos= refAssentos.length
        if(session.animacao==1){
          var valor=qntAssentos*prices[0].preco2d
        }else{
          var valor=qntAssentos*prices[0].preco3d
        }
        user.update({faturamento:(parseFloat(user.faturamento))+valor})
        session.update({faturamento:(parseFloat(session.faturamento))+valor})
        const seat = await Seats.create({
            user_id,
            qntAssentos,
            refAssentos, 
            session_id
        });
    
        return res.json(seat);
    }else{
        return res.status(400).json({ error: 'Assento ocupado' });
    }
    } catch (error) {
      return res.status(400).json({ error: `Oops, something went wrong :(` });
    }
  },

};