import { getCategories, getCategoryById, insertCategory, updateCategory } from '../models/categories.js';
import { getProjectsByCategory } from '../models/projects.js';
import { validationResult } from 'express-validator';

export const buildCategoriesPage = async (req, res) => {
    try {
        const categoriesData = await getCategories(); 
        res.render('categories', { 
            pageTitle: "Service Project Categories", 
            categories: categoriesData 
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const buildCategoryDetails = async (req, res) => {
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
};

export const buildNewCategory = async (req, res) => {
    res.render('new-category', { pageTitle: "Create New Category", error_msg: null });
};

export const createCategory = async (req, res) => {
    const errors = validationResult(req);
    const { category_name } = req.body;
    
    if (!errors.isEmpty()) {
        return res.status(400).render('new-category', { 
            pageTitle: "Create New Category",
            error_msg: errors.array()[0].msg,
            category_name: category_name 
        });
    }

    try {
        await insertCategory(category_name.trim());
        req.flash('success_msg', 'Category created successfully!');
        res.redirect('/categories');
    } catch (error) {
        res.status(500).render('new-category', {
            pageTitle: "Create New Category",
            error_msg: "Database error creating category.",
            category_name: category_name
        });
    }
};

export const buildEditCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        if (!category) {
            req.flash('error_msg', 'Category not found.');
            return res.redirect('/categories');
        }
        res.render('edit-category', { 
            pageTitle: "Edit Category", 
            category: category,
            error_msg: null
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const updateExistingCategory = async (req, res) => {
    const errors = validationResult(req);
    const categoryId = req.params.id;
    const { category_name } = req.body;

    if (!errors.isEmpty()) {
        return res.status(400).render('edit-category', { 
            pageTitle: "Edit Category", 
            error_msg: errors.array()[0].msg,
            category: { category_id: categoryId, category_name: category_name } 
        });
    }

    try {
        await updateCategory(categoryId, category_name.trim());
        req.flash('success_msg', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        res.status(500).render('edit-category', {
            pageTitle: "Edit Category",
            error_msg: "Database error updating category.",
            category: { category_id: categoryId, category_name: category_name }
        });
    }
};