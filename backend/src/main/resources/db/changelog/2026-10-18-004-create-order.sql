--liquibase formatted sql

--changeset joaolive:order-2026-10-18-004-create-order
CREATE TABLE tb_order (
	id UUID NOT NULL,
	client_id UUID NOT NULL,
	address VARCHAR(255) NOT NULL,
	status VARCHAR(32) NOT NULL,
	created_at TIMESTAMP(6) NOT NULL,
	updated_at TIMESTAMP(6) NOT NULL,
	CONSTRAINT pk_tb_order PRIMARY KEY (id),
	CONSTRAINT fk_tb_order_client FOREIGN KEY (client_id) REFERENCES tb_user (id),
	CONSTRAINT ck_tb_order_status CHECK (status IN ('RECEIVED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED'))
);
