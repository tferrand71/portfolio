<?php
// gestion_morceaux.php
require_once '../connexion.php';
require 'auth.php';

$morceaux = $pdo->query("SELECT * FROM morceaux ORDER BY titre")->fetchAll();

include '../include/header.php';
include 'slidebar.php'; // sidebar fixe à gauche
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <title>Gestion des morceaux</title>
    <link rel="stylesheet" href="admin.css" />
    <style>
        :root {
            --bg-light: #f5f7fa;
            --bg-dark: #1e1e1e;
            --text-light: #333;
            --text-dark: #f0f0f0;
            --sidebar-width: 245px;
            --footer-height: 50px;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--bg-light);
            color: var(--text-light);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .page-wrapper {
            display: flex;
            flex: 1;
            min-height: calc(100vh - var(--footer-height));
        }

        .main-content {
            flex: 1;
            padding: 2rem;
            margin-left: var(--sidebar-width);
            box-sizing: border-box;
            background-color: var(--bg-light);
            transition: background-color 0.3s, color 0.3s;
        }

        .main-content h1 {
            font-size: 2rem;
            margin-bottom: 1.5rem;
        }

        .main-content ul {
            list-style: none;
            padding: 0;
        }

        .main-content ul li {
            background-color: #fff;
            margin-bottom: 1rem;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border-left: 5px solid #4f46e5;
            transition: background-color 0.3s, border-color 0.3s;
            cursor: pointer;
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
            transition: background-color 0.3s, color 0.3s;
        }

        /* Mode sombre appliqué uniquement à .main-content */
        .main-content.dark-mode {
            background-color: var(--bg-dark);
            color: var(--text-dark);
        }

        .main-content.dark-mode ul li {
            background-color: #2c2c2c;
            border-left-color: #6366f1;
        }

        .main-content.dark-mode #theme-toggle {
            background: #333;
            border-color: #555;
            color: #eee;
        }

        footer {
            height: var(--footer-height);
            line-height: var(--footer-height);
            text-align: center;
            background: #222;
            color: white;
            flex-shrink: 0;
            width: 100%;
        }
        .modal {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .modal-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            position: relative;
            color: #333;
            max-height: 80vh;
            overflow-y: auto;
        }

        .dark-mode .modal-content {
            background: #2c2c2c;
            color: #eee;
        }

        /* Style bouton Ajouter morceaux */
        .btn-ajouter {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4f46e5;
            color: white;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            transition: background-color 0.3s;
            margin-bottom: 1.5rem;
        }

        .btn-ajouter:hover {
            background-color: #3730a3;
        }
    </style>
</head>
<body>
    <button id="theme-toggle" class="theme-toggle">🌙 Mode sombre</button>

    <div class="page-wrapper">
        <!-- slidebar déjà incluse au-dessus -->
        <div id="main-content" class="main-content">
            <h1>Gestion des morceaux</h1>

            <a href="ajouter_morceaux.php" class="btn-ajouter">+ Ajouter morceaux</a>

            <ul>
                <?php foreach ($morceaux as $m): ?>
                    <li class="morceau-item" data-id="<?= $m['id'] ?>">
                        <?= htmlspecialchars($m['titre']) ?> – <?= htmlspecialchars($m['compositeur']) ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>

    <div id="modal" class="modal" style="display:none;">
        <div class="modal-content">
            <span id="modal-close" style="cursor:pointer;float:right;font-size:20px;">&times;</span>
            <h2 id="modal-title" style="display: inline-block;"></h2>
            <button id="edit-btn" style="float:right; margin-left: 10px;">Modifier</button>
            <div id="modal-body" style="clear: both; margin-top: 20px;"></div>
        </div>
    </div>

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

        document.querySelectorAll('.morceau-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                fetch('get_morceau.php?id=' + id)
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            alert(data.error);
                            return;
                        }
                        const modal = document.getElementById('modal');
                        const modalTitle = document.getElementById('modal-title');
                        const modalBody = document.getElementById('modal-body');
                        const editBtn = document.getElementById('edit-btn');

                        modalTitle.textContent = data.titre;
                        modalBody.innerHTML = `
                            <p><strong>Compositeur :</strong> ${data.compositeur || ''}</p>
                            <p><strong>Année de composition :</strong> ${data.annee_composition || ''}</p>
                            <p><strong>Arrangeur :</strong> ${data.arrangeur || ''}</p>
                            <p><strong>Édition :</strong> ${data.edition || ''}</p>
                            <p><strong>Nomenclature :</strong> ${data.nomenclature || ''}</p>
                            <p><strong>Style :</strong> ${data.style || ''}</p>
                            <p><strong>Durée :</strong> ${data.duree || ''}</p>
                            <p><strong>Dernière interprétation :</strong> ${data.derniere_interpretation || ''}</p>
                            <p><strong>Commune :</strong> ${data.commune || ''}</p>
                            <p><strong>Prêt :</strong> ${data.pret ? 'Oui' : 'Non'}</p>
                            <p><strong>Commentaires :</strong><br> ${data.commentaires || ''}</p>
                            <p><strong>État :</strong> ${data.etat || ''}</p>
                            <p><strong>Niveau :</strong> ${data.niveau || ''}</p>
                        `;

                        editBtn.onclick = () => {
                            window.location.href = 'modifier_morceaux.php?id=' + id;
                        };

                        modal.style.display = 'flex';
                    })
                    .catch(() => alert('Erreur lors du chargement des données.'));
            });
        });

        document.getElementById('modal-close').addEventListener('click', () => {
            document.getElementById('modal').style.display = 'none';
        });

        window.addEventListener('click', e => {
            if (e.target.id === 'modal') {
                document.getElementById('modal').style.display = 'none';
            }
        });
    </script>
</body>
</html>
