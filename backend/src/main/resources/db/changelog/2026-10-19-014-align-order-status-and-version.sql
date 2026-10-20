--liquibase formatted sql

--changeset joaolive:order-2026-10-19-014-align-order-status-and-version
ALTER TABLE tb_order DROP CONSTRAINT ck_tb_order_status;

UPDATE tb_order SET status = CASE status
    WHEN 'RECEIVED' THEN 'RECEBIDO'
    WHEN 'PREPARING' THEN 'EM_PREPARO'
    WHEN 'OUT_FOR_DELIVERY' THEN 'SAIU_PARA_ENTREGA'
    WHEN 'DELIVERED' THEN 'ENTREGUE'
    WHEN 'CANCELED' THEN 'CANCELADO'
    ELSE status
END;

ALTER TABLE tb_order ADD CONSTRAINT ck_tb_order_status
    CHECK (status IN ('RECEBIDO', 'EM_PREPARO', 'SAIU_PARA_ENTREGA', 'ENTREGUE', 'CANCELADO'));

ALTER TABLE tb_order ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
