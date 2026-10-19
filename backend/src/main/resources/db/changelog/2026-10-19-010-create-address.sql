--liquibase formatted sql

--changeset joaolive:address-2026-10-19-010-create-address
CREATE TABLE tb_address (
	id UUID NOT NULL,
	user_id UUID NOT NULL,
	address VARCHAR(255) NOT NULL,
	created_at TIMESTAMP(6) NOT NULL,
	CONSTRAINT pk_tb_address PRIMARY KEY (id),
	CONSTRAINT fk_tb_address_user FOREIGN KEY (user_id) REFERENCES tb_user (id)
);

CREATE INDEX idx_tb_address_user_created_at ON tb_address (user_id, created_at DESC);
