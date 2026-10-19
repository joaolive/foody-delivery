--liquibase formatted sql

--changeset joaolive:product-2026-10-18-003-create-product
CREATE TABLE tb_product (
	id UUID NOT NULL,
	name VARCHAR(255) NOT NULL,
	price NUMERIC(10, 2) NOT NULL,
	CONSTRAINT pk_tb_product PRIMARY KEY (id),
	CONSTRAINT ck_tb_product_price CHECK (price >= 0)
);
