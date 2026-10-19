--liquibase formatted sql

--changeset joaolive:product-2026-10-19-009-add-product-image-url
ALTER TABLE tb_product ADD COLUMN image_url VARCHAR(2048);

UPDATE tb_product SET image_url = '/images/products/product-placeholder.svg';

UPDATE tb_product SET image_url = '/images/products/classic-burger.jpg'
WHERE id = CAST('11111111-1111-4111-8111-111111111111' AS UUID);

UPDATE tb_product SET image_url = '/images/products/fries.jpg'
WHERE id = CAST('22222222-2222-4222-8222-222222222222' AS UUID);

UPDATE tb_product SET image_url = '/images/products/soda.jpg'
WHERE id = CAST('33333333-3333-4333-8333-333333333333' AS UUID);

ALTER TABLE tb_product ALTER COLUMN image_url SET NOT NULL;
