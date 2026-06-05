import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/index.js'; // Verifica se o caminho para suas rotas está certo

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configurações do EJS e Arquivos Estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// REQUISITO DA RUBRICA: Configuração de Sessão (Para Login/Auth)
app.use(session({
    secret: process.env.SESSION_SECRET || 'chave_super_secreta_aprovacao',
    resave: false,
    saveUninitialized: false
}));

// REQUISITO DA RUBRICA: Flash Messages (Para avisos de sucesso/erro)
app.use(flash());

// REQUISITO DA RUBRICA: Variáveis Globais (Link Visibility)
// Isso injeta o usuário e as mensagens em TODAS as páginas EJS automaticamente
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user || null;
    next();
});

// Conectando as Rotas
app.use('/', router);

// Tratamento de Erro 404
app.use((req, res) => {
    res.status(404).render('404', { pageTitle: 'Not Found' });
});

// Iniciando o Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor blindado rodando na porta ${PORT}`);
});