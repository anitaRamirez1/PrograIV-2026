-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Base de datos: `db_academica`
--

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--
DROP TABLE IF EXISTS `alumnos`;
CREATE TABLE `alumnos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idAlumno` char(36) NOT NULL,
  `codigo` char(20) NOT NULL,
  `nombre` char(100) NOT NULL,
  `direccion` char(150) NOT NULL,
  `telefono` char(10) NOT NULL,
  `email` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias`
--
DROP TABLE IF EXISTS `materias`;
CREATE TABLE `materias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idMateria` char(36) NOT NULL,
  `codigo` char(20) NOT NULL,
  `nombre` char(100) NOT NULL,
  `uv` char(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docentes`
--
DROP TABLE IF EXISTS `docentes`;
CREATE TABLE `docentes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Docentes` char(36) NOT NULL,
  `codigo` char(20) NOT NULL,
  `nombre` char(100) NOT NULL,
  `direccion` char(150) NOT NULL,
  `telefono` char(10) NOT NULL,
  `email` text NOT NULL,
  `escalafon` char(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--
DROP TABLE IF EXISTS `inscripciones`;
CREATE TABLE `inscripciones` (
  `idInscripcion` int(11) NOT NULL AUTO_INCREMENT,
  `idAlumno` char(36) NOT NULL,
  `idMateria` char(36) NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`idInscripcion`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matriculas`
--
DROP TABLE IF EXISTS `matriculas`;
CREATE TABLE `matriculas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idMatricula` char(36) NOT NULL,
  `idAlumno` char(36) NOT NULL,
  `idMateria` char(36) NOT NULL,
  `idDocente` char(36) NOT NULL,
  `fecha` date NOT NULL,
  `estado` char(20) NOT NULL,
  `periodo` char(20) NOT NULL,
  `gestion` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
