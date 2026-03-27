<?php
require_once '../connexion.php';
require 'auth.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(['error' => 'ID invalide']);
    exit;
}

$id = (int) $_GET['id'];

$stmt = $pdo->prepare("SELECT * FROM morceaux WHERE id = ?");
$stmt->execute([$id]);
$morceau = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$morceau) {
    echo json_encode(['error' => 'Morceau non trouvé']);
    exit;
}

echo json_encode([
    'titre' => $morceau['titre'],
    'compositeur' => $morceau['compositeur'],
    'annee_composition' => $morceau['annee_composition'],
    'arrangeur' => $morceau['arrangeur'],
    'edition' => $morceau['edition'],
    'nomenclature' => $morceau['nomenclature'],
    'style' => $morceau['style'],
    'duree' => $morceau['duree'],
    'derniere_interpretation' => $morceau['derniere_interpretation'],
    'commune' => $morceau['commune'],
    'pret' => (bool)$morceau['pret'],
    'commentaires' => $morceau['commentaires'],
    'etat' => $morceau['etat'],
    'niveau' => $morceau['niveau'],
]);
