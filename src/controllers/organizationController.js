import { getOrganizations, getOrganizationById, insertOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganization } from '../models/projects.js';

export async function buildOrganizationsPage(req, res) {
    try {
        const orgsData = await getOrganizations();
        res.render('organizations', { 
            pageTitle: "Partner Organizations", 
            organizations: orgsData 
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

export async function buildOrganizationDetails(req, res) {
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
}

export async function buildNewOrganization(req, res) {
    res.render('new-organization', { pageTitle: "Create New Organization" });
}

export async function createOrganization(req, res) {
    const { organization_name } = req.body;
    
    // Validação Server-Side (Critério 4)
    if (!organization_name || organization_name.trim().length < 3 || organization_name.trim().length > 100) {
        req.flash('error_msg', 'Organization name must be between 3 and 100 characters.');
        return res.status(400).render('new-organization', { 
            pageTitle: "Create New Organization",
            organization_name: organization_name 
        });
    }

    try {
        await insertOrganization(organization_name.trim());
        req.flash('success_msg', 'Organization created successfully!');
        res.redirect('/organizations');
    } catch (error) {
        req.flash('error_msg', 'Error creating organization.');
        res.status(500).redirect('/new-organization');
    }
}

export async function buildEditOrganization(req, res) {
    try {
        const orgId = req.params.id;
        const organization = await getOrganizationById(orgId);
        if (!organization) {
            req.flash('error_msg', 'Organization not found.');
            return res.redirect('/organizations');
        }
        res.render('edit-organization', { 
            pageTitle: "Edit Organization", 
            organization: organization 
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

export async function updateExistingOrganization(req, res) {
    const orgId = req.params.id;
    const { organization_name } = req.body;

    if (!organization_name || organization_name.trim().length < 3 || organization_name.trim().length > 100) {
        req.flash('error_msg', 'Organization name must be between 3 and 100 characters.');
        return res.status(400).render('edit-organization', { 
            pageTitle: "Edit Organization", 
            organization: { organization_id: orgId, organization_name: organization_name } 
        });
    }

    try {
        await updateOrganization(orgId, organization_name.trim());
        req.flash('success_msg', 'Organization updated successfully!');
        res.redirect('/organizations');
    } catch (error) {
        req.flash('error_msg', 'Error updating organization.');
        res.redirect(`/edit-organization/${orgId}`);
    }
}