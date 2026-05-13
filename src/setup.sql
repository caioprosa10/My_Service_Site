-- 1. Limpa as tabelas se elas já existirem (para não dar erro duplicado)
DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- 2. Cria a tabela de Organizações
CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    description TEXT
);

-- 3. Cria a tabela de Projetos
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    organization_id INT REFERENCES organizations(organization_id)
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

-- 6. Insere as Organizações
INSERT INTO organizations (organization_name, description) VALUES 
('Red Cross', 'Emergency relief'),
('Habitat', 'Building homes');

-- 7. Insere os Projetos
INSERT INTO projects (project_name, description, organization_id) VALUES 
('Blood Drive', 'Collecting blood donations', 1),
('House Build 2024', 'Building a new home', 2);

-- 8. Insere as Categorias (Mínimo de 3 exigido pela rubrica)
INSERT INTO categories (category_name) VALUES 
('Community Building'),
('Environment & Conservation'),
('Health & Wellness');

-- 9. Vincula os projetos às categorias
INSERT INTO project_category (project_id, category_id) VALUES 
(1, 1),
(2, 2);