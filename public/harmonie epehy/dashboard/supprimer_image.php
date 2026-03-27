<?php
require_once '../connexion.php';
require 'auth.php';

if (isset($_GET['id'])) {
    $id = (int) $_GET['id'];

    // Récupère le chemin du fichier
    $stmt = $pdo->prepare("SELECT chemin FROM galerie WHERE id = ?");
    $stmt->execute([$id]);
    $media = $stmt->fetch();

    if ($media) {
        $cheminFichier = '../' . $media['chemin'];
        if (file_exists($cheminFichier)) {
            unlink($cheminFichier);
        }

        // Supprime de la base
        $stmt = $pdo->prepare("DELETE FROM galerie WHERE id = ?");
        $stmt->execute([$id]);
    }
}

header('Location: gestion_galerie.php');
exit;
