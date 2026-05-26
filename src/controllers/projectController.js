import { getProjects, getProjectById, updateProjectCategories } from '../models/projects.js';
import { getCategoriesByProject, getCategories } from '../models/categories.js';

export async function buildProjectsPage(req, res) {
    try {
        const projectsData = await getProjects();
        res.render('projects', { 
            pageTitle: "Service Projects", 
            projects: projectsData 
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

export async function buildProjectDetails(req, res) {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        
        if (!project) {
            return res.status(404).render('404', { pageTitle: "Not Found" });
        }

        const tags = await getCategoriesByProject(projectId);
        
        res.render('project', {
            pageTitle: project.project_name,
            project: project,
            categories: tags
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

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
    if (Array.isArray(categories)) {
        categoryIds = categories;
    } else if (categories) {
        categoryIds = [categories];
    }

    try {
        await updateProjectCategories(projectId, categoryIds);
        req.flash('success_msg', 'Categories assigned successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        req.flash('error_msg', 'Error assigning categories.');
        res.redirect(`/project/${projectId}/assign-categories`);
    }
}