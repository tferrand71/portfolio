<?php if (session_status() === PHP_SESSION_NONE) { session_start(); } ?>
<link rel="icon" href="/images/logo.jpg" type="image/jpeg"/>
<style>
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 220px;
        background-color: #2c3e50;
        color: white;
        padding: 20px;
    }

    .sidebar .logo h2 {
        color: #ecf0f1;
        margin-bottom: 30px;
    }

    .sidebar nav ul {
        list-style: none;
        padding: 0;
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
</style>

<aside class="sidebar">
    <div class="logo">
        <h2>🎶 Dashboard</h2>
    </div>
    <nav>
        <ul>
            <li><a href="../index.php">🏡 Accueil du site</a></li>
            <li><a href="dashboard.php">📊 Tableau de bord</a></li>

            <li class="section-title">Gestion</li>
            <li><a href="gestion_galerie.php">🖼️ Galerie</a></li>
            <li><a href="gestion_messages.php">📨 Messages</a></li>
            <li><a href="gestion_membre.php">👤 Membres</a></li>
            <li><a href="gestion_morceaux.php">🎶 Morceaux</a></li>
            <li><a href="gestion_concert.php">🎤 Concerts</a></li> <!-- 🔥 Lien ajouté -->
            <li><a href="gestion_utilisateur.php">🔒 Utilisateurs</a></li>

            <li><a href="disconnect.php">🚪 Déconnexion</a></li>
        </ul>
    </nav>
</aside>
