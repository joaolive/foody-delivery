--liquibase formatted sql

--changeset joaolive:user-2026-10-18-001-create-user
CREATE TABLE tb_user (
	id UUID NOT NULL,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	role SMALLINT NOT NULL,
	created_at TIMESTAMP(6),
	CONSTRAINT pk_tb_user PRIMARY KEY (id),
	CONSTRAINT uk_tb_user_email UNIQUE (email)
);
