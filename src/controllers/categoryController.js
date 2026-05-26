import { getCategories, getCategoryById, insertCategory, updateCategory } from '../models/categories.js';
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

export async function buildNewCategory(req, res) {
    res.render('new-category', { pageTitle: "Create New Category" });
}

export async function createCategory(req, res) {
    const { category_name } = req.body;
    
    if (!category_name || category_name.trim().length < 3 || category_name.trim().length > 100) {
        req.flash('error_msg', 'Category name must be between 3 and 100 characters.');
        return res.status(400).render('new-category', { 
            pageTitle: "Create New Category",
            category_name: category_name 
        });
    }

    try {
        await insertCategory(category_name.trim());
        req.flash('success_msg', 'Category created successfully!');
        res.redirect('/categories');
    } catch (error) {
        req.flash('error_msg', 'Error creating category.');
        res.status(500).redirect('/new-category');
    }
}

export async function buildEditCategory(req, res) {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        if (!category) {
            req.flash('error_msg', 'Category not found.');
            return res.redirect('/categories');
        }
        res.render('edit-category', { 
            pageTitle: "Edit Category", 
            category: category 
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

export async function updateExistingCategory(req, res) {
    const categoryId = req.params.id;
    const { category_name } = req.body;

    if (!category_name || category_name.trim().length < 3 || category_name.trim().length > 100) {
        req.flash('error_msg', 'Category name must be between 3 and 100 characters.');
        return res.status(400).render('edit-category', { 
            pageTitle: "Edit Category", 
            category: { category_id: categoryId, category_name: category_name } 
        });
    }

    try {
        await updateCategory(categoryId, category_name.trim());
        req.flash('success_msg', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        req.flash('error_msg', 'Error updating category.');
        res.redirect(`/edit-category/${categoryId}`);
    }
}