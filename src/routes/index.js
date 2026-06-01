import express from 'express';
import { body } from 'express-validator';
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

// --- CONFIGURAÇÃO DOS MIDDLEWARES DE VALIDAÇÃO (Critério 4) ---
const categoryValidation = [
    body('category_name').trim().isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters.')
];

const orgValidation = [
    body('organization_name').trim().isLength({ min: 3, max: 100 }).withMessage('Organization name must be between 3 and 100 characters.'),
    body('organization_description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long.'),
    body('organization_image').trim().notEmpty().withMessage('Organization image filename or URL is required.')
];

const projectValidation = [
    body('project_name').trim().isLength({ min: 3, max: 100 }).withMessage('Project name must be between 3 and 100 characters.'),
    body('project_description').trim().isLength({ min: 10 }).withMessage('Project description must be at least 10 characters long.'),
    body('organization_id').notEmpty().withMessage('Please select a valid partner organization.')
];

// --- ROTAS DA HOME ---
router.get('/', (req, res) => res.render('home', { pageTitle: "Home" }));

// --- ROTAS DE CATEGORIAS (Critérios 1 e 2) ---
router.get('/categories', buildCategoriesPage);
router.get('/new-category', buildNewCategory);
router.post('/new-category', categoryValidation, createCategory);
router.get('/edit-category/:id', buildEditCategory);
router.post('/edit-category/:id', categoryValidation, updateExistingCategory);
router.get('/category/:id', buildCategoryDetails);

// --- ROTAS DE ORGANIZAÇÕES (Critérios 1 e 2) ---
router.get('/organizations', buildOrganizationsPage);
router.get('/new-organization', buildNewOrganization);
router.post('/new-organization', orgValidation, createOrganization);
router.get('/edit-organization/:id', buildEditOrganization);
router.post('/edit-organization/:id', orgValidation, updateExistingOrganization);
router.get('/organization/:id', buildOrganizationDetails);

// --- ROTAS DE PROJETOS (Critério 3) ---
router.get('/projects', buildProjectsPage);
router.get('/new-project', buildNewProject);
router.post('/new-project', projectValidation, createProject);
router.get('/edit-project/:id', buildEditProject);
router.post('/edit-project/:id', projectValidation, updateExistingProject);
router.get('/project/:id/assign-categories', buildAssignCategories);
router.post('/project/:id/assign-categories', assignCategoriesToProject);
router.get('/project/:id', buildProjectDetails);

export default router;