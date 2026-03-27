<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Importation des variables
// Importation de l'instance PDO
$pdo = require __DIR__ . '/../config/database.php';
