--liquibase formatted sql

--changeset joaolive:user-2026-10-18-002-seed-demo-users context:@dev
-- The role values follow the original enum order: ADMIN = 0, CLIENT = 1.
INSERT INTO tb_user (id, name, email, password, role, created_at)
SELECT CAST('9c7be40f-4c25-4f88-ac04-d5a95142a164' AS UUID), 'Alex Green', 'alex.green@example.com',
       '$2a$10$KOSwhxot0SGZaAMOxJ.pS.yX14bEKN734lmvKlL3scgOWP9Dh1rd.', 0, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_user WHERE email = 'alex.green@example.com');

INSERT INTO tb_user (id, name, email, password, role, created_at)
SELECT CAST('363805d1-9b6d-4a5f-98a3-740ad398a690' AS UUID), 'Maria Brown', 'maria.brown@example.com',
       '$2a$10$NezJhB/Mdni5K8Hfdd2A4.Td4bn.8.ULFgcbGFZp7voqZ5FSOaTvS', 1, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_user WHERE email = 'maria.brown@example.com');
