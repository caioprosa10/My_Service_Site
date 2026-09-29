import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import 'dotenv/config';
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

// --- CONFIGURAÇÃO DE SESSÃO E FLASH MESSAGES (Obrigatório para a nota) ---
app.use(session({
    // Segredo vem da variável de ambiente SESSION_SECRET; sem ela, gera um aleatório a cada início.
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Middleware: Repassa as mensagens de sucesso/erro para todas as telas (views)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});
// --------------------------------------------------------------------------

// Conecta todas as rotas
app.use('/', router);

export default app;
