<?php
require_once '../connexion.php';
require 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Nettoyage et validation minimaliste (à améliorer si besoin)
    $titre = trim($_POST['titre'] ?? '');
    if ($titre === '') {
        $error = "Le titre est obligatoire.";
    } else {
        $compositeur = $_POST['compositeur'] ?: null;
        $annee_composition = $_POST['annee_composition'] ?: null;
        $arrangeur = $_POST['arrangeur'] ?: null;
        $edition = $_POST['edition'] ?: null;
        $nomenclature = $_POST['nomenclature'] ?: null;
        $style = $_POST['style'] ?: null;
        $duree = $_POST['duree'] ?: null;
        $derniere_interpretation = $_POST['derniere_interpretation'] ?: null;
        $commune = $_POST['commune'] ?: null;
        $pret = isset($_POST['pret']) ? 1 : 0;
        $commentaires = $_POST['commentaires'] ?: null;
        $etat = $_POST['etat'] ?: null;
        $niveau = $_POST['niveau'] ?: null;

        $stmt = $pdo->prepare("INSERT INTO morceaux (titre, compositeur, annee_composition, arrangeur, edition, nomenclature, style, duree, derniere_interpretation, commune, pret, commentaires, etat, niveau) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$titre, $compositeur, $annee_composition, $arrangeur, $edition, $nomenclature, $style, $duree, $derniere_interpretation, $commune, $pret, $commentaires, $etat, $niveau]);

        header('Location: gestion_morceaux.php');
        exit;
    }
}

// Inclure header + sidebar
include '../include/header.php';
include 'slidebar.php'; // ajuste le chemin si nécessaire
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <title>Ajouter Morceau</title>
    <style>
        /* Reprendre exactement le même CSS que modifier_morceaux.php */
        /* CSS RESET & BASE */
        *, *::before, *::after { box-sizing: border-box; }
        body {
            margin: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7f9fc; color: #2c3e50;
            line-height: 1.6; padding: 2rem 4rem;
            transition: background-color 0.3s, color 0.3s;
        }
        .page-wrapper {
            max-width: 700px; margin: 2rem auto;
            background: white; border-radius: 8px;
            box-shadow: 0 8px 16px rgb(0 0 0 / 0.1);
            padding: 2rem 3rem;
        }
        h1 {
            font-weight: 700; font-size: 2.2rem; margin-bottom: 1.5rem; color: #34495e;
        }
        form label {
            display: block; margin-bottom: 1rem; font-weight: 600; color: #34495e;
        }
        form input[type="text"],
        form input[type="number"],
        form input[type="date"],
        form input[type="time"],
        form textarea {
            width: 100%; padding: 0.6rem 0.9rem; border: 1.8px solid #bdc3c7;
            border-radius: 6px; font-size: 1rem; color: #2c3e50;
            transition: border-color 0.3s; font-family: inherit;
        }
        form textarea { min-height: 100px; resize: vertical; }
        form input[type="text"]:focus,
        form input[type="number"]:focus,
        form input[type="date"]:focus,
        form input[type="time"]:focus,
        form textarea:focus {
            border-color: #2980b9; outline: none;
        }
        form label input[type="checkbox"] {
            width: auto; margin-left: 10px; vertical-align: middle;
            transform: scale(1.2); cursor: pointer;
        }
        form button {
            background-color: #2980b9; border: none; padding: 0.75rem 2rem;
            color: white; font-weight: 700; font-size: 1.1rem;
            border-radius: 6px; cursor: pointer; margin-top: 1.5rem;
            transition: background-color 0.3s;
        }
        form button:hover { background-color: #1f5f86; }
        .error {
            background: #e74c3c; color: white; padding: 0.8rem 1rem;
            border-radius: 5px; margin-bottom: 1rem;
            font-weight: 600;
        }
        /* Dark Mode */
        body.dark-mode {
            background-color: #121212; color: #e0e0e0;
        }
        body.dark-mode .page-wrapper {
            background-color: #1e1e1e;
            box-shadow: 0 8px 16px rgb(255 255 255 / 0.1);
        }
        body.dark-mode form label { color: #e0e0e0; }
        body.dark-mode form input[type="text"],
        body.dark-mode form input[type="number"],
        body.dark-mode form input[type="date"],
        body.dark-mode form input[type="time"],
        body.dark-mode form textarea {
            background-color: #2c2c2c; border: 1.8px solid #555; color: #e0e0e0;
        }
        body.dark-mode form input[type="text"]:focus,
        body.dark-mode form input[type="number"]:focus,
        body.dark-mode form input[type="date"]:focus,
        body.dark-mode form input[type="time"]:focus,
        body.dark-mode form textarea:focus {
            border-color: #4a90e2;
        }
        body.dark-mode form button {
            background-color: #4a90e2;
        }
        body.dark-mode form button:hover {
            background-color: #357ABD;
        }

        /* Toggle dark mode bouton */
        #toggleDarkMode {
            position: fixed;
            top: 1rem;
            right: 1rem;
            background: #2980b9;
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            font-weight: 700;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
            z-index: 9999;
        }
        #toggleDarkMode:hover {
            background-color: #1f5f86;
        }
    </style>
