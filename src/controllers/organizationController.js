import { getOrganizations, getOrganizationById, insertOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganization } from '../models/projects.js';
import { validationResult } from 'express-validator';

export const buildOrganizationsPage = async (req, res) => {
    try {
        const orgsData = await getOrganizations();
        res.render('organizations', { 
            pageTitle: "Partner Organizations", 
            organizations: orgsData 
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const buildOrganizationDetails = async (req, res) => {
    try {
        const orgId = req.params.id;
        const organization = await getOrganizationById(orgId);
        
        if (!organization) {
            return res.status(404).render('404', { pageTitle: "Not Found" });
        }

        const orgProjects = await getProjectsByOrganization(orgId);
        
        res.render('organization', {
            pageTitle: organization.organization_name,
            organization: organization,
            projects: orgProjects
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const buildNewOrganization = async (req, res) => {
    res.render('new-organization', { pageTitle: "Create New Organization", error_msg: null });
};

export const createOrganization = async (req, res) => {
    const errors = validationResult(req);
    const { organization_name, organization_email, organization_description } = req.body;
    
    const name = organization_name ? organization_name.trim() : '';
    const email = organization_email ? organization_email.trim() : '';
    const desc = organization_description ? organization_description.trim() : '';
    const img = 'org1.jpg';
    
    if (!errors.isEmpty()) {
        return res.status(400).render('new-organization', { 
            pageTitle: "Create New Organization",
            error_msg: errors.array()[0].msg,
            organization_name: name,
            organization_email: email,
            organization_description: desc
        });
    }

    try {
        await insertOrganization(name, email, desc, img);
        req.flash('success_msg', 'Organization created successfully!');
        res.redirect('/organizations');
    } catch (error) {
        console.error("Database error creating:", error);
        res.status(500).render('new-organization', {
            pageTitle: "Create New Organization",
            error_msg: "Database error creating organization.",
            organization_name: name,
            organization_email: email,
            organization_description: desc
        });
    }
};

export const buildEditOrganization = async (req, res) => {
    try {
        const orgId = req.params.id;
        const organization = await getOrganizationById(orgId);
        if (!organization) {
            req.flash('error_msg', 'Organization not found.');
            return res.redirect('/organizations');
        }
        res.render('edit-organization', { 
            pageTitle: "Edit Organization", 
            organization: organization,
            error_msg: null
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const updateExistingOrganization = async (req, res) => {
    const errors = validationResult(req);
    const orgId = req.params.id;
    const { organization_name, organization_email, organization_description, organization_image } = req.body;

    const name = organization_name ? organization_name.trim() : '';
    const email = organization_email ? organization_email.trim() : '';
    const desc = organization_description ? organization_description.trim() : '';
    const img = organization_image ? organization_image.trim() : 'org1.jpg';

    if (!errors.isEmpty()) {
        return res.status(400).render('edit-organization', { 
            pageTitle: "Edit Organization", 
            error_msg: errors.array()[0].msg,
            organization: { organization_id: orgId, organization_name: name, organization_email: email, organization_description: desc, organization_image: img } 
        });
    }

    try {
        await updateOrganization(orgId, name, email, desc, img);
        req.flash('success_msg', 'Organization updated successfully!');
        res.redirect('/organizations');
    } catch (error) {
        console.error("Database error updating:", error);
        res.status(500).render('edit-organization', {
            pageTitle: "Edit Organization",
            error_msg: "Database error updating organization.",
            organization: { organization_id: orgId, organization_name: name, organization_email: email, organization_description: desc, organization_image: img }
        });
    }
};//