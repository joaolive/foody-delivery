-- Dados de demonstração para quando o Hibernate criar o esquema.
-- Os mesmos usuários são inseridos pela migration no contexto dev.
INSERT INTO tb_user (id, name, email, password, role, created_at) SELECT CAST('f9e7cf56-a642-4556-980f-3cabd4e6863a' AS UUID), 'Alex Green', 'alex.green@example.com', '$2a$10$KOSwhxot0SGZaAMOxJ.pS.yX14bEKN734lmvKlL3scgOWP9Dh1rd.', 'ADMIN', CURRENT_TIMESTAMP WHERE NOT EXISTS (SELECT 1 FROM tb_user WHERE email = 'alex.green@example.com');

INSERT INTO tb_user (id, name, email, password, role, created_at) SELECT CAST('b055ee13-e443-4d49-9527-354b71f627f4' AS UUID), 'Maria Brown', 'maria.brown@example.com', '$2a$10$NezJhB/Mdni5K8Hfdd2A4.Td4bn.8.ULFgcbGFZp7voqZ5FSOaTvS', 'CLIENT', CURRENT_TIMESTAMP WHERE NOT EXISTS (SELECT 1 FROM tb_user WHERE email = 'maria.brown@example.com');

-- Os mesmos produtos sao inseridos pela migration no contexto dev.
INSERT INTO tb_product (id, name, price, image_url) SELECT CAST('11111111-1111-4111-8111-111111111111' AS UUID), 'Classic Burger', 29.90, '/images/products/classic-burger.jpg' WHERE NOT EXISTS (SELECT 1 FROM tb_product WHERE id = CAST('11111111-1111-4111-8111-111111111111' AS UUID));

INSERT INTO tb_product (id, name, price, image_url) SELECT CAST('22222222-2222-4222-8222-222222222222' AS UUID), 'Fries', 12.50, '/images/products/fries.jpg' WHERE NOT EXISTS (SELECT 1 FROM tb_product WHERE id = CAST('22222222-2222-4222-8222-222222222222' AS UUID));

INSERT INTO tb_product (id, name, price, image_url) SELECT CAST('33333333-3333-4333-8333-333333333333' AS UUID), 'Soda', 7.00, '/images/products/soda.jpg' WHERE NOT EXISTS (SELECT 1 FROM tb_product WHERE id = CAST('33333333-3333-4333-8333-333333333333' AS UUID));
