import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import router from './src/routes/index.js';

const app = express();

// Configura o EJS como motor de visualização (View Engine)
app.set('view engine', 'ejs');

// Ativa a pasta pública para o CSS e Imagens funcionarem
app.use(express.static('public'));

// Processa dados de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de Sessão e Flash Messages (Obrigatório para a rubrica)
app.use(session({
    secret: 'cse340_secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Variáveis globais para as views acessarem as mensagens
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Conecta todas as rotas
app.use('/', router);

export default app;