import { getProjects, getProjectById } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';

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