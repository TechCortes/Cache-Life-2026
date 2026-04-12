-- Caché Life subscriber table
-- Run once against your MySQL database before deploying.

CREATE TABLE IF NOT EXISTS subscribers (
    id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    email        VARCHAR(254)  NOT NULL,
    phone_number VARCHAR(20)   NULL,
    name         VARCHAR(100)  NULL,
    subscribed   TINYINT(1)    NOT NULL DEFAULT 1,
    created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_subscribers_email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
