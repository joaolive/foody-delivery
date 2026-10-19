--liquibase formatted sql

--changeset joaolive:user-2026-10-18-007-convert-role-to-string
ALTER TABLE tb_user ADD COLUMN role_text VARCHAR(32);

UPDATE tb_user
SET role_text = CASE role
	WHEN 0 THEN 'ADMIN'
	WHEN 1 THEN 'CLIENT'
END;

ALTER TABLE tb_user ALTER COLUMN role_text SET NOT NULL;
ALTER TABLE tb_user DROP COLUMN role;
ALTER TABLE tb_user RENAME COLUMN role_text TO role;
