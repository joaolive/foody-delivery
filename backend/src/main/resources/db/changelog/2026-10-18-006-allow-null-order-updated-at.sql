--liquibase formatted sql

--changeset joaolive:order-2026-10-18-006-allow-null-updated-at
ALTER TABLE tb_order ALTER COLUMN updated_at DROP NOT NULL;
