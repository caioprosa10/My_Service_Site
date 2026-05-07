import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração para ESM (já que __dirname não existe nativamente no ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para arquivos estáticos (CSS e Imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas (usando async/await e arrow functions, conforme o requisito)
app.get('/', async (req, res) => {
    try {
        const pageTitle = "Home";
        res.render('home', { pageTitle });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

app.get('/organizations', async (req, res) => {
    try {
        const pageTitle = "Organizations";
        res.render('organizations', { pageTitle });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

app.get('/projects', async (req, res) => {
    try {
        const pageTitle = "Service Projects";
        res.render('projects', { pageTitle });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

app.get('/categories', async (req, res) => {
    try {
        const pageTitle = "Service Project Categories";
        res.render('categories', { pageTitle });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});