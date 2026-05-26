import express from 'express';
import { 
    buildCategoriesPage, 
    buildCategoryDetails, 
    buildNewCategory, 
    createCategory, 
    buildEditCategory, 
    updateExistingCategory 
} from '../controllers/categoryController.js';
import { 
    buildProjectsPage, 
    buildProjectDetails, 
    buildAssignCategories, 
    assignCategoriesToProject 
} from '../controllers/projectController.js';
import { 
    buildOrganizationsPage, 
    buildOrganizationDetails 
} from '../controllers/organizationController.js';

const router = express.Router();

// --- ROTAS DA HOME ---
router.get('/', (req, res) => res.render('home', { pageTitle: "Home" }));

// --- ROTAS DE CATEGORIAS ---
router.get('/categories', buildCategoriesPage);
router.get('/new-category', buildNewCategory);
router.post('/new-category', createCategory);
router.get('/edit-category/:id', buildEditCategory);
router.post('/edit-category/:id', updateExistingCategory);
router.get('/category/:id', buildCategoryDetails);

// --- ROTAS DE PROJETOS ---
router.get('/projects', buildProjectsPage);
router.get('/project/:id/assign-categories', buildAssignCategories);
router.post('/project/:id/assign-categories', assignCategoriesToProject);
router.get('/project/:id', buildProjectDetails);

// --- ROTAS DE ORGANIZAÇÕES ---
router.get('/organizations', buildOrganizationsPage);
router.get('/organization/:id', buildOrganizationDetails);

export default router;