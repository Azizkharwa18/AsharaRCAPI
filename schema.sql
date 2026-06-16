-- Ashara Resource Center (RC) Database Schema Setup Script
-- MySQL Dialect

-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS `testDB` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `testDB`;

-- Disable foreign key checks to allow clean drops
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `team_assignment`;
DROP TABLE IF EXISTS `team`;
DROP TABLE IF EXISTS `event_session`;
DROP TABLE IF EXISTS `session_master`;
DROP TABLE IF EXISTS `event`;
DROP TABLE IF EXISTS `person`;
DROP TABLE IF EXISTS `rolemaster`;
DROP TABLE IF EXISTS `USER_MASTER`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------
-- Table `rolemaster`
-- -----------------------------------------------------
CREATE TABLE `rolemaster` (
  `roleId` INT AUTO_INCREMENT,
  `roleName` VARCHAR(100) NOT NULL,
  `designatedTo` VARCHAR(100) DEFAULT NULL,
  `isActive` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `person`
-- -----------------------------------------------------
CREATE TABLE `person` (
  `its` BIGINT UNSIGNED NOT NULL, -- Dawoodi Bohra community member identifier
  `name` VARCHAR(255) NOT NULL,
  `age` INT DEFAULT NULL,
  `whatsapp` VARCHAR(20) DEFAULT NULL,
  `contact_no` VARCHAR(20) DEFAULT NULL,
  `zone` VARCHAR(100) DEFAULT NULL,
  `role_id` INT DEFAULT NULL,
  `isActive` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`its`),
  KEY `fk_person_role_idx` (`role_id`),
  CONSTRAINT `fk_person_role` FOREIGN KEY (`role_id`) REFERENCES `rolemaster` (`roleId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `event`
-- -----------------------------------------------------
CREATE TABLE `event` (
  `eventId` INT AUTO_INCREMENT,
  `eventName` VARCHAR(255) NOT NULL,
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NOT NULL,
  `loc` VARCHAR(255) DEFAULT NULL,
  `eventInchargeITS` BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`eventId`),
  KEY `fk_event_incharge_idx` (`eventInchargeITS`),
  CONSTRAINT `fk_event_incharge` FOREIGN KEY (`eventInchargeITS`) REFERENCES `person` (`its`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `session_master`
-- -----------------------------------------------------
CREATE TABLE `session_master` (
  `session_id` INT AUTO_INCREMENT,
  `event_id` INT NOT NULL,
  `session_name` VARCHAR(255) NOT NULL,
  `session_start` DATETIME NOT NULL,
  `session_end` DATETIME NOT NULL,
  `createdBy` VARCHAR(100) DEFAULT NULL,
  `isActive` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`session_id`),
  KEY `fk_session_event_idx` (`event_id`),
  CONSTRAINT `fk_session_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`eventId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `event_session` (Attendance logs)
-- -----------------------------------------------------
CREATE TABLE `event_session` (
  `event_session_id` INT NOT NULL, -- References session_master.session_id
  `its` BIGINT UNSIGNED NOT NULL, -- References person.its
  `isPresent` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`event_session_id`, `its`),
  KEY `fk_es_session_idx` (`event_session_id`),
  KEY `fk_es_person_idx` (`its`),
  CONSTRAINT `fk_es_session` FOREIGN KEY (`event_session_id`) REFERENCES `session_master` (`session_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_es_person` FOREIGN KEY (`its`) REFERENCES `person` (`its`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `team`
-- -----------------------------------------------------
CREATE TABLE `team` (
  `teamId` INT AUTO_INCREMENT,
  `teamName` VARCHAR(255) NOT NULL,
  `onEvent` INT NOT NULL, -- References event.eventId
  `teamLeadITS` BIGINT UNSIGNED DEFAULT NULL, -- References person.its
  `isActive` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`teamId`),
  KEY `fk_team_event_idx` (`onEvent`),
  KEY `fk_team_lead_idx` (`teamLeadITS`),
  CONSTRAINT `fk_team_event` FOREIGN KEY (`onEvent`) REFERENCES `event` (`eventId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_team_lead` FOREIGN KEY (`teamLeadITS`) REFERENCES `person` (`its`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `team_assignment`
-- -----------------------------------------------------
CREATE TABLE `team_assignment` (
  `team_id` INT NOT NULL, -- References team.teamId
  `its` BIGINT UNSIGNED NOT NULL, -- References person.its
  `addedBy` BIGINT UNSIGNED DEFAULT NULL, -- References person.its (who added the member)
  PRIMARY KEY (`team_id`, `its`),
  KEY `fk_ta_team_idx` (`team_id`),
  KEY `fk_ta_person_idx` (`its`),
  KEY `fk_ta_addedby_idx` (`addedBy`),
  CONSTRAINT `fk_ta_team` FOREIGN KEY (`team_id`) REFERENCES `team` (`teamId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ta_person` FOREIGN KEY (`its`) REFERENCES `person` (`its`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ta_addedby` FOREIGN KEY (`addedBy`) REFERENCES `person` (`its`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `USER_MASTER` (Unused/Legacy Admin Login Table)
-- -----------------------------------------------------
CREATE TABLE `USER_MASTER` (
  `user_id` INT AUTO_INCREMENT,
  `full_name` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role_id` INT DEFAULT 1001,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
