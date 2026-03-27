<?php
session_start();

// Détruit toutes les variables de session
$_SESSION = [];
// Détruit la session
session_destroy();
// Redirige vers la page de connexion ou d'accueil
header("Location: ../index.php"); // ou index.php selon ta logique
exit();
?>