<?php
require_once '../connexion.php';
require_once 'auth.php';

$id = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) exit;

$stmt = $pdo->prepare("SELECT * FROM contenu WHERE id = :id");
$stmt->execute(['id' => $id]);
$contenu = $stmt->fetch();
if (!$contenu) exit;

$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nouveauTexte = $_POST['text'] ?? '';
    // Mise à jour directe sans condition
    $stmt = $pdo->prepare("UPDATE contenu SET text = :text WHERE id = :id");
    $stmt->execute(['text' => $nouveauTexte, 'id' => $id]);

    // Recharger le contenu mis à jour
    $stmt = $pdo->prepare("SELECT * FROM contenu WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $contenu = $stmt->fetch();

    $message = "Le contenu a bien été mis à jour.";
}

$titres = [
    1 => "Présentation",
    2 => "Actualités"
];
$titre = $titres[$id] ?? "Contenu";
?>

<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($titre) ?></title>
    <link rel="stylesheet" href="dashboard.css">
    <style>
        :root {
            --bg-color-light: #ffffff;
            --text-color-light: #000000;
            --bg-color-dark: #121212;
            --text-color-dark: #e0e0e0;
        }

        [data-theme="dark"] body {
            background-color: var(--bg-color-dark);
            color: var(--text-color-dark);
        }

        [data-theme="light"] body {
            background-color: var(--bg-color-light);
            color: var(--text-color-light);
        }

        body {
            font-family: sans-serif;
            margin: 0;
            display: flex;
        }

        #sidebar {
            background-color: #f4f4f4 !important;
            color: #000 !important;
            min-width: 220px;
            padding: 1em;
        }

        main {
            flex-grow: 1;
            padding: 2em;
            position: relative;
        }

        .theme-toggle {
            position: absolute;
            top: 1em;
            right: 1em;
            background: #0066cc;
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
        }

        .container {
            max-width: 1000px;
            margin: 3em auto 2em auto;
            display: flex;
            gap: 2em;
            flex-wrap: wrap;
        }

        .contenu-actuel, .formulaire {
            flex: 1 1 400px;
        }

        .contenu-actuel {
            background-color: #1e1e1e;
            padding: 1em;
            border-radius: 8px;
        }

        [data-theme="light"] .contenu-actuel {
            background-color: #f0f0f0;
            color: #000;
        }

        .formulaire textarea {
            width: 100%;
            height: 300px;
            font-size: 1em;
            padding: 10px;
            background-color: #2b2b2b;
            color: #fff;
            border: 1px solid #444;
            border-radius: 8px;
        }

        [data-theme="light"] .formulaire textarea {
            background-color: #fff;
            color: #000;
            border: 1px solid #ccc;
        }

        .bouton {
            margin-top: 1em;
            padding: 10px 20px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }

        .retour-accueil {
            text-align: center;
            margin-bottom: 1em;
        }

        .retour-accueil a {
            color: #00aaff;
            text-decoration: none;
            font-weight: bold;
        }

        .retour-accueil a:hover {
            text-decoration: underline;
        }

        h1 {
            text-align: center;
        }

        .message {
            background-color: #2e7d32;
            color: #fff;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 1em;
        }

        [data-theme="light"] .message {
            background-color: #dff0d8;
            color: #2e7d32;
        }
    </style>
</head>
<body>
    <div id="sidebar">
        <?php include 'slidebar.php'; ?>
    </div>

    <main>
        <button class="theme-toggle" onclick="toggleTheme()">Changer de thème</button>

        <div class="retour-accueil">
            <a href="dashboard.php">← Retour à l'accueil</a>
        </div>

        <h1><?= htmlspecialchars($titre) ?></h1>

        <?php if ($message): ?>
            <div class="message"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>

        <div class="container">
            <div class="contenu-actuel">
                <h2>Contenu actuel</h2>
                <p><?= nl2br(htmlspecialchars($contenu['text'])) ?></p>
            </div>

            <div class="formulaire">
                <form method="post">
                    <h2>Modifier le contenu</h2>
                    <textarea name="text"><?= htmlspecialchars($contenu['text']) ?></textarea>
                    <button type="submit" class="bouton">Enregistrer</button>
                </form>
            </div>
        </div>
    </main>

    <script>
        function toggleTheme() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        }

        // Appliquer le thème sauvegardé
        (function () {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
            }
        })();
    </script>
</body>
</html>
