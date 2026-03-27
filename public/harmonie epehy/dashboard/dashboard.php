<?php
require_once '../connexion.php';
require_once 'auth.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
function fetchAll(PDO $pdo, string $sql, array $params = []): array {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

try {
    $membres = fetchAll($pdo, "SELECT * FROM membre ORDER BY date_inscription DESC LIMIT 5");
    $morceaux = fetchAll($pdo, "SELECT * FROM morceaux ORDER BY derniere_interpretation DESC LIMIT 5");
    $messages = fetchAll($pdo, "SELECT * FROM contact WHERE archive = 0 ORDER BY created_at");
    $medias = fetchAll($pdo, "SELECT * FROM galerie");
    $utilisateurs = fetchAll($pdo, "SELECT * FROM utilisateurs ORDER BY nom ASC");
    $contenus = fetchAll($pdo, "SELECT * FROM contenu WHERE id = 1");

    $contenuMap = [];
    foreach ($contenus as $contenu) {
        $contenuMap[$contenu['id']] = $contenu['text'];
    }
    $concerts = fetchAll($pdo, "SELECT * FROM concert ORDER BY date DESC LIMIT 5");
} catch (PDOException $e) {
    echo "<p class='error'>Erreur base de données : " . htmlspecialchars($e->getMessage()) . "</p>";
    exit;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <title>Dashboard</title>
    <style>
        /* Variables de couleurs */
        :root {
            --primary-color: #4f46e5;
            --bg-light: #f9fafb;
            --bg-dark: #121212;
            --text-light: #333;
            --text-dark: #eee;
            --card-bg-light: #fff;
            --card-bg-dark: #1e1e1e;
            --sidebar-width: 245px;
        }

        /* Reset & base */
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-light);
            color: var(--text-light);
            transition: background-color 0.3s, color 0.3s;
            padding-left: var(--sidebar-width);
        }

        body.dark-mode {
            background-color: var(--bg-dark);
            color: var(--text-dark);
        }

        a {
            color: var(--primary-color);
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }

        /* Sidebar incluse */
        <?php include 'slidebar.css'; /* ou directement ton CSS de slidebar ici */ ?>

        /* Conteneur principal */
        main.dashboard {
            padding: 2rem 3rem;
            max-width: 1200px;
            margin: auto;
        }

        h1 {
            font-weight: 700;
            font-size: 2.2rem;
            margin-bottom: 1.5rem;
        }

        /* Bouton toggle mode sombre */
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

        /* Grille des stats */
        .stats-grid {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        }
        .stats-grid .card {
            flex: 1 1 150px;
            background-color: var(--card-bg-light);
            padding: 1.2rem 1.5rem;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
            color: var(--text-light);
            transition: background-color 0.3s, color 0.3s;
        }
        body.dark-mode .stats-grid .card {
            background-color: var(--card-bg-dark);
            color: var(--text-dark);
            box-shadow: 0 2px 6px rgb(255 255 255 / 0.1);
        }

        /* Layout sections */
        .dashboard-layout {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 colonnes */
    gap: 2rem;
    margin-bottom: 3rem;
}


        section {
            background-color: var(--card-bg-light);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
            transition: background-color 0.3s, color 0.3s;
        }
        body.dark-mode section {
            background-color: var(--card-bg-dark);
            color: var(--text-dark);
            box-shadow: 0 2px 6px rgb(255 255 255 / 0.1);
        }

        section h2 {
            margin-top: 0;
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        section h2 a {
            color: inherit;
        }

        section ul {
            list-style: none;
            padding-left: 0;
            margin: 0;
            max-height: 160px;
            overflow-y: auto;
        }
        section ul li {
            margin-bottom: 0.75rem;
            font-weight: 500;
            border-bottom: 1px solid #eee;
            padding-bottom: 0.25rem;
        }
        body.dark-mode section ul li {
            border-color: #444;
        }

        /* Galerie media */
        .media-gallery {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
        }
        .media-gallery img {
            width: calc(20% - 0.8rem);
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            object-fit: cover;
            height: 80px;
            transition: transform 0.2s;
        }
        .media-gallery img:hover {
            transform: scale(1.1);
            cursor: pointer;
        }

        /* Présentation et actualités */
        .contenu-block {
            max-height: 160px;
            overflow-y: auto;
            white-space: pre-wrap;
            font-size: 0.95rem;
            line-height: 1.4;
            color: var(--text-light);
        }
        body.dark-mode .contenu-block {
            color: var(--text-dark);
        }

        /* Concerts list */
        .concert-list {
            list-style: none;
            padding-left: 0;
            max-height: 200px;
            overflow-y: auto;
        }
        .concert-list li {
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #eee;
        }
        body.dark-mode .concert-list li {
            border-color: #444;
        }
        .concert-list img {
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            max-height: 80px;
            margin-top: 5px;
            display: block;
        }

        /* Scrollbar styling */
        section ul::-webkit-scrollbar,
        .contenu-block::-webkit-scrollbar {
            width: 6px;
        }
        section ul::-webkit-scrollbar-thumb,
        .contenu-block::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 3px;
        }
    </style>
