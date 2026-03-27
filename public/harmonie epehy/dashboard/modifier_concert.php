<?php
require_once '../connexion.php';
require 'auth.php';

// Vérifie la présence de l'id dans l'URL
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo "ID de concert invalide.";
    exit;
}

$id = (int)$_GET['id'];
$error = '';
$success = '';

// Récupération des données existantes du concert
try {
    $stmt = $pdo->prepare("SELECT * FROM concert WHERE id = ?");
    $stmt->execute([$id]);
    $concert = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$concert) {
        echo "Concert non trouvé.";
        exit;
    }
} catch (PDOException $e) {
    echo "Erreur base de données : " . htmlspecialchars($e->getMessage());
    exit;
}

// Traitement du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titre = trim($_POST['titre'] ?? '');
    $date = $_POST['date'] ?? '';

    if ($titre === '' || $date === '') {
        $error = "Le titre et la date sont obligatoires.";
    } else {
        // Gestion de l'upload de l'affiche (optionnel)
        $afficheData = $concert['affiche']; // garde l'ancienne affiche par défaut
        if (isset($_FILES['affiche']) && $_FILES['affiche']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['affiche']['tmp_name'];
            $fileSize = $_FILES['affiche']['size'];
            $fileType = mime_content_type($fileTmpPath);

            // Limitation aux images jpeg/png/gif
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!in_array($fileType, $allowedTypes)) {
                $error = "Type d'image non autorisé. Seules JPEG, PNG et GIF sont acceptées.";
            } elseif ($fileSize > 2 * 1024 * 1024) { // 2Mo max
                $error = "La taille de l'image ne doit pas dépasser 2 Mo.";
            } else {
                $afficheData = file_get_contents($fileTmpPath);
            }
        }

        if (!$error) {
            // Mise à jour en base
            try {
                $stmt = $pdo->prepare("UPDATE concert SET titre = ?, date = ?, affiche = ? WHERE id = ?");
                $stmt->execute([$titre, $date, $afficheData, $id]);
                $success = "Concert modifié avec succès.";
                // Actualiser les données affichées
                $concert['titre'] = $titre;
                $concert['date'] = $date;
                $concert['affiche'] = $afficheData;
            } catch (PDOException $e) {
                $error = "Erreur lors de la mise à jour : " . htmlspecialchars($e->getMessage());
            }
        }
    }
}

require '../include/header.php';
require 'slidebar.php';
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Modifier Concert</title>
    <style>
        :root {
            --bg-light: #f5f7fa;
            --bg-dark: #1e1e1e;
            --text-light: #333;
            --text-dark: #f0f0f0;
            --sidebar-width: 245px;
            --primary-color: #4f46e5;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: var(--bg-light);
            color: var(--text-light);
        }

        .page-wrapper {
            display: flex;
            min-height: 100vh;
        }

        .main-content {
    flex: 1;
    margin-left: var(--sidebar-width);
    padding: 2rem;
    background-color: var(--bg-light);
    color: var(--text-light);
    transition: background-color 0.3s, color 0.3s;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}


        .main-content.dark-mode {
            background-color: var(--bg-dark);
            color: var(--text-dark);
        }

        h1 {
            font-size: 2rem;
            margin-bottom: 1.5rem;
        }

        form {
    width: 100%;
    max-width: 600px;
    background: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    color: var(--text-light);
    transition: background-color 0.3s, color 0.3s;
}


        .main-content.dark-mode form {
            background-color: #2c2c2c;
            color: var(--text-dark);
        }

        label {
            display: block;
            margin-top: 1rem;
            font-weight: bold;
        }

        input[type="text"], input[type="date"], input[type="file"] {
            width: 100%;
            padding: 0.5rem;
            margin-top: 0.25rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #fff;
            color: #333;
            transition: background-color 0.3s, color 0.3s;
        }

        .main-content.dark-mode input[type="text"],
        .main-content.dark-mode input[type="date"],
        .main-content.dark-mode input[type="file"] {
            background-color: #444;
            color: var(--text-dark);
            border-color: #555;
        }

        button {
            margin-top: 1.5rem;
            padding: 0.5rem 1rem;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #3730a3;
        }

        .message {
            max-width: 600px;
            margin: 1rem auto;
            padding: 0.75rem;
            border-radius: 5px;
        }

        .error {
            background-color: #f8d7da;
            color: #842029;
        }

        .success {
            background-color: #d1e7dd;
            color: #0f5132;
        }

        .concert-image {
            margin-top: 1rem;
            max-height: 150px;
            display: block;
            border-radius: 5px;
        }

        a.button-back {
            display: inline-block;
            margin-bottom: 1rem;
            background: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
        }

        a.button-back:hover {
            background-color: #3730a3;
        }

        /* Bouton thème */
        #theme-toggle {
            position: fixed;
            top: 15px;
            right: 15px;
            z-index: 9999;
            padding: 10px 20px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
        }

        .main-content.dark-mode #theme-toggle {
            background: #333;
            border-color: #555;
            color: #eee;
        }
    </style>
</head>
<body>
    <button id="theme-toggle">🌙 Mode sombre</button>

    <div class="page-wrapper">
        <?php
        // ta sidebar déjà incluse plus haut, on est dans .page-wrapper, donc ça colle
        ?>

        <div id="main-content" class="main-content">
            <a href="gestion_concert.php" class="button-back">← Retour à la gestion des concerts</a>

            <h1>Modifier un concert</h1>

            <?php if ($error): ?>
                <div class="message error"><?= htmlspecialchars($error) ?></div>
            <?php elseif ($success): ?>
                <div class="message success"><?= htmlspecialchars($success) ?></div>
            <?php endif; ?>

            <form method="POST" enctype="multipart/form-data" novalidate>
                <label for="titre">Titre du concert :</label>
                <input type="text" id="titre" name="titre" value="<?= htmlspecialchars($concert['titre']) ?>" required>

                <label for="date">Date :</label>
                <input type="date" id="date" name="date" value="<?= htmlspecialchars($concert['date']) ?>" required>

                <label for="affiche">Affiche (laisser vide pour garder l'existante) :</label>
                <input type="file" id="affiche" name="affiche" accept="image/*">

                <?php if (!empty($concert['affiche'])): ?>
                    <img class="concert-image" src="data:image/jpeg;base64,<?= base64_encode($concert['affiche']) ?>" alt="Affiche actuelle">
                <?php else: ?>
                    <p>Aucune affiche disponible.</p>
                <?php endif; ?>

                <button type="submit">Enregistrer les modifications</button>
            </form>
        </div>
    </div>

    <?php require '../include/footer.php'; ?>

    <script>
        const toggle = document.getElementById('theme-toggle');
        const mainContent = document.getElementById('main-content');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (localStorage.getItem('theme') === 'dark' || (prefersDark && !localStorage.getItem('theme'))) {
            mainContent.classList.add('dark-mode');
            toggle.textContent = '☀️ Mode clair';
        }

        toggle.addEventListener('click', () => {
            mainContent.classList.toggle('dark-mode');
            const darkMode = mainContent.classList.contains('dark-mode');
            toggle.textContent = darkMode ? '☀️ Mode clair' : '🌙 Mode sombre';
            localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        });
    </script>
</body>
</html>
