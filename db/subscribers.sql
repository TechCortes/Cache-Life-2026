-- Caché Life subscriber tables
-- Run once against your MySQL database before deploying.

-- Core subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    email        VARCHAR(254)  NOT NULL,
    phone_number VARCHAR(20)   NULL,
    name         VARCHAR(100)  NULL,
    subscribed   TINYINT(1)    NOT NULL DEFAULT 1,
    source       VARCHAR(50)   NULL,
    created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_subscribers_email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- Event interest tracking (many subscribers ↔ many events)
CREATE TABLE IF NOT EXISTS subscriber_events (
    id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    subscriber_id INT UNSIGNED  NOT NULL,
    event_slug    VARCHAR(100)  NOT NULL,
    event_title   VARCHAR(200)  NOT NULL,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_sub_event (subscriber_id, event_slug),
    CONSTRAINT fk_sub_events_subscriber
        FOREIGN KEY (subscriber_id) REFERENCES subscribers (id) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- Migration: run these if upgrading an existing database
-- ALTER TABLE subscribers
--   ADD COLUMN IF NOT EXISTS source     VARCHAR(50) NULL            AFTER subscribed,
--   ADD COLUMN IF NOT EXISTS updated_at DATETIME NOT NULL
--     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP        AFTER source;
