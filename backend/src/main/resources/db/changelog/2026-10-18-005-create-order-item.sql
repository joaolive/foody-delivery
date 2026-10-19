--liquibase formatted sql

--changeset joaolive:order-item-2026-10-18-005-create-order-item
CREATE TABLE tb_order_item (
	order_id UUID NOT NULL,
	product_id UUID NOT NULL,
	unit_price NUMERIC(10, 2) NOT NULL,
	quantity INTEGER NOT NULL,
	CONSTRAINT pk_tb_order_item PRIMARY KEY (order_id, product_id),
	CONSTRAINT fk_tb_order_item_order FOREIGN KEY (order_id) REFERENCES tb_order (id),
	CONSTRAINT fk_tb_order_item_product FOREIGN KEY (product_id) REFERENCES tb_product (id),
	CONSTRAINT ck_tb_order_item_unit_price CHECK (unit_price >= 0),
	CONSTRAINT ck_tb_order_item_quantity CHECK (quantity > 0)
);
