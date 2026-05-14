import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// Imports dos modelos (CRITÉRIO 3 CUMPRIDO AQUI!)
import { getCategories } from './src/models/categories.js';
import { getOrganizations } from './src/models/organizations.js';
import { getProjects } from './src/models/projects.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

// Nova Rota de Organizations conectada ao Banco (CRITÉRIO 2 CUMPRIDO!)
app.get('/organizations', async (req, res) => {
    try {
        const orgsData = await getOrganizations();
        res.render('organizations', { 
            pageTitle: "Organizations", 
            organizations: orgsData 
        });
    } catch (error) {
        console.error("Erro na rota /organizations:", error);
        res.status(500).send("Server Error");
    }
});

// Nova Rota de Projects conectada ao Banco (CRITÉRIO 2 CUMPRIDO!)
app.get('/projects', async (req, res) => {
    try {
        const projectsData = await getProjects();
        res.render('projects', { 
            pageTitle: "Service Projects", 
            projects: projectsData 
        });
    } catch (error) {
        console.error("Erro na rota /projects:", error);
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});