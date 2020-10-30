# cine-management

Projeto desenvolvido com Node.js e React.js usando banco de dados MySQL.

Primeiramente é necessário realizar a instalação do Node e do MySQL em sua maquina.

Crie um data base chamado 'cine' no MySQL.

Se o seu MySQL está com uma configuração diferente da padrão (username:root, password:root, host:127.0.0.1 ou localhost) configure a conexão com o Banco de Dados no arquivo database.js no caminho cine-management-master\node\config\.

Para iniciar o Node abra seu prompt de comando de preferencia e navegue até o diretório do projeto.

Na pasta node do projeto execute os seguintes comandos:

npm init -y

npm install express

npx sequelize db:migrate (este comando vai criar as tabelas do MySQL)

npm install nodemon -D

npm run dev (com este comando servidor deve iniciar, já criando alguns registros no banco de dados, como o valor dos ingressos pré setados para teste e um usuário do tipo gerente que será capaz de criar outros usuários desse tipo.)

Com o node já rodando, está na hora de iniciar o react. Novamente abra o prompt de comando e vá para o diretório do projeto.

Crie uma pasta chamada "images" dentro da pasta src.

Entre na pasta react e execute os seguintes comandos:

npm init -y

npm install (sim, demora)

npm start

E pronto! Com os dois rodando o sistema deve funcionar na porta 3000 do seu localhost.

Login e senha da conta gerente:

Email: admin@admin.com

Senha: Administrador2020
