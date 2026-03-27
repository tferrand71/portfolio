<?php
require_once '../connexion.php';
require 'auth.php';

function fetchAll(PDO $pdo, string $sql, array $params = []): array {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

try {
    $concerts_avenir = fetchAll($pdo, "SELECT * FROM concert WHERE date >= CURDATE() ORDER BY date ASC");
    $concerts_passes = fetchAll($pdo, "SELECT * FROM concert WHERE date < CURDATE() ORDER BY date DESC");
} catch (PDOException $e) {
    echo "<p class='error'>Erreur base de données : " . htmlspecialchars($e->getMessage()) . "</p>";
    exit;
}

require '../include/header.php';
require 'slidebar.php';
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Gestion des concerts</title>
    <style>
        :root {
            --bg-light: #f5f7fa;
            --bg-dark: #1e1e1e;
            --text-light: #333;
            --text-dark: #f0f0f0;
            --sidebar-width: 245px;
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
            transition: background-color 0.3s, color 0.3s;
        }

        .main-content.dark-mode {
            background-color: var(--bg-dark);
            color: var(--text-dark);
        }

        h1 {
            font-size: 2rem;
            margin-bottom: 1.5rem;
        }

        ul.concert-list {
            list-style: none;
            padding: 0;
        }

        ul.concert-list li {
            background-color: #fff;
            margin-bottom: 1rem;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border-left: 5px solid #4f46e5;
            position: relative;
            transition: background-color 0.3s;
        }

        .main-content.dark-mode ul.concert-list li {
            background-color: #2c2c2c;
            color: var(--text-dark);
        }

        .empty-message {
            text-align: center;
            font-style: italic;
            color: #777;
            margin-top: 1rem;
        }

        .main-content.dark-mode .empty-message {
            color: #bbb;
        }

        .toggle-btn {
            margin-top: 2rem;
            padding: 0.5rem 1rem;
            border: none;
            background-color: #4f46e5;
            color: white;
            border-radius: 5px;
            cursor: pointer;
        }

        .concerts-passes {
            display: none;
            margin-top: 2rem;
        }

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
        }

        .main-content.dark-mode #theme-toggle {
            background: #333;
            border-color: #555;
            color: #eee;
        }

        .concert-image {
            margin-top: 10px;
            max-height: 100px;
        }

        a.button {
            display: inline-block;
            margin-bottom: 1.5rem;
            padding: 0.5rem 1rem;
            background-color: #4f46e5;
            color: white;
            border-radius: 5px;
            text-decoration: none;
        }

        a.button:hover {
            background-color: #3730a3;
        }
        .edit-link {
    position: absolute;
    right: 15px;
    top: 15px;
    font-size: 1.2rem;
    color: #4f46e5;
    text-decoration: none;
}

.edit-link:hover {
    color: #3730a3;
}

    </style>
</head>
<body>
    <button id="theme-toggle">🌙 Mode sombre</button>

    <div class="page-wrapper">
        <div id="main-content" class="main-content">
            <h1>Gestion des concerts</h1>
            <a href="ajouter_concert.php" class="button">+ Ajouter un concert</a>

            <section>
                <h2>Concerts à venir</h2>
                <?php if (count($concerts_avenir) === 0): ?>
                    <p class="empty-message">Aucun concert à venir.</p>
                <?php else: ?>
                    <ul class="concert-list">
                        <?php foreach ($concerts_avenir as $concert): ?>
                            <li>
    <strong><?= htmlspecialchars($concert['titre']) ?></strong><br>
    <?= date("d/m/Y", strtotime($concert['date'])) ?><br>
    <?php if (!empty($concert['affiche'])): ?>
        <img class="concert-image" src="data:image/jpeg;base64,<?= base64_encode($concert['affiche']) ?>" alt="Affiche">
    <?php else: ?>
        <em>Pas d'affiche</em>
    <?php endif; ?>

    <!-- Lien Modifier -->
    <a href="modifier_concert.php?id=<?= urlencode($concert['id']) ?>" class="edit-link" title="Modifier ce concert">✏️ Modifier</a>
</li>

                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </section>

            <button class="toggle-btn" onclick="toggleConcertsPasse()">📂 Afficher les concerts passés</button>

            <section class="concerts-passes" id="concerts-passes">
                <h2>Concerts passés</h2>
                <?php if (count($concerts_passes) === 0): ?>
                    <p class="empty-message">Aucun concert passé.</p>
                <?php else: ?>
                    <ul class="concert-list">
                        <?php foreach ($concerts_passes as $concert): ?>
                            <li>
    <strong><?= htmlspecialchars($concert['titre']) ?></strong><br>
    <?= date("d/m/Y", strtotime($concert['date'])) ?><br>
    <?php if (!empty($concert['affiche'])): ?>
        <img class="concert-image" src="data:image/jpeg;base64,<?= base64_encode($concert['affiche']) ?>" alt="Affiche">
    <?php else: ?>
        <em>Pas d'affiche</em>
    <?php endif; ?>

    <!-- Lien Modifier -->
    <a href="modifier_concert.php?id=<?= urlencode($concert['id']) ?>" class="edit-link" title="Modifier ce concert">✏️ Modifier</a>
</li>

                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </section>
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

        function toggleConcertsPasse() {
            const section = document.getElementById('concerts-passes');
            section.style.display = section.style.display === 'none' || section.style.display === '' ? 'block' : 'none';
        }
    </script>
</body>
</html>
