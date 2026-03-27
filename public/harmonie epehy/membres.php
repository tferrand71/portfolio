<?php
// Vérification de la maintenance (doit être en premier)
require_once __DIR__ . '/include/maintenance_check.php';

require 'connexion.php';
include 'header.php';

// Définir les rôles administratifs et de direction (tout est dans la colonne instrument)
$roles_direction = ['chef', 'président', 'vice-président', 'secrétaire', 'trésorier', 'president', 'vice-president', 'secretaire', 'tresorier'];

// Requête SQL pour récupérer tous les membres
$sql = "SELECT id, photo, nom, prenom, instrument FROM membre";
$stmt = $pdo->query($sql);
$membres = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Séparer les membres de direction/administration et les musiciens
$direction = [];
$musiciens = [];

foreach ($membres as $membre) {
    $instrument_lower = strtolower(trim($membre['instrument']));
    
    // Vérifier si c'est un membre de direction (par instrument)
    if (in_array($instrument_lower, $roles_direction)) {
        $direction[] = $membre;
    } else {
        $musiciens[] = $membre;
    }
}

// Fonction pour déterminer l'ordre de priorité d'affichage
function getPriorite($membre) {
    $instrument = strtolower(trim($membre['instrument']));
    
    // Ordre de priorité pour l'affichage
    $ordre = [
        'chef' => 1,
        'président' => 2,
        'president' => 2,
        'vice-président' => 3,
        'vice-president' => 3,
        'secrétaire' => 4,
        'secretaire' => 4,
        'trésorier' => 5,
        'tresorier' => 5
    ];
    
    return isset($ordre[$instrument]) ? $ordre[$instrument] : 999;
}

// Trier les membres de direction par ordre de priorité
usort($direction, function($a, $b) {
    return getPriorite($a) - getPriorite($b);
});

?>
<style>
body {
    padding-top: 80px; /* Ajuster selon la hauteur de votre header */
}

.mosaïque {
    margin-top: 20px;
}
</style>


<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Membres de l'Orchestre</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
<h2>Chef(s) d'orchestre et membres du conseil d'administration</h2>
<div class="mosaïque">
<?php foreach ($direction as $membre): ?>
    <a href="biographie.php?id=<?= $membre['id'] ?>" class="carte-link">
        <div class="carte">
            <?php
            if ($membre['photo']) {
                $base64 = base64_encode($membre['photo']);
                echo "<img src='data:image/jpeg;base64,{$base64}' alt='Photo de {$membre['prenom']}'>";
            } else {
                echo "<img src='default.jpg' alt='Photo par défaut'>";
            }
            ?>
            <div class="infos">
                <h2><?= htmlspecialchars($membre['prenom'] . ' ' . $membre['nom']) ?></h2>
                <p><?= htmlspecialchars($membre['instrument']) ?></p>
            </div>
        </div>
    </a>
<?php endforeach; ?>
</div>

<h2>Musiciens</h2>
<div class="mosaïque">
<?php foreach ($musiciens as $membre): ?>
    <a href="biographie.php?id=<?= $membre['id'] ?>" class="carte-link">
        <div class="carte">
            <?php
            if ($membre['photo']) {
                $base64 = base64_encode($membre['photo']);
                echo "<img src='data:image/jpeg;base64,{$base64}' alt='Photo de {$membre['prenom']}'>";
            } else {
                echo "<img src='default.jpg' alt='Photo par défaut'>";
            }
            ?>
            <div class="infos">
                <h2><?= htmlspecialchars($membre['prenom'] . ' ' . $membre['nom']) ?></h2>
                <p><?= htmlspecialchars($membre['instrument']) ?></p>
            </div>
        </div>
    </a>
<?php endforeach; ?>
</div>

</body>
</html>