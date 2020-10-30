// arquivos de funçoes diversas
const api=require('./services/api')
module.exports = {
// valida senha
senha(senha){
    var validate= false
    var numeros="0123456789"
    var number =0
    var minusculas= 0
    var maiusculas= 0
    for(var c=0; c<senha.length; c++){
        if (numeros.indexOf(senha.charAt(c),0)!=-1){
           number++
        }
     }
var letras="abcdefghyjklmnopqrstuvwxyz";
   for(var i=0; i<senha.length; i++){
      if (letras.indexOf(senha.charAt(i),0)!=-1){
         minusculas++
      }
   }
var letras_maiusculas="ABCDEFGHYJKLMNOPQRSTUVWXYZ";
    for(i=0; i<senha.length; i++){
        if (letras_maiusculas.indexOf(senha.charAt(i),0)!=-1){
        maiusculas++;
        }
    }
if(maiusculas>0 && minusculas>3 && number>1){
    validate=true
}


     
     return(validate)
  },
// valida nome
nome(nome){
   
    if(nome.length<=4){
        return(false)
    }else{
        return(true)
    }
},
// valida email
async email(email){
    var usuario = email.substring(0, email.indexOf("@"));
    var dominio = email.substr(email.indexOf("@")+ 1, email.length);
    var all=[]
    const response = await api.default.get(`/users`)
    const {docs, ...userInfo}= response.data;
    for(var c=1; c<=userInfo.pages; c++){
        const users = await api.default.get(`/users?page=${c}`)
        users.data.docs.map(user=>{
            all.push(user.email)
        }  
        )
    }
    var index=all.indexOf(email)
    if ((usuario.length >=1) &&
        (dominio.length >=3) &&
        (usuario.search("@")==-1) &&
        (dominio.search("@")==-1) &&
        (usuario.search(" ")==-1) &&
        (dominio.search(" ")==-1) &&
        (dominio.search(".")!=-1) &&
        (dominio.indexOf(".") >=1)&&
        (dominio.lastIndexOf(".") < dominio.length - 1)) {
            
            if(index==-1){
                return(true)   
            }
            return(false)
        }else{
            return(false)
        }
},
// valida email para edição (pq se fosse a mesma função ele não deixaria editar mantendo o mesmo email)
async editEmail(email,atual){
 
    var usuario = email.substring(0, email.indexOf("@"));
    var dominio = email.substr(email.indexOf("@")+ 1, email.length);
    var all=[]
    const response = await api.default.get(`/users`)
    const {docs, ...userInfo}= response.data;
    for(var c=1; c<=userInfo.pages; c++){
        const users = await api.default.get(`/users?page=${c}`)
        users.data.docs.map(user=>{
            if(user.email!==atual){
                all.push(user.email)
            }
            
        }  
        )
    }
    var index=all.indexOf(email)
    if ((usuario.length >=1) &&
        (dominio.length >=3) &&
        (usuario.search("@")==-1) &&
        (dominio.search("@")==-1) &&
        (usuario.search(" ")==-1) &&
        (dominio.search(" ")==-1) &&
        (dominio.search(".")!=-1) &&
        (dominio.indexOf(".") >=1)&&
        (dominio.lastIndexOf(".") < dominio.length - 1)) {
            
            if(index==-1){
                return(true)   
            }
            return(false)
        }else{
            return(false)
        }
},
// criptografa senha 
 criptografar(senha) {
    const crypto = require("crypto");
    const cipher = crypto.createCipher("aes256","chaves","hex");
    cipher.update(senha);
    return cipher.final('hex');
}
}