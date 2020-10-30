// controllers são arquivos que aramzenam as funções para criar/editar/ler/deletar registros nas tabelas 
const Prices = require('../models/prices')

module.exports = {
  // pega os precos 
  async index(req, res) {
    try {
      const prices = await Prices.findAll();
      return res.json(prices);
    } catch (error) {
      return res.status(400).json({ error: `There's no prices, my friend :(` });
    }
  },
// edita os precos (não usada)
  async update(req, res) {
    try {
      const {id} = req.params
      const prices = await Prices.findByPk(id);
      prices.update(req.body);
      return res.json(prices);
    } catch (error) {
      return res.status(400).json({ error: `Oops, something went wrong :(` });
    }
  },

};