import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCategories } from './src/models/categories.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Aponta diretamente para as pastas na raiz do projeto
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rota Home
app.get('/', async (req, res) => {
    try {
        res.render('home', { pageTitle: "Home" });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// Rota Categories
app.get('/categories', async (req, res) => {
    try {
        const categoriesData = await getCategories(); 
        res.render('categories', { 
            pageTitle: "Service Project Categories", 
            categories: categoriesData 
        });
    } catch (error) {
        console.error("Erro na rota /categories:", error);
        res.status(500).send("Server Error");
    }
});

// --- NOVAS ROTAS ADICIONADAS ---

// Rota Organizations
app.get('/organizations', (req, res) => {
    try {
        // Se no futuro você for buscar do banco, a lógica entra aqui (igual fizemos em categories)
        res.render('organizations', { pageTitle: "Organizations" });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// Rota Projects
app.get('/projects', (req, res) => {
    try {
        // Se no futuro você for buscar do banco, a lógica entra aqui
        res.render('projects', { pageTitle: "Service Projects" });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});