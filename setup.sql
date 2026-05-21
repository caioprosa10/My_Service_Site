-- Tabela de Categorias
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

-- Tabela de Ligação (Muitos para Muitos)
CREATE TABLE project_category (
    project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- Inserindo as categorias
INSERT INTO categories (category_name) VALUES 
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');

-- Vinculando projetos às categorias (Certifique-se de ter os projetos 1 e 2 criados!)
INSERT INTO project_category (project_id, category_id) VALUES 
    (1, 1),
    (1, 2),
    (2, 3),
    (2, 4);