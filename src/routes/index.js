import express from 'express';
import { buildCategoriesPage, buildCategoryDetails } from '../controllers/categoryController.js';
import { buildProjectsPage, buildProjectDetails } from '../controllers/projectController.js';

const router = express.Router();

// Rotas da Home
router.get('/', (req, res) => res.render('home', { pageTitle: "Home" }));

// Rotas de Categorias
router.get('/categories', buildCategoriesPage);
router.get('/category/:id', buildCategoryDetails);

// Rotas de Projetos
router.get('/projects', buildProjectsPage);
router.get('/project/:id', buildProjectDetails);

export default router;
// Adicione isto junto com os outros imports no topo:
import { buildOrganizationsPage, buildOrganizationDetails } from '../controllers/organizationController.js';

// Adicione isto junto com as suas outras rotas:
router.get('/organizations', buildOrganizationsPage);
router.get('/organization/:id', buildOrganizationDetails);