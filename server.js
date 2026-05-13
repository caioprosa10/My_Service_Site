import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// AJUSTE: Como o server.js já está na src, o caminho é direto para models
import { getCategories } from './models/categories.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AJUSTE: Usamos '../' para sair da pasta src e achar a public e views na raiz
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

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
        const categoriesData = await getCategories(); 
        res.render('categories', { pageTitle, categories: categoriesData });
    } catch (error) {
        console.error("Erro na rota /categories:", error);
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});