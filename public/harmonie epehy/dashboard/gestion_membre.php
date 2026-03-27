<?php
// gestion_membre.php
require_once '../connexion.php';
require 'auth.php';

// Récupération des membres
$membres = $pdo->query("
    SELECT * FROM membre
    ORDER BY 
        CASE 
            WHEN LOWER(instrument) LIKE '%chef%' THEN 0
            WHEN instrument LIKE 'Flûte%' THEN 1
            WHEN instrument LIKE 'Hautbois%' THEN 2
            WHEN instrument LIKE 'Basson%' THEN 3
            WHEN instrument LIKE 'Clarinette%' THEN 4
            WHEN instrument LIKE 'Saxophone%' THEN 5
            WHEN instrument LIKE 'Trompette%' THEN 6
            WHEN instrument LIKE 'Cor%' THEN 7
            WHEN instrument LIKE 'Trombone%' THEN 8
            WHEN instrument LIKE 'Euphonium%' THEN 9
            WHEN instrument LIKE 'Tuba%' THEN 10
            WHEN instrument LIKE 'Percussion%' THEN 11
            ELSE 99
        END,
        nom
")->fetchAll();


require '../include/header.php';
?>

<style>
/* Sidebar : toujours sombre, non impactée par dark-mode */
.sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 220px;
    background-color: #2c3e50; /* sombre fixe */
    color: white;
    padding: 20px;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

.sidebar .logo h2 {
    color: #ecf0f1;
    margin-bottom: 30px;
}

.sidebar nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar nav ul li {
    margin: 15px 0;
}

.sidebar nav ul li a {
    color: #ecf0f1;
    text-decoration: none;
    display: block;
}

.sidebar nav ul li a:hover {
    text-decoration: underline;
}

.sidebar nav ul li.section-title {
    margin-top: 30px;
    font-size: 0.9em;
    color: #bdc3c7;
    text-transform: uppercase;
}

/* Corps principal */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f5f7fa;
    color: #333;
    transition: background-color 0.3s, color 0.3s;
}

.dark-mode {
    background-color: #1e1e1e;
    color: #f0f0f0;
}

.page-wrapper {
    display: flex;
    flex: 1; /* occupe tout l'espace vertical sauf footer */
    min-height: calc(100vh - 50px);
}

.main-content {
    margin-left: 220px; /* largeur sidebar */
    padding: 2rem;
    flex: 1;
    background-color: #fff;
    transition: background-color 0.3s;
    box-sizing: border-box;
}

.dark-mode .main-content {
    background-color: #121212;
}

/* Titre + bouton ajout alignés côte à côte */
.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.header-actions h1 {
    margin: 0;
    font-size: 2rem;
}

.header-actions a.button-add {
    padding: 6px 12px;
    background-color: #4f46e5;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;
    font-size: 0.9rem;
    user-select: none;
    transition: background-color 0.3s;
}

.header-actions a.button-add:hover {
    background-color: #3b3bbf;
}

/* Liste membres */
ul.members-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

ul.members-list li {
    display: flex;
    align-items: center;
    background-color: #fff;
    margin-bottom: 1rem;
    padding: 0.8rem 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 0.05);
    transition: background-color 0.3s;
}

.dark-mode ul.members-list li {
    background-color: #2c2c2c;
}

.members-list img.photo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 1rem;
    border: 2px solid #4f46e5;
}

.member-info {
    flex: 1;
    font-size: 1rem;
}

.member-info strong {
    display: block;
    font-weight: 700;
}

.member-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.member-actions a {
    color: #4f46e5;
    text-decoration: none;
    font-size: 1.1rem;
    cursor: pointer;
    user-select: none;
}

.member-actions a.delete:hover {
    color: #e3342f;
}

/* Bouton toggle thème */
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

.dark-mode #theme-toggle {
    background: #333;
    border-color: #555;
    color: #eee;
}

/* Footer */
footer {
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #222;
    color: white;
    flex-shrink: 0;
    width: 100%;
}
</style>

<?php include 'slidebar.php'; ?>

<div class="page-wrapper">
    <main class="main-content">
        <div class="header-actions">
            <h1>Gestion des membres</h1>
            <a href="ajouter_membre.php" class="button-add" title="Ajouter un membre">+ Ajouter</a>
        </div>

        <ul class="members-list">
            <?php foreach ($membres as $m): ?>
                <li>
                    <?php
                    if ($m['photo']) {
                        $base64 = base64_encode($m['photo']);
                        echo "<img src='data:image/jpeg;base64,$base64' alt='Photo de ".htmlspecialchars($m['prenom'])."' class='photo'>";
                    } else {
                        echo "<img src='default.jpg' alt='Photo par défaut' class='photo'>";
                    }
                    ?>
                    <div class="member-info">
                        <strong><?= htmlspecialchars($m['prenom'] . ' ' . $m['nom']) ?></strong>
                        <span><?= htmlspecialchars($m['instrument']) ?></span>
                    </div>
                    <div class="member-actions">
                        <a href="edit_membre.php?id=<?= $m['id'] ?>" title="Modifier">&#9998;</a> <!-- ✎ -->
                        <a href="supprimer_membre.php?id=<?= $m['id'] ?>" class="delete" title="Supprimer" onclick="return confirm('Voulez-vous vraiment supprimer ce membre ?');">&#128465;</a> <!-- 🗑 -->
                    </div>
                </li>
            <?php endforeach; ?>
        </ul>
    </main>
</div>

<button id="theme-toggle" class="theme-toggle">🌙 Mode sombre</button>

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

<?php require '../include/footer.php'; ?>
