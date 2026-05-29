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
    assignCategoriesToProject,
    buildNewProject,
    createProject,
    buildEditProject,
    updateExistingProject
} from '../controllers/projectController.js';
import { 
    buildOrganizationsPage, 
    buildOrganizationDetails,
    buildNewOrganization,
    createOrganization,
    buildEditOrganization,
    updateExistingOrganization
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

// --- ROTAS DE ORGANIZAÇÕES ---
router.get('/organizations', buildOrganizationsPage);
router.get('/new-organization', buildNewOrganization);
router.post('/new-organization', createOrganization);
router.get('/edit-organization/:id', buildEditOrganization);
router.post('/edit-organization/:id', updateExistingOrganization);
router.get('/organization/:id', buildOrganizationDetails);

// --- ROTAS DE PROJETOS ---
router.get('/projects', buildProjectsPage);
router.get('/new-project', buildNewProject);
router.post('/new-project', createProject);
router.get('/edit-project/:id', buildEditProject);
router.post('/edit-project/:id', updateExistingProject);
router.get('/project/:id/assign-categories', buildAssignCategories);
router.post('/project/:id/assign-categories', assignCategoriesToProject);
router.get('/project/:id', buildProjectDetails);

export default router;