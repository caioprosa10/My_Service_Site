-- 1. Limpa as tabelas se elas já existirem (para não dar erro duplicado)
DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- 2. Cria a tabela de Organizações
CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    description TEXT,
    organization_email VARCHAR(255), -- NOVO CAMPO: Email de contato
    organization_image VARCHAR(255)  -- NOVO CAMPO: Imagem (necessário para o JS)
);

-- 3. Cria a tabela de Projetos
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    organization_id INT REFERENCES organizations(organization_id),
    location VARCHAR(255), -- NOVO CAMPO: Localização
    project_date DATE      -- NOVO CAMPO: Data
);

-- 4. Cria a tabela de Categorias
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

-- 5. Cria a tabela de Ligação (Projetos e Categorias)
CREATE TABLE project_category (
    project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- 6. Insere as Organizações (Atualizado com email e imagem)
INSERT INTO organizations (organization_name, description, organization_email, organization_image) VALUES 
('Red Cross', 'Emergency relief', 'contact@redcross.org', 'org1.jpg'),
('Habitat', 'Building homes', 'info@habitat.org', 'org2.jpg');

-- 7. Insere os Projetos (Atualizado com localização e data)
INSERT INTO projects (project_name, description, organization_id, location, project_date) VALUES 
('Blood Drive', 'Collecting blood donations', 1, 'City Center', '2024-10-15'),
('House Build 2024', 'Building a new home', 2, 'Northside Neighborhood', '2024-11-20');

-- 8. Insere as Categorias (Mínimo de 3 exigido pela rubrica)
INSERT INTO categories (category_name) VALUES 
('Community Building'),
('Environment & Conservation'),
('Health & Wellness');

-- 9. Vincula os projetos às categorias
INSERT INTO project_category (project_id, category_id) VALUES 
(1, 1),
(2, 2);