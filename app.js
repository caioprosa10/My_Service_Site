import express from 'express';
import router from './src/routes/index.js';

const app = express();

// Configura o EJS como motor de visualização (View Engine)
app.set('view engine', 'ejs');

// Ativa a pasta pública para o CSS e Imagens funcionarem
app.use(express.static('public'));

// Processa dados de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conecta todas as rotas
app.use('/', router);

// ESTA É A LINHA QUE ESTAVA FALTANDO/DANDO ERRO:
export default app;