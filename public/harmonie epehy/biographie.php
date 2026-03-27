<?php
// Vérification de la maintenance (doit être en premier)
require_once __DIR__ . '/include/maintenance_check.php';

require 'connexion.php';
include 'header.php';

// Récupérer l'ID du membre depuis l'URL
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    header('Location: membres.php');
    exit;
}

// Récupérer les informations du membre
$sql = "SELECT id, photo, nom, prenom, instrument, biographie, date_naissance, formation, experience, repertoire FROM membre WHERE id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);
$membre = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$membre) {
    header('Location: membres.php');
    exit;
}

// Préparer les données pour l'affichage
$biographie_data = [
    'biographie' => $membre['biographie'] ?? '',
    'formation' => $membre['formation'] ?? '',
    'experience' => $membre['experience'] ?? '',
    'repertoire' => $membre['repertoire'] ?? ''
];

if (!empty($membre['formation'])) {
    $formation_array = json_decode($membre['formation'], true);
    if (is_array($formation_array)) {
        $biographie_data['formation'] = $formation_array;
    }
}
if (!empty($membre['experience'])) {
    $experience_array = json_decode($membre['experience'], true);
    if (is_array($experience_array)) {
        $biographie_data['experience'] = $experience_array;
    }
}
if (!empty($membre['repertoire'])) {
    $repertoire_array = json_decode($membre['repertoire'], true);
    if (is_array($repertoire_array)) {
        $biographie_data['repertoire'] = $repertoire_array;
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biographie - <?= htmlspecialchars($membre['prenom'] . ' ' . $membre['nom']) ?></title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <div class="biographie-container">
        <div class="biographie-header">
            <h1><?= htmlspecialchars($membre['prenom'] . ' ' . $membre['nom']) ?></h1>
            <p class="instrument"><?= htmlspecialchars($membre['instrument']) ?></p>
        </div>

        <div class="biographie-content">
            <div class="biographie-photo">
                <?php if ($membre['photo']): ?>
                    <?php $base64 = base64_encode($membre['photo']); ?>
                    <img src="data:image/jpeg;base64,<?= $base64 ?>" alt="Photo de <?= htmlspecialchars($membre['prenom']) ?>">
                <?php else: ?>
                    <img src="default.jpg" alt="Photo par défaut">
                <?php endif; ?>
            </div>

            <div class="biographie-info">
                <div class="bio-section">
                    <h2>Biographie</h2>
                    <p><?= nl2br(htmlspecialchars($biographie_data['biographie'])) ?></p>
                </div>

                <div class="bio-section">
                    <h3>Formation</h3>
                    <ul>
                        <?php foreach ($biographie_data['formation'] as $formation): ?>
                            <li><?= htmlspecialchars($formation) ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>

                <div class="bio-section">
                    <h3>Expérience</h3>
                    <ul>
                        <?php foreach ($biographie_data['experience'] as $experience): ?>
                            <li><?= htmlspecialchars($experience) ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>

                <div class="bio-section">
                    <h3>Répertoire</h3>
                    <ul>
                        <?php foreach ($biographie_data['repertoire'] as $repertoire): ?>
                            <li><?= htmlspecialchars($repertoire) ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>

                <a href="membres.php" class="retour-btn">← Retour aux membres</a>
            </div>
        </div>
    </div>
</body>
</html> 