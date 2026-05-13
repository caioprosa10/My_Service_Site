import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCategories } from './models/categories.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// '../' sai da pasta src para achar a public e views
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get('/', async (req, res) => {
    try {
        res.render('home', { pageTitle: "Home" });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

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

// Outras rotas (Organizations, Projects) seguem o mesmo padrão...

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});