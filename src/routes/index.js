import express from 'express';
import { body } from 'express-validator';
import { buildCategoriesPage, buildCategoryDetails, buildNewCategory, createCategory, buildEditCategory, updateExistingCategory } from '../controllers/categoryController.js';
import { buildProjectsPage, buildProjectDetails, buildAssignCategories, assignCategoriesToProject, buildNewProject, createProject, buildEditProject, updateExistingProject, volunteerForProject, unvolunteerFromProject } from '../controllers/projectController.js';
import { buildOrganizationsPage, buildOrganizationDetails, buildNewOrganization, createOrganization, buildEditOrganization, updateExistingOrganization } from '../controllers/organizationController.js';
import { buildRegister, registerUser, buildLogin, loginUser, logoutUser, buildDashboard, buildUsersPage } from '../controllers/userController.js';

import { requireLogin, requireRole } from '../middleware/auth.js';
import pool from '../db.js'; // Importante para a rota de correção do banco funcionar

const router = express.Router();

const categoryValidation = [ body('category_name').trim().isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters.') ];
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

// --- ROTAS PÚBLICAS ---
router.get('/', (req, res) => res.render('home', { pageTitle: "Home" }));
router.get('/categories', buildCategoriesPage);
router.get('/category/:id', buildCategoryDetails);
router.get('/organizations', buildOrganizationsPage);
router.get('/organization/:id', buildOrganizationDetails);
router.get('/projects', buildProjectsPage);
router.get('/project/:id', buildProjectDetails);

// --- AUTENTICAÇÃO E DASHBOARD ---
router.get('/register', buildRegister);
router.post('/register', registerUser);
router.get('/login', buildLogin);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/dashboard', requireLogin, buildDashboard);
router.get('/users', requireLogin, requireRole('admin'), buildUsersPage);

// --- VOLUNTARIADO (REQUER LOGIN) ---
router.post('/project/:id/volunteer', requireLogin, volunteerForProject);
router.post('/project/:id/unvolunteer', requireLogin, unvolunteerFromProject);

// --- PROTEGIDAS: ADMINS ---
// Categorias
router.get('/new-category', requireLogin, requireRole('admin'), buildNewCategory);
router.post('/new-category', requireLogin, requireRole('admin'), categoryValidation, createCategory);
router.get('/edit-category/:id', requireLogin, requireRole('admin'), buildEditCategory);
router.post('/edit-category/:id', requireLogin, requireRole('admin'), categoryValidation, updateExistingCategory);

// Organizações
router.get('/new-organization', requireLogin, requireRole('admin'), buildNewOrganization);
router.post('/new-organization', requireLogin, requireRole('admin'), orgValidation, createOrganization);
router.get('/edit-organization/:id', requireLogin, requireRole('admin'), buildEditOrganization);
router.post('/edit-organization/:id', requireLogin, requireRole('admin'), orgValidation, updateExistingOrganization);

// Projetos
router.get('/new-project', requireLogin, requireRole('admin'), buildNewProject);
router.post('/new-project', requireLogin, requireRole('admin'), projectValidation, createProject);
router.get('/edit-project/:id', requireLogin, requireRole('admin'), buildEditProject);
router.post('/edit-project/:id', requireLogin, requireRole('admin'), projectValidation, updateExistingProject);
router.get('/project/:id/assign-categories', requireLogin, requireRole('admin'), buildAssignCategories);
router.post('/project/:id/assign-categories', requireLogin, requireRole('admin'), assignCategoriesToProject);

// --- ROTA DE EMERGÊNCIA BASEADA EM SESSÃO ---
router.get('/make-me-admin', (req, res) => {
    if (req.session && req.session.user) {
        req.session.user.user_role = 'admin'; 
        res.send('MÁGICA FEITA! Você agora é um Admin. Pode voltar para o site e atualizar a página.');
    } else {
        res.send('Erro: Faça o login normal no site primeiro.');
    }
});

// --- RETA FINAL: ROTA PARA ADICIONAR A COLUNA FALTANTE NO BANCO ---
router.get('/fix-db-columns', async (req, res) => {
    try {
        // Esse comando adiciona a coluna organization_image na tabela se ela não existir
        const sql = `
            ALTER TABLE organizations 
            ADD COLUMN IF NOT EXISTS organization_image VARCHAR(255);
        `;
        await pool.query(sql);
        res.send('SUCESSO TOTAL! A coluna organization_image foi criada no banco de dados. Pode voltar e testar a edição das imagens!');
    } catch (error) {
        res.send('Erro ao atualizar o banco: ' + error.message);
    }
});

export default router;