<?php
require_once '../connexion.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(['error' => 'ID invalide']);
    exit;
}

$id = (int)$_GET['id'];
$stmt = $pdo->prepare("SELECT * FROM contact WHERE id = ?");
$stmt->execute([$id]);
$message = $stmt->fetch();

if ($message) {
    echo json_encode($message);
} else {
    echo json_encode(['error' => 'Message introuvable']);
}
