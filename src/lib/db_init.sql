-- Use this file to initialize the Postgresql database
-- @author: 2024 finxol

-- Create the database
CREATE DATABASE IF NOT EXISTS `carpool` /*!40100 DEFAULT CHARACTER SET utf8 */;

-- Create the user table
CREATE TABLE IF NOT EXISTS `carpool`.`users` (
