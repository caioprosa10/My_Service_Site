import { getProjects, getProjectById, insertProject, updateProject, deleteProjectCategories, insertProjectCategory, getProjectCategories } from '../models/projects.js';
import { getOrganizations } from '../models/organizations.js';
import { getCategories } from '../models/categories.js';
import { validationResult } from 'express-validator';

export const buildProjectsPage = async (req, res) => {
    try {
        const projects = await getProjects();
        res.render('projects', { pageTitle: "Service Learning Projects", projects });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const buildProjectDetails = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        if (!project) return res.status(404).render('404', { pageTitle: "Not Found" });
        
        const assignedCategories = await getProjectCategories(projectId);
        res.render('project', { pageTitle: project.project_name, project, categories: assignedCategories });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const buildNewProject = async (req, res) => {
    try {
        const orgs = await getOrganizations();
        res.render('new-project', { pageTitle: "Create New Project", organizations: orgs, error_msg: null });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const createProject = async (req, res) => {
    const errors = validationResult(req);
    const { project_name, project_description, organization_id } = req.body;
    if (!errors.isEmpty()) {
        const orgs = await getOrganizations();
        return res.status(400).render('new-project', { pageTitle: "Create New Project", organizations: orgs, error_msg: errors.array()[0].msg, project_name, project_description, organization_id });
    }
    try {
        await insertProject(project_name.trim(), project_description.trim(), organization_id);
        res.redirect('/projects');
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const buildEditProject = async (req, res) => {
    try {
        const project = await getProjectById(req.params.id);
        const orgs = await getOrganizations();
        res.render('edit-project', { pageTitle: "Edit Project", project, organizations: orgs, error_msg: null });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const updateExistingProject = async (req, res) => {
    const errors = validationResult(req);
    const { project_name, project_description, organization_id } = req.body;
    if (!errors.isEmpty()) {
        return res.status(400).render('edit-project', { pageTitle: "Edit Project", error_msg: errors.array()[0].msg, project: { project_id: req.params.id, project_name, project_description, organization_id } });
    }
    try {
        await updateProject(req.params.id, project_name.trim(), project_description.trim(), organization_id);
        res.redirect('/projects');
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

// --- MECANISMO DE ASSOCIAÇÃO DE CATEGORIAS (Critério 3) ---
export const buildAssignCategories = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        const allCategories = await getCategories();
        const currentCategories = await getProjectCategories(projectId);
        
        const currentIds = currentCategories.map(c => c.category_id.toString());

        res.render('assign-categories', {
            pageTitle: `Assign Categories to ${project.project_name}`,
            project,
            categories: allCategories,
            currentIds,
            error_msg: null
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const assignCategoriesToProject = async (req, res) => {
    const projectId = req.params.id;
    let { categories } = req.body; // Array contendo os IDs selecionados

    if (!categories) categories = [];
    if (!Array.isArray(categories)) categories = [categories];

    try {
        await deleteProjectCategories(projectId); // Limpa as associações anteriores
        for (const catId of categories) {
            await insertProjectCategory(projectId, catId); // Insere as novas relações
        }
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        res.status(500).send("Server Error");
    }
};