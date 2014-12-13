CREATE DATABASE IF NOT EXISTS acronym;

USE acronym;

CREATE TABLE IF NOT EXISTS `acronym` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `acronym` varchar(45) DEFAULT NULL,
  `meaning` varchar(255) DEFAULT NULL,
  `URL` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
);

CREATE USER 'acronymuser'@'localhost' IDENTIFIED BY 'acronympass';

GRANT SELECT, INSERT, UPDATE ON acronym.acronym TO 'acronymuser'@'localhost';
