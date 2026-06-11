import { getProjects, getProjectById, insertProject, updateProject, deleteProjectCategories, insertProjectCategory, getProjectCategories } from '../models/projects.js';
import { getOrganizations } from '../models/organizations.js';
import { getCategories } from '../models/categories.js';
import { addVolunteer, removeVolunteer, checkVolunteer } from '../models/volunteers.js';
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
        
        let isVolunteered = false;
        let user = null;
        if (req.session && req.session.user) {
            user = req.session.user;
            isVolunteered = await checkVolunteer(user.user_id, projectId);
        }

        // Proteção que evita o crash da tela
        const success_msg = typeof req.flash === 'function' ? req.flash('success_msg') : [];
        const error_msg = typeof req.flash === 'function' ? req.flash('error_msg') : [];

        res.render('project', { 
            pageTitle: project.project_name, 
            project, 
            categories: assignedCategories,
            isVolunteered,
            user,
            success_msg,
            error_msg
        });
    } catch (error) {
        console.error("Erro no buildProjectDetails:", error);
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
    const { project_name, project_description, organization_id, location, project_date } = req.body;
    
    if (!errors.isEmpty()) {
        const orgs = await getOrganizations();
        return res.status(400).render('new-project', { 
            pageTitle: "Create New Project", 
            organizations: orgs, 
            error_msg: errors.array()[0].msg, 
            project_name, 
            project_description, 
            organization_id, 
            location, 
            project_date 
        });
    }
    try {
        await insertProject(project_name.trim(), project_description.trim(), organization_id, location.trim(), project_date);
        req.flash('success_msg', 'Project created successfully!');
        res.redirect('/projects');
    } catch (error) {
        req.flash('error_msg', 'Error creating project.');
        res.redirect('/new-project');
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
    const { project_name, project_description, organization_id, location, project_date } = req.body;
    
    if (!errors.isEmpty()) {
        const orgs = await getOrganizations();
        return res.status(400).render('edit-project', { 
            pageTitle: "Edit Project", 
            organizations: orgs, 
            error_msg: errors.array()[0].msg, 
            project: { project_id: req.params.id, project_name, project_description, organization_id, location, project_date } 
        });
    }
    try {
        await updateProject(req.params.id, project_name.trim(), project_description.trim(), organization_id, location.trim(), project_date);
        req.flash('success_msg', 'Project updated successfully!');
        res.redirect('/projects');
    } catch (error) {
        req.flash('error_msg', 'Error updating project.');
        res.redirect(`/edit-project/${req.params.id}`);
    }
};

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
    let { categories } = req.body;

    if (!categories) categories = [];
    if (!Array.isArray(categories)) categories = [categories];

    try {
        await deleteProjectCategories(projectId);
        for (const catId of categories) {
            await insertProjectCategory(projectId, catId);
        }
        req.flash('success_msg', 'Categories assigned successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        req.flash('error_msg', 'Error assigning categories.');
        res.redirect(`/project/${projectId}/assign-categories`);
    }
};

// --- FUNÇÕES DE VOLUNTARIADO ---
export const volunteerForProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;
        
        await addVolunteer(userId, projectId);
        if(typeof req.flash === 'function') req.flash('success_msg', 'You are now volunteering for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        if(typeof req.flash === 'function') req.flash('error_msg', 'Error signing up as a volunteer.');
        res.redirect(`/project/${req.params.id}`);
    }
};

export const unvolunteerFromProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;
        
        await removeVolunteer(userId, projectId);
        if(typeof req.flash === 'function') req.flash('success_msg', 'You are no longer volunteering for this project.');
        
        const referer = req.get('Referrer');
        if (referer && referer.includes('/dashboard')) {
            res.redirect('/dashboard');
        } else {
            res.redirect(`/project/${projectId}`);
        }
    } catch (error) {
        if(typeof req.flash === 'function') req.flash('error_msg', 'Error removing volunteer status.');
        res.redirect(`/project/${req.params.id}`);
    }
};