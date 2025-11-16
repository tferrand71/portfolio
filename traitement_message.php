<?php
// Chargement de la connexion située dans le dossier juste avant /www
require_once __DIR__ . '/../connexion.php';

// Vérification méthode POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode([
        "status" => "error",
        "message" => "Requête invalide."
    ]));
}

// Vérification du consentement RGPD
if (empty($_POST['rgpd'])) {
    die(json_encode([
        "status" => "error",
        "message" => "Vous devez accepter les conditions RGPD pour envoyer votre message."
    ]));
}

// Sécurisation des données
$nom    = htmlspecialchars(trim($_POST['name']));
$email  = htmlspecialchars(trim($_POST['email']));
$sujet  = htmlspecialchars(trim($_POST['subject']));

// Vérification des champs obligatoires
if (empty($nom) || empty($email) || empty($sujet)) {
    die(json_encode([
        "status" => "error",
        "message" => "Veuillez remplir tous les champs."
    ]));
}

try {
    // Préparation de l'insertion
    $sql = "INSERT INTO messages (email, nom, sujet) VALUES (:email, :nom, :sujet)";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':email' => $email,
        ':nom'   => $nom,
        ':sujet' => $sujet
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Votre message a bien été enregistré."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors de l'enregistrement du message : " . $e->getMessage()
    ]);
}
