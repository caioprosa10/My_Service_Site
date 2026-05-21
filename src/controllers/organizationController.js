import { getOrganizations, getOrganizationById } from '../models/organizations.js';
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