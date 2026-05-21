import { getCategories, getCategoryById } from '../models/categories.js';
import { getProjectsByCategory } from '../models/projects.js';

export async function buildCategoriesPage(req, res) {
    try {
        const categoriesData = await getCategories(); 
        res.render('categories', { 
            pageTitle: "Service Project Categories", 
            categories: categoriesData 
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

export async function buildCategoryDetails(req, res) {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        
        if (!category) {
            return res.status(404).render('404', { pageTitle: "Not Found" });
        }

        const projectsData = await getProjectsByCategory(categoryId);
        
        res.render('category', {
            pageTitle: category.category_name,
            category: category,
            projects: projectsData
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}