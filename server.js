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

// --- CONFIGURAÇÃO DE SESSÃO E FLASH MESSAGES ---
app.use(session({
    secret: 'cse340_secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Middleware: Repassa as mensagens de sucesso/erro e o USUÁRIO para todas as telas (views)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    
    // A MÁGICA DA W05 ESTÁ AQUI: Isso diz ao EJS se o usuário está logado!
    res.locals.user = req.session.user || null; 
    next();
});
// --------------------------------------------------------------------------

// Conecta todas as rotas
app.use('/', router);

// --- PORTA E INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;