</head>
<body>

<?php include 'slidebar.php'; ?>

<main class="dashboard" role="main" aria-label="Tableau de bord">

  <button id="theme-toggle" aria-pressed="false" aria-label="Basculer le mode sombre" class="theme-toggle">🌙 Mode sombre</button>

  <h1>Bienvenue, <?= htmlspecialchars($_SESSION['nom'] ?? $_SESSION['username']) ?> 👋</h1>

  <div class="stats-grid" role="region" aria-label="Statistiques rapides">
      <div class="card" tabindex="0">👥 <?= count($membres) ?> membres</div>
      <div class="card" tabindex="0">🎵 <?= count($morceaux) ?> morceaux</div>
      <div class="card" tabindex="0">✉️ <?= count($messages) ?> messages</div>
      <div class="card" tabindex="0">🖼️ <?= count($medias) ?> médias</div>
  </div>


  <div class="dashboard-layout">

    <section class="membres" aria-labelledby="membres-title">
      <h2 id="membres-title"><a href="gestion_membre.php">Membres adhérents</a></h2>
      <ul>
          <?php foreach ($membres as $m): ?>
              <li><?= htmlspecialchars($m['prenom']) ?> <?= htmlspecialchars($m['nom']) ?></li>
          <?php endforeach; ?>
      </ul>
    </section>

    <section class="messages" aria-labelledby="messages-title">
      <h2 id="messages-title"><a href="gestion_messages.php">Messages</a></h2>
      <ul>
          <?php foreach (array_slice($messages, 0, 5) as $msg): ?>
              <li><strong><?= htmlspecialchars($msg['email']) ?>:</strong> <?= htmlspecialchars(substr($msg['message'], 0, 50)) ?>...</li>
          <?php endforeach; ?>
      </ul>
    </section>

    <?php if (isset($_SESSION['role'])): ?>
    <section class="utilisateurs" aria-labelledby="utilisateurs-title">
      <h2 id="utilisateurs-title"><a href="gestion_utilisateur.php">Utilisateurs</a></h2>
      <ul>
         <?php foreach (array_slice($utilisateurs, 0, 5) as $u): ?>
              <li><?= htmlspecialchars($u['prenom']) ?> <?= htmlspecialchars($u['nom']) ?> (<?= htmlspecialchars($u['role']) ?>)</li>
          <?php endforeach; ?>
      </ul>
    </section>
    <?php endif; ?>

    <section class="morceaux" aria-labelledby="morceaux-title">
      <h2 id="morceaux-title"><a href="gestion_morceaux.php">Morceaux</a></h2>
      <ul>
          <?php foreach ($morceaux as $m): ?>
              <li><?= htmlspecialchars($m['titre']) ?> – <?= htmlspecialchars($m['compositeur']) ?></li>
          <?php endforeach; ?>
      </ul>
    </section>

    <section class="galerie" aria-labelledby="galerie-title">
  <h2 id="galerie-title"><a href="gestion_galerie.php">Galerie</a></h2>
  <div class="media-gallery" role="list">
      <?php foreach (array_slice($medias, 0, 5) as $media): ?>
          <?php if (str_starts_with($media['type_mime'], 'image')): ?>
              <img src="<?= htmlspecialchars($media['chemin']) ?>" alt="<?= htmlspecialchars($media['titre'] ?: 'Image') ?>" />
          <?php endif; ?>
      <?php endforeach; ?>
  </div>
</section>


    <section class="presentation" aria-labelledby="presentation-title">
      <h2 id="presentation-title"><a href="gestion_contenu.php?id=1">Présentation</a></h2>
      <div class="contenu-block"><?= nl2br(htmlspecialchars($contenuMap[1] ?? 'Contenu indisponible')) ?></div>
    </section>

  </div>

 

    <section class="concerts" aria-labelledby="concerts-title">
    <h2 id="concerts-title"><a href="gestion_concert.php">Concerts</a></h2>
    <ul class="concert-list">
        <?php foreach ($concerts as $concert): ?>
            <li>
                <strong><?= htmlspecialchars($concert['titre']) ?></strong> – <?= date("d/m/Y", strtotime($concert['date'])) ?><br />
                <?php if (!empty($concert['affiche'])): ?>
                    <img src="data:image/jpeg;base64,<?= base64_encode($concert['affiche']) ?>" alt="Affiche du concert <?= htmlspecialchars($concert['titre']) ?>" />
                <?php else: ?>
                    <em>Pas d'affiche</em>
                <?php endif; ?>
            </li>
        <?php endforeach; ?>
    </ul>
  </section>

</main>

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
