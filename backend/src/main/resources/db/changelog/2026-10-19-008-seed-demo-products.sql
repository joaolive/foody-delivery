--liquibase formatted sql

--changeset joaolive:product-2026-10-19-008-seed-demo-products context:@dev
INSERT INTO tb_product (id, name, price)
SELECT CAST('bed49b8b-800a-4f24-a57c-1641878790c7' AS UUID), 'Classic Burger', 29.90
WHERE NOT EXISTS (SELECT 1 FROM tb_product WHERE id = CAST('bed49b8b-800a-4f24-a57c-1641878790c7' AS UUID));

INSERT INTO tb_product (id, name, price)
SELECT CAST('c601dc42-4047-4f3b-af71-4f381fccc90b' AS UUID), 'Fries', 12.50
WHERE NOT EXISTS (SELECT 1 FROM tb_product WHERE id = CAST('c601dc42-4047-4f3b-af71-4f381fccc90b' AS UUID));

INSERT INTO tb_product (id, name, price)
SELECT CAST('1572e9e5-7a37-4334-9cbb-239e4c902ba3' AS UUID), 'Soda', 7.00
WHERE NOT EXISTS (SELECT 1 FROM tb_product WHERE id = CAST('1572e9e5-7a37-4334-9cbb-239e4c902ba3' AS UUID));
