--liquibase formatted sql

--changeset joaolive:order-2026-10-19-011-link-order-address
ALTER TABLE tb_order ADD COLUMN address_id UUID;

-- Existing orders need an address row before their text column is removed.
-- Reusing the order UUID makes the backfill portable across PostgreSQL and H2.
INSERT INTO tb_address (id, user_id, address, created_at)
SELECT id, client_id, address, created_at FROM tb_order;

UPDATE tb_order SET address_id = id;

ALTER TABLE tb_order ALTER COLUMN address_id SET NOT NULL;
ALTER TABLE tb_order ADD CONSTRAINT fk_tb_order_address FOREIGN KEY (address_id) REFERENCES tb_address (id);
ALTER TABLE tb_order DROP COLUMN address;
