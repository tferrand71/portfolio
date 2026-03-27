<?php
require_once '../connexion.php';
require 'auth.php';

// Sécurité d'accès selon le rôle
if (!in_array($_SESSION['role'], ['admin', 'president'])) {
    header('Location: dashboard.php');
    exit;
}

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('Location: gestion_utilisateur.php');
    exit;
}

$id = (int) $_GET['id'];
$utilisateur = $pdo->prepare("SELECT * FROM utilisateurs WHERE id = ?");
$utilisateur->execute([$id]);
$utilisateur = $utilisateur->fetch();

if (!$utilisateur) {
    header('Location: gestion_utilisateur.php');
    exit;
}

// Si président, il ne peut modifier que chef ou contact
if ($_SESSION['role'] === 'president' && !in_array($utilisateur['role'], ['chef', 'contact'])) {
    header('Location: gestion_utilisateur.php');
    exit;
}

$roles = ['admin', 'president', 'chef', 'contact'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom = $_POST['nom'] ?? '';
    $prenom = $_POST['prenom'] ?? '';
    $mail = $_POST['mail'] ?? '';
    $role = $_POST['role'] ?? '';
    $password = $_POST['password'] ?? '';
    $password_confirm = $_POST['password_confirm'] ?? '';

    if ($password !== $password_confirm) {
        $error = "Les mots de passe ne correspondent pas.";
    }

    if ($_SESSION['role'] === 'president' && !in_array($role, ['chef', 'contact'])) {
        $error = "Vous ne pouvez pas affecter ce rôle.";
    } elseif (in_array($role, $roles)) {
        $stmt = $pdo->prepare("UPDATE utilisateurs SET nom = ?, prenom = ?, mail = ?, role = ? WHERE id = ?");
        $stmt->execute([$nom, $prenom, $mail, $role, $id]);
        header('Location: gestion_utilisateur.php');
        exit;
    } else {
        $error = "Rôle invalide.";
    }
}

include '../include/header.php';
include 'slidebar.php';
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Modifier utilisateur</title>
    <link rel="stylesheet" href="admin.css" />
    <style>
        :root {
            --bg-light: #f5f7fa;
            --bg-dark: #1e1e1e;
            --text-light: #333;
            --text-dark: #f0f0f0;
        }

        body {
            background-color: var(--bg-light);
            color: var(--text-light);
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 2rem;
        }

        .dark-mode {
            background-color: var(--bg-dark);
            color: var(--text-dark);
        }

        form {
            max-width: 500px;
            margin: auto;
            background: white;
            padding: 2rem;
            border-radius: 8px;
        }

        .dark-mode form {
            background: #2c2c2c;
            color: var(--text-dark);
        }

        label {
            display: block;
            margin-top: 1rem;
        }

        input, select {
            width: 100%;
            padding: 0.5rem;
            margin-top: 0.5rem;
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        .dark-mode input, .dark-mode select {
            background: #444;
            color: #eee;
            border: 1px solid #666;
        }

        button {
            margin-top: 1.5rem;
            padding: 10px 20px;
            background: #4f46e5;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        #theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 20px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
        }
        body.dark-mode #theme-toggle {
            background: #333;
            border-color: #555;
            color: #eee;
        }

        .error {
            color: red;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <button id="theme-toggle" class="theme-toggle">🌙 Mode sombre</button>

    <h1>Modifier utilisateur</h1>

    <form method="post">
        <label for="nom">Nom</label>
        <input type="text" name="nom" id="nom" value="<?= htmlspecialchars($utilisateur['nom'] ?? '') ?>" required>

        <label for="prenom">Prénom</label>
        <input type="text" name="prenom" id="prenom" value="<?= htmlspecialchars($utilisateur['prenom'] ?? '') ?>" required>

        <label for="mail">Email</label>
        <input type="email" name="mail" id="mail" value="<?= htmlspecialchars($utilisateur['mail'] ?? '') ?>" required>

        <label for="role">Rôle</label>
        <select name="role" id="role" required>
            <?php foreach ($roles as $r): ?>
                <?php
                    if ($_SESSION['role'] === 'president' && !in_array($r, ['chef', 'contact'])) continue;
                    $selected = ($utilisateur['role'] === $r) ? 'selected' : '';
                ?>
                <option value="<?= $r ?>" <?= $selected ?>><?= ucfirst($r) ?></option>
            <?php endforeach; ?>
        </select>

        <label for="password">Nouveau mot de passe (laisser vide pour ne pas modifier)</label>
        <input type="password" name="password" id="password">

        <label for="password_confirm">Confirmer le mot de passe</label>
        <input type="password" name="password_confirm" id="password_confirm">

        <button type="submit">Enregistrer</button>
        <?php if (!empty($error)) echo "<div class='error'>" . htmlspecialchars($error) . "</div>"; ?>
    </form>

    <script>
        const toggle = document.getElementById('theme-toggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (localStorage.getItem('theme') === 'dark' || (prefersDark && !localStorage.getItem('theme'))) {
            document.body.classList.add('dark-mode');
            toggle.textContent = '☀️ Mode clair';
        }

        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const darkMode = document.body.classList.contains('dark-mode');
            toggle.textContent = darkMode ? '☀️ Mode clair' : '🌙 Mode sombre';
            localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        });
    </script>
</body>
</html>