</head>
<body>
    <button id="toggleDarkMode" aria-label="Basculer mode sombre">Mode sombre</button>

    <div class="page-wrapper" role="main">
        <h1>Ajouter Morceau</h1>

        <?php if (!empty($error)): ?>
            <div class="error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form method="post" novalidate>
            <label for="titre">Titre :</label>
            <input id="titre" type="text" name="titre" value="<?= htmlspecialchars($_POST['titre'] ?? '') ?>" required />

            <label for="compositeur">Compositeur :</label>
            <input id="compositeur" type="text" name="compositeur" value="<?= htmlspecialchars($_POST['compositeur'] ?? '') ?>" />

            <label for="annee_composition">Année de composition :</label>
            <input id="annee_composition" type="number" min="1000" max="<?= date('Y') ?>" name="annee_composition" value="<?= htmlspecialchars($_POST['annee_composition'] ?? '') ?>" />

            <label for="arrangeur">Arrangeur :</label>
            <input id="arrangeur" type="text" name="arrangeur" value="<?= htmlspecialchars($_POST['arrangeur'] ?? '') ?>" />

            <label for="edition">Édition :</label>
            <input id="edition" type="text" name="edition" value="<?= htmlspecialchars($_POST['edition'] ?? '') ?>" />

            <label for="nomenclature">Nomenclature :</label>
            <textarea id="nomenclature" name="nomenclature"><?= htmlspecialchars($_POST['nomenclature'] ?? '') ?></textarea>

            <label for="style">Style :</label>
            <input id="style" type="text" name="style" value="<?= htmlspecialchars($_POST['style'] ?? '') ?>" />

            <label for="duree">Durée (HH:MM:SS) :</label>
            <input id="duree" type="time" step="1" name="duree" value="<?= htmlspecialchars($_POST['duree'] ?? '') ?>" />

            <label for="derniere_interpretation">Dernière interprétation :</label>
            <input id="derniere_interpretation" type="date" name="derniere_interpretation" value="<?= htmlspecialchars($_POST['derniere_interpretation'] ?? '') ?>" />

            <label for="commune">Commune :</label>
            <input id="commune" type="text" name="commune" value="<?= htmlspecialchars($_POST['commune'] ?? '') ?>" />

            <label for="pret">Prêt :
                <input id="pret" type="checkbox" name="pret" <?= (isset($_POST['pret']) && $_POST['pret']) ? 'checked' : '' ?> />
            </label>

            <label for="commentaires">Commentaires :</label>
            <textarea id="commentaires" name="commentaires"><?= htmlspecialchars($_POST['commentaires'] ?? '') ?></textarea>

            <label for="etat">État :</label>
            <input id="etat" type="text" name="etat" value="<?= htmlspecialchars($_POST['etat'] ?? '') ?>" />

            <label for="niveau">Niveau :</label>
            <input id="niveau" type="text" name="niveau" value="<?= htmlspecialchars($_POST['niveau'] ?? '') ?>" />

            <button type="submit">Ajouter</button>
        </form>
    </div>

    <script>
        const btn = document.getElementById('toggleDarkMode');
        btn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            btn.textContent = document.body.classList.contains('dark-mode') ? 'Mode clair' : 'Mode sombre';
        });
    </script>
</body>
</html>
