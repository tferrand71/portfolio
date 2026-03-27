<?php
require_once '../connexion.php';
require 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['archive_id'])) {
        $pdo->prepare("UPDATE contact SET archive = 1 WHERE id = ?")->execute([$_POST['archive_id']]);
    }
    if (isset($_POST['unarchive_id'])) {
        $pdo->prepare("UPDATE contact SET archive = 0 WHERE id = ?")->execute([$_POST['unarchive_id']]);
    }
}

$messages = $pdo->query("SELECT * FROM contact WHERE archive = 0 ORDER BY created_at DESC")->fetchAll();
$archived = $pdo->query("SELECT * FROM contact WHERE archive = 1 ORDER BY created_at DESC")->fetchAll();

require '../include/header.php';
require 'slidebar.php';
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Gestion des messages</title>
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
            box-sizing: border-box;
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

        ul.message-list {
            list-style: none;
            padding: 0;
        }

        ul.message-list li {
            background-color: #fff;
            margin-bottom: 1rem;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border-left: 5px solid #4f46e5;
            position: relative;
            transition: background-color 0.3s;
        }

        .main-content.dark-mode ul.message-list li {
            background-color: #2c2c2c;
            color: var(--text-dark);
        }

        .actions {
            position: absolute;
            top: 1rem;
            right: 1rem;
        }

        .icon-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            margin-left: 0.5rem;
        }

        .archived-toggle {
            margin-top: 2rem;
            padding: 0.5rem 1rem;
            border: none;
            background-color: #4f46e5;
            color: white;
            border-radius: 5px;
            cursor: pointer;
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

        .archived-messages {
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
            transition: background-color 0.3s, color 0.3s;
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

        /* Fenêtre modale */
        .modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.6);
        }

        .modal-content {
            background: #fff;
            margin: 10% auto;
            padding: 2rem;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            position: relative;
        }

        .modal-content h2 {
            margin-top: 0;
        }

        .close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
        }

        .modal-body {
            white-space: pre-wrap;
            margin-top: 1rem;
        }

        .modal a.btn {
            display: inline-block;
            margin-top: 1.5rem;
            background-color: #4f46e5;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            text-decoration: none;
        }

    </style>
</head>
<body>
    <button id="theme-toggle">🌙 Mode sombre</button>

    <div class="page-wrapper">
        <div id="main-content" class="main-content">
            <h1>Gestion des messages</h1>

            <?php if (count($messages) === 0): ?>
                <p class="empty-message">Aucun message à afficher.</p>
            <?php else: ?>
                <ul class="message-list">
                    <?php foreach ($messages as $msg): ?>
                        <li>
                            <strong>
                                <?php if (!empty($msg['nom'])): ?>
                                    <?= htmlspecialchars($msg['nom']) ?> (<?= htmlspecialchars($msg['email']) ?>)
                                <?php else: ?>
                                    <?= htmlspecialchars($msg['email']) ?>
                                <?php endif; ?>
                            </strong>
                            <?= htmlspecialchars(substr($msg['message'], 0, 50)) ?>...
                            <div class="actions">
                                <button class="icon-btn" title="Voir" onclick="openModal(<?= json_encode(!empty($msg['nom']) ? $msg['nom'] . ' (' . $msg['email'] . ')' : $msg['email']) ?>, <?= json_encode($msg['email']) ?>, <?= json_encode($msg['message']) ?>)">👁️</button>
                                <form method="post" style="display:inline;">
                                    <input type="hidden" name="archive_id" value="<?= $msg['id'] ?>">
                                    <button type="submit" class="icon-btn" title="Archiver">🗃️</button>
                                </form>
                            </div>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>

            <button class="archived-toggle" onclick="toggleArchived()">📂 Afficher les messages archivés</button>

            <ul class="message-list archived-messages" id="archived-messages">
                <?php if (count($archived) === 0): ?>
                    <p class="empty-message">Aucun message archivé.</p>
                <?php else: ?>
                    <?php foreach ($archived as $msg): ?>
                        <li>
                            <strong>
                                <?php if (!empty($msg['nom'])): ?>
                                    <?= htmlspecialchars($msg['nom']) ?> (<?= htmlspecialchars($msg['email']) ?>)
                                <?php else: ?>
                                    <?= htmlspecialchars($msg['email']) ?>
                                <?php endif; ?>
                            </strong>
                            <?= htmlspecialchars(substr($msg['message'], 0, 50)) ?>...
                            <div class="actions">
                                <form method="post" style="display:inline;">
                                    <input type="hidden" name="unarchive_id" value="<?= $msg['id'] ?>">
                                    <button type="submit" class="icon-btn" title="Désarchiver">🔄</button>
                                </form>
                            </div>
                        </li>
                    <?php endforeach; ?>
                <?php endif; ?>
            </ul>
        </div>
    </div>

    <!-- Fenêtre modale -->
    <div id="modal" class="modal">
        <div class="modal-content">
            <button class="close-btn" onclick="closeModal()">✖</button>
            <h2 id="modal-email"></h2>
            <p class="modal-body" id="modal-message"></p>
            <a href="#" class="btn" id="reply-btn" target="_blank">✉️ Répondre</a>
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

        function toggleArchived() {
            const archived = document.getElementById('archived-messages');
            archived.style.display = (archived.style.display === 'none' || archived.style.display === '') ? 'block' : 'none';
        }

        function openModal(displayName, email, message) {
            document.getElementById('modal-email').textContent = "De : " + displayName;
            document.getElementById('modal-message').textContent = message;
            document.getElementById('reply-btn').href = "mailto:" + email;
            document.getElementById('modal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('modal').style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target === document.getElementById('modal')) {
                closeModal();
            }
        }
    </script>
</body>
</html>
