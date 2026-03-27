<?php
// Durée maximale d'inactivité (en secondes) : 10 minutes
$inactivityLimit = 600;

// Si l'utilisateur est inactif depuis plus de 10 minutes, on détruit la session
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $inactivityLimit)) {
    session_unset();
    session_destroy();
    header("Location: ../index.php"); // Redirection vers la page d'accueil publique
    exit();
}

// Mise à jour du temps de la dernière activité
$_SESSION['LAST_ACTIVITY'] = time();

// Vérification de la session
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role'])) {
    header("Location: connexion.php"); // Redirection vers la page de login
    exit();
}

// Fonction pour vérifier les permissions
function checkPermission($requiredRole) {
    if ($_SESSION['role'] !== $requiredRole) {
        header('HTTP/1.0 403 Forbidden');
        die('Accès interdit');
    }
}
