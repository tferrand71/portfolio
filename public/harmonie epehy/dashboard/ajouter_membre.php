<?php
// ajouter_membre.php
require_once '../connexion.php';
require 'auth.php';

$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom = trim($_POST['nom'] ?? '');
    $prenom = trim($_POST['prenom'] ?? '');
    $instrument = trim($_POST['instrument'] ?? '');

    // Validation simple
    if ($nom === '') $errors[] = "Le nom est obligatoire.";
    if ($prenom === '') $errors[] = "Le prénom est obligatoire.";
    if ($instrument === '') $errors[] = "L'instrument est obligatoire.";

    // Gestion du fichier photo
    $photoData = null;
    if (!empty($_FILES['photo']['tmp_name'])) {
        $fileTmp = $_FILES['photo']['tmp_name'];
        $fileType = mime_content_type($fileTmp);
        if (strpos($fileType, 'image/') !== 0) {
            $errors[] = "Le fichier photo doit être une image.";
        } else {
            $photoData = file_get_contents($fileTmp);
        }
    }

    if (empty($errors)) {
        $stmt = $pdo->prepare("INSERT INTO membre (nom, prenom, instrument, photo) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nom, $prenom, $instrument, $photoData]);
        header('Location: gestion_membre.php');
        exit;
    }
}

require '../include/header.php';
?>

<style>
body {
    background-color: #f4f4f4;
    color: #333;
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    margin-left: 20px;
}

body.dark-mode {
    background-color: #121212;
    color: #e0e0e0;
}

.main {
    margin-left: 220px; /* largeur sidebar */
    padding: 30px 40px;
    min-height: 100vh;
    box-sizing: border-box;
    background: white;
}

body.dark-mode .main {
    background-color: #1e1e1e;
    color: #e0e0e0;
}

form {
    background: white;
    padding: 25px 30px;
    border-radius: 8px;
    max-width: 600px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}

body.dark-mode form {
    background-color: #2c2c2c;
    color: #e0e0e0;
}

label {
    display: block;
    margin-bottom: 15px;
    font-weight: 600;
}

input[type="text"],
input[type="file"] {
    width: 100%;
    padding: 10px 12px;
    margin-top: 6px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
}

body.dark-mode input[type="text"],
body.dark-mode input[type="file"] {
    background-color: #3a3a3a;
    color: #f0f0f0;
    border: 1px solid #555;
}

input[type="text"]:focus,
input[type="file"]:focus {
    border-color: #007bff;
    outline: none;
}

button[type="submit"] {
    background-color: #007bff;
    color: white;
    font-weight: 700;
    border: none;
    padding: 12px 0;
    width: 100%;
    border-radius: 6px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
    background-color: #0056b3;
}

body.dark-mode button[type="submit"] {
    background-color: #0d6efd;
    color: white;
}

/* Conteneur bouton toggle thème */
.theme-toggle-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
}

#theme-toggle {
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    padding: 10px 20px;
    font-size: 1rem;
    transition: background-color 0.3s, color 0.3s;
    user-select: none;
}

#theme-toggle:hover {
    background-color: #e0e0e0;
}

body.dark-mode #theme-toggle {
    background: #333;
    border-color: #555;
    color: #eee;
}
</style>

<?php include 'slidebar.php'; ?>

<div class="main">
    <div class="theme-toggle-container">
        <button id="theme-toggle" class="theme-toggle">🌙 Mode sombre</button>
    </div>

    <h1>➕ Ajouter un membre</h1>

    <?php if (!empty($errors)): ?>
        <div style="color: #e3342f; margin-bottom: 1rem;">
            <ul>
                <?php foreach ($errors as $err): ?>
                    <li><?= htmlspecialchars($err) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <form action="" method="post" enctype="multipart/form-data">
        <label for="nom">Nom :
            <input type="text" id="nom" name="nom" required value="<?= htmlspecialchars($_POST['nom'] ?? '') ?>">
        </label>
        <label for="prenom">Prénom :
            <input type="text" id="prenom" name="prenom" required value="<?= htmlspecialchars($_POST['prenom'] ?? '') ?>">
        </label>
        <label for="instrument">Instrument :
            <input type="text" id="instrument" name="instrument" required value="<?= htmlspecialchars($_POST['instrument'] ?? '') ?>">
        </label>
        <label for="photo">Photo :
            <input type="file" id="photo" name="photo" accept="image/*">
        </label>
        <button type="submit">Ajouter</button>
    </form>
</div>

<script>
const toggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Initialisation mode
if (localStorage.getItem('theme') === 'dark' || (prefersDark && !localStorage.getItem('theme'))) {
    document.body.classList.add('dark-mode');
    toggle.textContent = '☀️ Mode clair';
} else {
    toggle.textContent = '🌙 Mode sombre';
}

toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const darkMode = document.body.classList.contains('dark-mode');
    toggle.textContent = darkMode ? '☀️ Mode clair' : '🌙 Mode sombre';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
});
</script>