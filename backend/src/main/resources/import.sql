-- Dados de demonstração para quando o Hibernate criar o esquema.
-- Os mesmos usuários são inseridos pela migration no contexto demo.
INSERT INTO tb_user (id, name, email, password, role, created_at) SELECT CAST('f9e7cf56-a642-4556-980f-3cabd4e6863a' AS UUID), 'Alex Green', 'alex.green@example.com', '$2a$10$KOSwhxot0SGZaAMOxJ.pS.yX14bEKN734lmvKlL3scgOWP9Dh1rd.', 0, CURRENT_TIMESTAMP WHERE NOT EXISTS (SELECT 1 FROM tb_user WHERE email = 'alex.green@example.com');

INSERT INTO tb_user (id, name, email, password, role, created_at) SELECT CAST('b055ee13-e443-4d49-9527-354b71f627f4' AS UUID), 'Maria Brown', 'maria.brown@example.com', '$2a$10$NezJhB/Mdni5K8Hfdd2A4.Td4bn.8.ULFgcbGFZp7voqZ5FSOaTvS', 1, CURRENT_TIMESTAMP WHERE NOT EXISTS (SELECT 1 FROM tb_user WHERE email = 'maria.brown@example.com');
