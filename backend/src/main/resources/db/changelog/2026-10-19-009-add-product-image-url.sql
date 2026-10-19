--liquibase formatted sql

--changeset joaolive:product-2026-10-19-009-add-product-image-url
ALTER TABLE tb_product ADD COLUMN image_url VARCHAR(2048);

UPDATE tb_product SET image_url = '/images/products/product-placeholder.svg';

UPDATE tb_product SET image_url = '/images/products/classic-burger.jpg'
WHERE id = CAST('bed49b8b-800a-4f24-a57c-1641878790c7' AS UUID);

UPDATE tb_product SET image_url = '/images/products/fries.jpg'
WHERE id = CAST('c601dc42-4047-4f3b-af71-4f381fccc90b' AS UUID);

UPDATE tb_product SET image_url = '/images/products/soda.jpg'
WHERE id = CAST('1572e9e5-7a37-4334-9cbb-239e4c902ba3' AS UUID);

ALTER TABLE tb_product ALTER COLUMN image_url SET NOT NULL;
