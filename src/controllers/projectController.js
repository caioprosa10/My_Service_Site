import { getProjects, getProjectById, updateProjectCategories, insertProject, updateProject } from '../models/projects.js';
import { getCategoriesByProject, getCategories } from '../models/categories.js';
import { getOrganizations } from '../models/organizations.js';

export async function buildProjectsPage(req, res) {
    try {
        const projectsData = await getProjects();
        res.render('projects', { pageTitle: "Service Projects", projects: projectsData });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

export async function buildProjectDetails(req, res) {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        
        if (!project) return res.status(404).render('404', { pageTitle: "Not Found" });

        const tags = await getCategoriesByProject(projectId);
        res.render('project', { pageTitle: project.project_name, project: project, categories: tags });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

// --- NOVAS ROTAS: CREATE PROJECT ---
export async function buildNewProject(req, res) {
    try {
        const organizations = await getOrganizations();
        res.render('new-project', { pageTitle: "Create New Project", organizations: organizations });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

export async function createProject(req, res) {
    const { project_name, description, organization_id } = req.body;
    
    // Server-Side Validation
    if (!project_name || project_name.trim().length < 3) {
        req.flash('error_msg', 'Project name must be at least 3 characters long.');
        return res.redirect('/new-project');
    }

    try {
        await insertProject(project_name.trim(), description.trim(), organization_id);
        req.flash('success_msg', 'Project created successfully!');
        res.redirect('/projects');
    } catch (error) {
        req.flash('error_msg', 'Error creating project.');
        res.redirect('/new-project');
    }
}

// --- NOVAS ROTAS: EDIT PROJECT ---
export async function buildEditProject(req, res) {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        const organizations = await getOrganizations();
        
        if (!project) {
            req.flash('error_msg', 'Project not found.');
            return res.redirect('/projects');
        }
        res.render('edit-project', { pageTitle: "Edit Project", project: project, organizations: organizations });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

export async function updateExistingProject(req, res) {
    const projectId = req.params.id;
    const { project_name, description, organization_id } = req.body;

    // Server-Side Validation
    if (!project_name || project_name.trim().length < 3) {
        req.flash('error_msg', 'Project name must be at least 3 characters long.');
        return res.redirect(`/edit-project/${projectId}`);
    }

    try {
        await updateProject(projectId, project_name.trim(), description.trim(), organization_id);
        req.flash('success_msg', 'Project updated successfully!');
        res.redirect('/projects');
    } catch (error) {
        req.flash('error_msg', 'Error updating project.');
        res.redirect(`/edit-project/${projectId}`);
    }
}

// --- ROTAS: ASSIGN CATEGORIES ---
export async function buildAssignCategories(req, res) {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        const allCategories = await getCategories();
        const projectCategories = await getCategoriesByProject(projectId);
        const currentCategoryIds = projectCategories.map(c => c.category_id);

        res.render('assign-categories', {
            pageTitle: `Assign Categories: ${project.project_name}`,
            project: project,
            allCategories: allCategories,
            currentCategoryIds: currentCategoryIds
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

export async function assignCategoriesToProject(req, res) {
    const projectId = req.params.id;
    let { categories } = req.body; 
    
    let categoryIds = [];
    if (Array.isArray(categories)) categoryIds = categories;
    else if (categories) categoryIds = [categories];

    try {
        await updateProjectCategories(projectId, categoryIds);
        req.flash('success_msg', 'Categories assigned successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        req.flash('error_msg', 'Error assigning categories.');
        res.redirect(`/project/${projectId}/assign-categories`);
    }
}