const Notifications = require('../models/notifications')

module.exports = {
// pega todas as notificações do usuario da id passada que ainda não foram marcadas como lida 
  async index(req, res) {
    try {
      const{id}=req.params
      const notifications = await Notifications.findAll({
        where:{user_id:id, status:1}
      }
      );
      
      return res.json(notifications);
    } catch (error) {
      return res.status(400).json({ error: `There's no users, my friend :(` });
    }
  },

  // edita notificação (marca como lida) 
  async update(req, res) {
    try {
      const {id}=req.params
      const notifications = await Notifications.findByPk(id);
      notifications.update(req.body);
      return res.json(notifications);
    } catch (error) {
      return res.status(400).json({ error: `Oops, something went wrong :(` });
    }
  },

};