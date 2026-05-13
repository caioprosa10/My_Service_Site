import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// IMPORTANTE: Importando a função que busca as categorias no banco de dados
import { getCategories } from './src/models/categories.js';

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

// ROTA ATUALIZADA: Agora busca os dados dinâmicos do banco
app.get('/categories', async (req, res) => {
    try {
        const pageTitle = "Service Project Categories";
        const categoriesData = await getCategories(); // Puxa do banco
        
        // Envia as categorias para a tela EJS
        res.render('categories', { pageTitle, categories: categoriesData });
    } catch (error) {
        console.error("Erro na rota /categories:", error);
        res.status(500).send("Server Error");
    }
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});