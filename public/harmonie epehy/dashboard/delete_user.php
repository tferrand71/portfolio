<?php
require_once '../connexion.php';
require 'auth.php';

$userRole = $_SESSION['role'] ?? '';
$currentUserId = $_SESSION['user_id'] ?? 0;

if (!in_array($userRole, ['admin', 'président'])) {
    header('HTTP/1.1 403 Forbidden');
    echo "⛔ Accès refusé.";
    exit;
}

$userIdToDelete = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($userIdToDelete <= 0) {
    header('Location: gestion_utilisateur.php?error=id_invalide');
    exit;
}

// Récupérer les infos de l'utilisateur à supprimer
$stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE id = ?");
$stmt->execute([$userIdToDelete]);
$user = $stmt->fetch();

if (!$user) {
    header('Location: gestion_utilisateur.php?error=introuvable');
    exit;
}

// Empêcher de supprimer soi-même
if ($userIdToDelete === $currentUserId) {
    header('Location: gestion_utilisateur.php?error=auto_suppression');
    exit;
}

// Le président ne peut pas supprimer un admin
if ($userRole === 'président' && $user['role'] === 'admin') {
    header('Location: gestion_utilisateur.php?error=non_autorise');
    exit;
}

// Suppression autorisée
$stmt = $pdo->prepare("DELETE FROM utilisateurs WHERE id = ?");
$stmt->execute([$userIdToDelete]);

header('Location: gestion_utilisateur.php?success=suppression');
exit;
