// arquivo index da src inicia o servidor
const express = require('express');
const routes = require('./routes.js');
const cors = require("cors")
const Functions = require ('../functions.js')
require('../database')
// a cada 1min executa a função attFaturamnetos do arquivo functions 
setInterval(function(){
    Functions.attFaturamentos()
},60000)
// executa a função start
Functions.start()
// configura o app
const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
// define a porta que o server vai rodar
app.listen(3333);